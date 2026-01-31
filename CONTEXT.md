# PROJECT: CodeRonin (Agentathon 2026)
# TEAM: Amitesh, Kaustubh, Abhinav (AnduPandu Society)
# TAGLINE: The only coding platform that fights back.

## 1. VISION & PROBLEM STATEMENT
- **The Issue:** Traditional platforms (LeetCode, Codecademy) only teach the "Happy Path."
- **The Reality:** 80% of dev time is spent on the "Sad Path" (debugging, edge cases, library quirks).
- **The Solution:** CodeRonin is a "Debug Dojo" where an AI "Saboteur" actively injects realistic bugs into the user's workspace to build resilience and deep library comprehension.

## 2. CORE ARCHITECTURE (Thick-Client Strategy)
To maximize performance in a 10-hour hackathon, we use a **Serverless Thick-Client** approach:
- **Execution Engine:** Pyodide (Python 3.12+ runtime) running entirely in the browser. No backend containers.
- **AI Agent:** Gemini 2.0 Flash via Client-Side SDK (Low latency, high speed).
- **Database:** Supabase (Auth and Persistence via Client SDK).
- **Protocol:** Mocked MCP (Model Context Protocol). Instead of a separate MCP server, the Agent queries local JSON "Chaos Files" containing common library error patterns (NumPy, Pandas, etc.).

## 3. TECH STACK & DEPENDENCIES
- **Framework:** React 19 + Vite (TypeScript + SWC).
- **Editor:** @monaco-editor/react (VS Code core).
- **Animations:** Framer Motion (Glitch effects, neon transitions).
- **Styling:** Tailwind CSS v3 + animate.css.
- **Icons:** Lucide React.
- **Sound/Polish:** React-Confetti (for the "Win" state).

## 4. GAME MECHANICS
- **The Chaos Meter:** A UI progress bar that fills as the user writes code.
- **The Sabotage:** When the meter hits 100%, the AI Agent analyzes the Monaco buffer and performs an "Injection":
    1. **Syntax Goblin:** Beginner bugs (missing colons, typos).
    2. **Logic Gremlin:** Intermediate bugs (off-by-one errors, state mutation issues).
    3. **Semantic Impostor:** Advanced bugs (subtle library misuses based on actual documentation).
- **Win State:** User must fix the injected bug and pass the Pyodide test cases to clear the level.

## 5. UI/UX DESIGN SYSTEM (Cyberpunk Dojo)
- **Theme:** Dark Mode Only (#050505 background).
- **Primary Color:** Neon Cyan (#00f3ff) for success and borders.
- **Danger Color:** Glitch Red (#ff003c) for sabotage and errors.
- **Fonts:**
    - Headings: 'Orbitron' (Cyberpunk aesthetic).
    - Code: 'JetBrains Mono' (Professional feel).
- **Atmosphere:** Terminal-style overlays, CRT scanline effects, and reactive glitch animations.

## 6. PAGE FLOW & ROUTING
1. **Landing** (`Landing.tsx`) — Short intro animation, then cut to Login.
2. **Auth** — **Login** (`Login.tsx`). If new user → **Register** (`Register.tsx`) → after signup return to Login. **Supabase** handles auth and session/caching.
3. **Skills** (`Skills.tsx`) — Four skill buttons: **Pandas**, **OOPS**, **CP**, **Cryptograph**. Selection is persisted (backend/Supabase) and drives which chaos knowledge/agent behavior is used.
4. **Difficulty** (`Difficulty.tsx`) — Three difficulty buttons matching game mechanics:
   - **Syntax Goblin:** Beginner bugs (missing colons, typos).
   - **Logic Gremlin:** Intermediate bugs (off-by-one errors, state mutation issues).
   - **Semantic Impostor:** Advanced bugs (subtle library misuses from docs).  
   Selection is persisted (backend/Supabase).
5. **Arena** (`Arena.tsx`) — Main dojo (Monaco + Pyodide). **TODO:** Add test cases to the terminal bar; make terminal bar smaller; add bottom margins so it doesn’t touch the screen edge.

## 7. FILE STRUCTURE & GUIDELINES
- `src/components/Landing.tsx`: Intro animation, then navigate to Login.
- `src/components/Login.tsx`: Sign-in (Supabase). Link to Register for new users.
- `src/components/Register.tsx`: Sign-up (Supabase). On success, redirect to Login.
- `src/components/Skills.tsx`: Skill selection (Pandas / OOPS / CP / Cryptograph); persists selection.
- `src/components/Difficulty.tsx`: Difficulty selection (Syntax Goblin / Logic Gremlin / Semantic Impostor); persists selection.
- `src/components/Arena.tsx`: The heart of the app (Monaco + Pyodide output, terminal with test cases, smaller bar, bottom margins).
- `src/lib/supabase.ts`: Supabase client (auth + optional persistence/caching).
- `src/lib/pyodide.ts`: Singleton to manage Python runtime.
- `src/lib/gemini.ts`: Saboteur Agent logic.
- `src/data/chaos-knowledge.ts`: The "Documentation Knowledge Base" for the Agent.
- `.env.local`: `VITE_GEMINI_API_KEY`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`. (DO NOT COMMIT).