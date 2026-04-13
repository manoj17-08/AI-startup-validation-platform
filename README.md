# 🚀 Automated Startup Validator

A high-fidelity AI-powered dashboard that validates startup ideas using autonomous agents. Built with **CrewAI**, **React**, **FastAPI**, ,**Gemini**, **Tavily**

## ✨ Features

-   **Autonomous Agents**:
    -   🕵️ **Market Researcher**: Scours the web for competitors and trends.
    -   ⚖️ **Cynical Critic**: Brutally analyzes risks and failure points.
    -   🎯 **Strategic Planner**: Synthesizes a massive 10-point feasibility breakdown.
-   **Dual-Mode Inputs**: Feed the LLM a single vague line, or a highly rigid 4-point blueprint for maximum precision.
-   **Real-time Agent Streaming**: Watch the AI control room stream thought payloads natively via SSE.
-   **Exportable Consulting Output**: Generate dynamic, rigorous consulting-level PDF reports summarizing Radar parameters, SWOT arrays, and strategic business pivots.

## 🛠️ Setup

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/manoj17-08/startup-validator.git
    cd startup-validator
    ```

2.  **Install Python Dependencies (Backend)**:
    Requires Python 3.10+.
    ```bash
    pip install -r python_core/requirements.txt
    ```

3.  **Install NPM Dependencies (Frontend)**:
    ```bash
    npm install
    ```

4.  **Environment Variables**:
    Create a `.env` file in the root directory and add your API keys:
    ```env
    GOOGLE_API_KEY=your_gemini_api_key
    TAVILY_API_KEY=your_tavily_api_key
    ```

## 🚀 Run the App

1. **Start the FastAPI Backend**:
   Open a terminal and run:
   ```bash
   uvicorn python_core.main:app --reload --host 0.0.0.0 --port 8000
   ```

2. **Start the Vite/React Frontend**:
   Open a new terminal tab and run:
   ```bash
   npm run dev
   ```
   The React app will open in your browser at `http://localhost:5173`.

## ⚠️ Note on API Limits

The app uses the free tier of Google Gemini API, which has a rate limit of **15 requests per minute**.
-   If you see a "Volume Limit Reached" warning, **wait 60 seconds** before trying again.
-   The app includes automatic rate limiting to help prevent this.
