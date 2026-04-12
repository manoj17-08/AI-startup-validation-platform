import os
from crewai import Agent, LLM
from dotenv import load_dotenv
from tools import market_search_tool

load_dotenv()

# Initialize Gemini LLM
# We use the standard model for reasoning.
llm = LLM(
    # Using alias for latest stable flash model
    model="gemini/gemini-flash-latest",
    api_key=os.getenv("GOOGLE_API_KEY"),
    temperature=0.7
)

def create_agents():
    # 1. Market Researcher
    researcher = Agent(
        role='Senior Market Researcher',
        goal='Uncover the latest market trends, competitors, and customer needs for the proposed startup idea: {idea}',
        verbose=True,
        memory=True,
        backstory=(
            "You are an expert market researcher with a keen eye for detail. "
            "You dig deep into the internet to find real-time data, avoiding hallucinations. "
            "You prioritize factual evidence from 2024-2026. "
            "You are not afraid to say if a market is saturated."
        ),
        tools=[market_search_tool],
        llm=llm,
        allow_delegation=False,
        max_rpm=10
    )

    # 2. Cynical Critic
    critic = Agent(
        role='Cynical Venture Capitalist',
        goal='Ruthlessly analyze the startup idea and the market research to identify every possible risk, flaw, and failure point.',
        verbose=True,
        memory=True,
        backstory=(
            "You are a veteran venture capitalist who has seen thousands of startups fail. "
            "You are skeptical, hard-to-please, and brutally honest. "
            "Your job is to save the founder from financial ruin by exposing weak assumptions. "
            "You look for 'hair on fire' problems and dismiss 'nice to haves'."
        ),
        llm=llm,
        allow_delegation=False,
        max_rpm=10
    )

    # 3. Strategic Planner
    planner = Agent(
        role='Strategic Startup Consultant',
        goal='Synthesize the research and criticism into a concrete actionable roadmap for success, or a recommendation to pivot.',
        verbose=True,
        memory=True,
        backstory=(
            "You are a master strategist. You take raw data and critical feedback to formulate a winning game plan. "
            "You are optimistic but grounded in reality. "
            "Your report must be structured, actionable, and address the risks raised by the Critic."
        ),
        llm=llm,
        allow_delegation=False,
        max_rpm=10
    )
    
    return researcher, critic, planner
