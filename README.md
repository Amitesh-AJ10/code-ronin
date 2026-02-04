# CodeRonin 🥷

**The only coding platform that fights back.**

CodeRonin is a "Debug Dojo" where an AI "Saboteur" actively injects realistic bugs into your code to build resilience, debugging skills, and deep library comprehension. Fix the sabotaged code and pass strict test cases to level up.

## What is CodeRonin?

Traditional coding platforms only teach the "Happy Path." CodeRonin flips the script:

- **The Problem**: 80% of real dev time is spent debugging, handling edge cases, and dealing with library quirks.
- **The Solution**: An adversarial AI injects bugs into your workspace as you code. You must identify and fix them to progress.
- **The Result**: Deep, practical understanding of Python libraries and production-grade debugging skills.

## How It Works

### The Game Loop

1. **Select Your Skill**
   - Choose from: **Pandas** (data manipulation), **OOPS** (object-oriented programming), **CP** (competitive programming), or **Cryptography** (encryption & security).

2. **Choose Difficulty**
   - **Syntax Goblin** (Level 1): Beginner bugs (missing colons, typos, basic syntax errors).
   - **Logic Gremlin** (Level 2): Intermediate bugs (off-by-one errors, state mutations, logic flaws).
   - **Semantic Impostor** (Level 3): Advanced bugs (subtle library misuses based on actual documentation).

3. **Enter the Arena**
   - Write or complete Python code in Monaco Editor.
   - The **Chaos Meter** fills as you code.
   - At 100%, the AI Saboteur injects a stealthy bug into your code.

4. **Fix & Test**
   - Debug your code using the Terminal Output and Test Cases.
   - Pass all test cases to clear the level and earn the next challenge.

### Key Features

- **Resizable Split Layout**: Drag the editor/terminal divider to adjust workspace.
- **Real-time Python Execution**: Powered by Pyodide (WASM Python runtime, no server needed).
- **Dynamic Test Cases**: Fetch from backend; includes hidden tests to prevent cheating.
- **Sabotage Popup**: Alerts you when a bug is injected; auto-dismisses after 5 seconds or on click.
- **Level Progression**: Each cleared level increases difficulty and saboteur intensity.
- **Cyberpunk UI**: Dark mode, neon accents, glitch effects, scanlines, and particle animations.

## Tech Stack

### Frontend
- **React 19** + **Vite** (TypeScript + SWC)
- **Monaco Editor** (`@monaco-editor/react`) — VS Code core
- **Framer Motion** — animations and transitions
- **Tailwind CSS v3** — styling
- **Pyodide 0.24.1** — Python 3.12 runtime (WASM)
- **Lucide React** — icons

### Backend
- **Node.js** + **Express**
- **Groq API** (Llama 3) — AI Saboteur
- **Model Context Protocol (MCP)** — mocked for chaos knowledge

### Infrastructure
- **Supabase** — authentication & session management
- **pnpm workspaces** — monorepo management

## Installation & Setup

### Prerequisites
- **Node.js** ≥ 18.x
- **pnpm** ≥ 8.x

### 1. Clone the Repository
```bash
git clone <repository-url>
cd code-ronin
```

### 2. Install Dependencies
```bash
# Install frontend + server dependencies
pnpm install --filter=./server
pnpm install --filter=./
```

### 3. Environment Configuration

Create `.env.local` in the project root:
```env
GROQ_API_KEY=your-groq-api-key
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
SERPER_API_KEY=your-serper-api-key
```

### 4. Start the Development Stack

**Terminal 1: Start the Backend Server**
```bash
cd server
pnpm run dev
```
Server runs on `http://localhost:3001`

**Terminal 2: Start the Frontend Dev Server**
```bash
pnpm run dev
```
Frontend runs on `http://localhost:5173`

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Project Structure

```
code-ronin/
├── src/
│   ├── components/
│   │   ├── Landing.tsx       # Intro animation
│   │   ├── Login.tsx         # Login via Supabase
│   │   ├── Register.tsx      # Register via Supabase
│   │   ├── Skills.tsx        # Skill selection
│   │   ├── Difficulty.tsx    # Difficulty selection
│   │   └── Arena.tsx         # Main game UI
│   ├── lib/
│   │   ├── pyodide.ts        # Python runtime manager
│   │   ├── gemini.ts         # Gemini API client
│   │   ├── mcp-client.ts     # MCP stub
│   │   ├── useBackButton.ts  # Back button handler
│   │   └── supabase.ts       # Supabase client
│   ├── data/
│   │   └── chaos-knowledge.ts # Knowledge base for Saboteur
│   ├── App.tsx               # Router setup
│   └── main.tsx
├── server/
│   ├── src/
│   │   ├── index.ts          # Express app
│   │   ├── services/
│   │   │   ├── boilerplate-service.ts
│   │   │   └── sabotage-service.ts
│   │   └── data/
│   │       ├── boilerplate-code.ts  # Code templates
│   │       └── boilerplates.ts      # Test cases
│   └── package.json
├── package.json
├── pnpm-workspace.yaml
├── vite.config.ts
└── README.md
```

## UI/UX Design System

### Colors
- **Primary**: Neon Cyan (#00f3ff) — success, borders, accents
- **Danger**: Glitch Red (#ff003c) — sabotage alerts
- **Background**: Deep Black (#050505) — ultra-dark

### Fonts
- **Headings**: Orbitron (cyberpunk aesthetic)
- **Code**: JetBrains Mono (professional)

### Effects
- Scanlines overlay
- Animated grid background
- Floating particles
- Glitch text animations
- Pulsing orbs
- Confetti on level clear

## Routing

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | Landing | Intro animation |
| `/login` | Login | Sign in via Supabase |
| `/register` | Register | Create account |
| `/skills` | Skills | Select skill (Pandas, OOPS, CP, Cryptograph) |
| `/difficulty` | Difficulty | Select threat level (Syntax, Logic, Semantic) |
| `/arena` | Arena | Main game environment |

## Game Rules

1. **Sabotage Constraints**:
   - No comments revealing the bug.
   - No code outside existing function scopes.
   - Bugs must be stealthy and realistic.

2. **Boilerplate Requirements**:
   - Code must be deliberately incomplete (include TODOs).
   - Challenge must be non-trivial.
   - Tests must be relevant to the skill.

3. **Player Objectives**:
   - Identify the injected bug.
   - Fix the code without breaking existing logic.
   - Pass all (visible + hidden) test cases.

## Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make changes and test locally.
3. Commit with clear messages: `git commit -m "Add feature X"`
4. Push to remote: `git push origin feature/your-feature`
5. Create a Pull Request on GitHub.

## Future Roadmap

- [ ] Leaderboard & scoring system
- [ ] User profiles & progress tracking
- [ ] Community challenges
- [ ] Multiple programming languages (JavaScript, Java, C++)
- [ ] Real-time multiplayer mode
- [ ] Advanced visualizations (AST inspector, memory profiler)

## License

MIT License — See LICENSE file for details.

## Team

**Agentathon 2026 Team: Amitesh, Kaustubh, Abhinav (AnduPandu Society)**

---

**Ready to debug like a pro? Enter the Arena and fix what the Saboteur breaks.** 🥷⚔️
