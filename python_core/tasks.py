from crewai import Task

def create_tasks(researcher, critic, planner):
    # 1. Research Task
    research_task = Task(
        description=(
            "Conduct a comprehensive market analysis for the startup idea: '{idea}'. "
            "Identify at least 4 major competitors, their key weaknesses, and current market trends for 2024-2026. "
            "Look for recent news or funding rounds in this space."
        ),
        expected_output=(
            "A detailed market research report containing competitor analysis, "
            "market size estimation, and key consumer trends."
        ),
        agent=researcher
    )

    # 2. Critique Task
    critique_task = Task(
        description=(
            "Review the research findings and the original idea: '{idea}'. "
            "Play Devil's Advocate. List 5 specific reasons why this startup might fail. "
            "Focus on customer acquisition costs, technical feasibility, and market saturation."
        ),
        expected_output=(
            "A critical risk assessment report highlighting the top 5 dangers "
            "and potential pitfalls of the business model."
        ),
        agent=critic,
        context=[research_task] # Depends on research
    )

    # 3. Strategy Task
    strategy_task = Task(
        description=(
            "Based on the research and the critical feedback, develop a strategic roadmap. "
            "Address the specific risks raised by the Critic. "
            "Provide a final 'Go/No-Go' recommendation and a unique value proposition that avoids the identified pitfalls.\n"
            "You MUST output valid JSON exactly matching the expected output format without any extra text."
        ),
        expected_output=(
            "A JSON object exactly matching this format:\n"
            "{\n"
            '  "executive_summary": {\n'
            '    "startup_idea": "...",\n'
            '    "problem_statement": "...",\n'
            '    "target_users": "...",\n'
            '    "verdict": "Build / Pivot / Kill",\n'
            '    "key_reason": "1-line strongest reason",\n'
            '    "pivot_suggestion": "Suggested direction if Pivot, else N/A"\n'
            '  },\n'
            '  "market_analysis": {\n'
            '    "market_size": "Estimated size or \'Unknown - needs validation\'",\n'
            '    "growth_trend": "High / Medium / Low",\n'
            '    "demand_signals": ["...", "...", "..."],\n'
            '    "key_insight": "1-line insight"\n'
            '  },\n'
            '  "competitor_analysis": {\n'
            '    "competitors": [{"name": "...", "strength": "...", "weakness": "..."}],\n'
            '    "competitive_insight": "Insight learned from playing field"\n'
            '  },\n'
            '  "risk_analysis": {\n'
            '    "risks": ["...", "...", "...", "..."],\n'
            '    "biggest_risk": "Most dangerous assumption"\n'
            '  },\n'
            '  "uvp": {\n'
            '    "points": ["...", "...", "..."],\n'
            '    "why_win": "Clear differentiation"\n'
            '  },\n'
            '  "roadmap": {\n'
            '    "phase1": ["...", "..."],\n'
            '    "phase2": ["...", "..."],\n'
            '    "phase3": ["...", "..."]\n'
            '  },\n'
            '  "feasibility": {\n'
            '    "market_demand": 8,\n'
            '    "competition": 7,\n'
            '    "execution": 6,\n'
            '    "monetization": 5,\n'
            '    "final_score": 6.5\n'
            '  },\n'
            '  "reality_check": {\n'
            '    "persona": "e.g., College student",\n'
            '    "reaction": "Realistic reaction logic",\n'
            '    "will_pay": "Yes / No / Maybe"\n'
            '  },\n'
            '  "recommendation": {\n'
            '    "decision": "Build / Pivot / Kill",\n'
            '    "reasoning": ["...", "..."],\n'
            '    "next_steps": ["...", "...", "..."]\n'
            '  },\n'
            '  "insight": "Hard-hitting final 1-line insight",\n'
            '  "swot": {\n'
            '    "strengths": ["...", "..."],\n'
            '    "weaknesses": ["...", "..."],\n'
            '    "opportunities": ["...", "..."],\n'
            '    "threats": ["...", "..."]\n'
            "  },\n"
            '  "radar": [\n'
            '    {"label": "Innovation", "value": 85},\n'
            '    {"label": "Feasibility", "value": 70},\n'
            '    {"label": "Market Size", "value": 90},\n'
            '    {"label": "Scalability", "value": 80},\n'
            '    {"label": "Moat", "value": 60}\n'
            "  ]\n"
            "}\n"
            "Ensure radar values are between 0 and 100."
        ),
        agent=planner,
        context=[research_task, critique_task] # Depends on both
    )
    
    return research_task, critique_task, strategy_task
