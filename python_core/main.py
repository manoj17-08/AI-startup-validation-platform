import os
import sys
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

import json
import logging
from queue import Queue
from threading import Thread
from typing import AsyncGenerator
import time

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from sse_starlette.sse import EventSourceResponse
from dotenv import load_dotenv

from crewai import Crew, Process
from agents import create_agents
from tasks import create_tasks

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO)

def map_agent_name(role: str) -> str:
    role = str(role).lower()
    if 'research' in role:
        return 'Researcher'
    if 'critic' in role or 'capitalist' in role:
        return 'Critic'
    return 'Planner'

@app.get("/api/stream")
async def stream_validation(idea: str, request: Request):
    q = Queue()

    def make_task_callback(agent_name):
        def callback(task_output):
            content = task_output.raw if hasattr(task_output, 'raw') else str(task_output)
            if agent_name == 'Planner':
                try:
                    clean_out = content.strip()
                    if clean_out.startswith("```json"):
                        clean_out = clean_out[7:]
                    if clean_out.endswith("```"):
                        clean_out = clean_out[:-3]
                    parsed_json = json.loads(clean_out.strip())
                    if "executive_summary" in parsed_json:
                        es = parsed_json.get("executive_summary", {})
                        verdict = es.get("verdict", "")
                        reason = es.get("key_reason", "")
                        insight = parsed_json.get("insight", "")
                        score = parsed_json.get("feasibility", {}).get("final_score", "")
                        
                        bullets = ["Final Report Assembled!"]
                        if score: bullets.append(f"• Feasibility Score: {score}/10")
                        if verdict: bullets.append(f"• Verdict: {verdict}")
                        if reason: bullets.append(f"• Key Reason: {reason}")
                        if insight: bullets.append(f"• Insight: {insight}")
                        
                        content = "\n".join(bullets)
                except:
                    pass
            q.put({
                "type": "final",
                "agent": agent_name,
                "content": content
            })
        return callback

    def make_step_callback(agent_name):
        def callback(step_output):
            items = step_output if isinstance(step_output, list) else [step_output]
            for item in items:
                if hasattr(item, 'tool') and hasattr(item, 'tool_input'):
                    thought = getattr(item, 'thought', '')
                    content = f"Thought: {thought}" if thought else f"Using tool: {item.tool} with {item.tool_input}"
                    q.put({
                        "type": "action",
                        "agent": agent_name,
                        "content": content
                    })
                elif not hasattr(item, 'output'):
                    if hasattr(item, 'result'):
                        continue
                    q.put({
                        "type": "thought",
                        "agent": agent_name,
                        "content": str(item)
                    })
        return callback

    def run_crew():
        try:
            researcher, critic, planner = create_agents()
            research_task, critique_task, strategy_task = create_tasks(researcher, critic, planner)
            
            research_task.callback = make_task_callback('Researcher')
            critique_task.callback = make_task_callback('Critic')
            strategy_task.callback = make_task_callback('Planner')
            
            researcher.step_callback = make_step_callback('Researcher')
            critic.step_callback = make_step_callback('Critic')
            planner.step_callback = make_step_callback('Planner')
            
            crew = Crew(
                agents=[researcher, critic, planner],
                tasks=[research_task, critique_task, strategy_task],
                verbose=True,
                process=Process.sequential
            )
            
            result = crew.kickoff(inputs={'idea': idea})
            
            raw_result = result.raw if hasattr(result, 'raw') else str(result)
            
            clean_result = raw_result.strip()
            if clean_result.startswith("```json"):
                clean_result = clean_result[7:]
            if clean_result.endswith("```"):
                clean_result = clean_result[:-3]
            
            q.put({
                "type": "completion",
                "content": clean_result.strip()
            })
        except Exception as e:
            logging.error(f"Error in CrewAI: {str(e)}")
            q.put({"type": "error", "content": str(e)})
        finally:
            q.put(None)

    thread = Thread(target=run_crew)
    thread.start()

    async def event_generator() -> AsyncGenerator[dict, None]:
        import asyncio
        while True:
            if await request.is_disconnected():
                break
            
            if q.empty():
                await asyncio.sleep(0.1)
                continue
                
            item = q.get()
            if item is None:
                break
                
            if item.get("type") == "completion":
                yield {
                    "event": "completion",
                    "data": json.dumps({"result": item["content"]})
                }
            elif item.get("type") == "error":
                yield {
                    "event": "error",
                    "data": json.dumps({"error": item["content"]})
                }
            else:
                # Add timestamp and id for UI
                item["timestamp"] = int(time.time() * 1000)
                item["id"] = str(time.time())
                yield {
                    "event": "message",
                    "data": json.dumps(item)
                }

    return EventSourceResponse(event_generator())

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
