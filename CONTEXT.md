# PROJECT: CodeRonin (Agentathon 2026)
# TEAM: Amitesh, Kaustubh, Abhinav (AnduPandu Society)
# TAGLINE: The only coding platform that fights back.

## 1. VISION & PROBLEM STATEMENT
- **The Issue:** Traditional platforms (LeetCode, Codecademy) only teach the "Happy Path."
- **The Reality:** 80% of dev time is spent on the "Sad Path" (debugging, edge cases, library quirks).
- **The Solution:** CodeRonin is a "Debug Dojo" where an AI "Saboteur" actively injects realistic bugs into the user's workspace to build resilience and deep library comprehension.

## 2. CORE ARCHITECTURE (Thick-Client + Backend Saboteur)
- **Execution Engine:** Pyodide (Python 3.12+ runtime) in the browser.
- **AI Saboteur:** Backend (Node/Express) runs Groq (Llama 3.1 8B) with chaos patterns + doc context; frontend calls `POST /api/sabotage`.
- **Documentation:** For Python libraries with official docs (e.g. Pandas), backend uses a docret-style fetcher (Serper API + scrape). For other skills (OOPS, CP, Cryptography), static "LSP-style" docs + LLM with current code and end goal.
- **Database:** Supabase (Auth and Persistence via Client SDK).
- **MCP:** Backend exposes MCP over SSE (`/sse`, `/message`) with chaos resources; frontend can read chaos patterns. Sabotage runs on backend with full doc context.

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

### Color Palette
- *Background:* Deep Black (#050505) — ultra-dark for maximum contrast.
- *Primary (Success):* Neon Cyan (#00f3ff) — all primary CTAs, borders, accents, and success states.
- *Danger (Alert):* Glitch Red (#ff003c) — sabotage alerts, errors, and high-threat indicators.
- *Threat Levels (Difficulty):*
  - *Syntax Goblin:* Emerald Green (#22c55e) — beginner, low threat.
  - *Logic Gremlin:* Amber Orange (#f59e0b) — intermediate, medium threat.
  - *Semantic Impostor:* Red (#ef4444) — advanced, high threat.
- *Skill Colors (Fixed per discipline):*
  - *Pandas:* Cyan (#00f3ff)
  - *OOPS:* Red (#ff003c)
  - *CP:* Gold (#ffd700)
  - *Cryptograph:* Purple (#9d4edd)
- *Neutral Grays:* text-gray-500 (muted), text-gray-400 (secondary), text-gray-300 (tertiary).

### Typography
- *Headings:* font-orbitron — bold, uppercase, tight tracking (tracking-widest). Responsive scales: h1 text-5xl/md:text-6xl, h2 text-2xl, h3 text-xl.
- *Body Text:* font-mono — professional code aesthetic, used for labels and form text.
- *Code Editor:* Monaco Editor with JetBrains Mono.
- *Terminal Output:* Monospace, text-xs to text-sm, emulates classic terminal style.

### Component Patterns

#### Card/Container Design
- *Corner Brackets:* Decorative w-6 h-6 or w-8 h-8 borders placed at -top/-left/-bottom/-right with 2px border-width. Colors match card accent (cyan, green, red, or skill color).
- *Glow Effects:* 
  - Outer glow: absolute inset-0 bg-[color] blur-xl opacity-0 animated on hover with opacity: [0, 0.2, 0].
  - Shadow glow: shadow-[0_0_30px_rgba(r,g,b,0.15)] for card emphasis.
- *Border:* 2px borders with base opacity 0.3, full opacity on hover. backdrop-blur-xl for frosted glass effect.
- *Background:* bg-black/60 or bg-black/80 for transparency over particle effects.

#### Accent Lines & Dividers
- *Top/Bottom Lines:* h-[2px] bg-gradient-to-r from-transparent via-[color] to-transparent animated with initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}.
- *Vertical Separator:* 1px or 2px line between panels, e.g., editor/terminal split with cursor-col-resize for drag affordance.

#### Animation Framework (Framer Motion)
- *Entrance:* initial={{ opacity: 0, y: 20 }} + staggered delays (delay: 0.3 + i * 0.1).
- *Hover Transforms:* scale: [1, 1.05], rotate: 5, x: [0, 5, 0] (subtle micro-interactions).
- *Glitch Effect:* Multiple overlaid text layers with clip-path polygons, animated via @keyframes glitch-1/glitch-2.
- *Loading Bars:* Animated gradient fill bg-gradient-to-r from-cyber-cyan via-blue-400 to-cyber-cyan with scanning line animate-pulse.
- *Particle Float:* animate {{ y: [0, -40, 0], opacity: [0, 0.8, 0], scale: [0, 2, 0] }} (duration 3-4s, infinite repeat).

#### Interactive States
- *Hover:* Border color shifts to full opacity, background brightens, glow activates, text color matches accent.
- *Focus:* focus:outline-none focus:border-cyber-cyan focus:shadow-[0_0_10px_rgba(0,243,255,0.2)].
- *Disabled:* opacity-50 cursor-not-allowed.
- *Selected/Active:* Overlay with checkmark or border highlight, bg-cyber-cyan/10 backdrop-blur-sm.

#### Background Effects (Consistent Across Pages)
- *Scanlines:* .scanlines — CSS class with repeating horizontal lines, ~0.3 opacity, overlays entire screen.
- *Grid Background:* bg-[linear-gradient(to_right,#00f3ff08_1px,...)] bg-[size:4rem_4rem] with radial mask for fade effect.
- *Floating Particles:* 12–20 dots (w-1 h-1 bg-cyber-cyan rounded-full), staggered animations, infinite loop.
- *Pulsing Orbs:* Large blurred gradient circles (w-96 h-96 bg-[color]/5 blur-3xl) positioned at corners, scale/opacity pulse (3–6s cycle).
- *Radial Gradient Overlay:* bg-[radial-gradient(circle_at_center,...)] from-[color]/10 via-transparent to-transparent.

#### Page-Specific Themes

*Landing.tsx:*
- Matrix rain effect (cascading characters, opacity fade).
- Orbiting icons around central Terminal icon.
- Enhanced loader bar with segment dividers and percentage display.
- Terminal-style output log with > prompts (escaped as {'>'}).
- Glitch text layers with dual-color offset animation.

*Skills.tsx:*
- 4 skill cards in 2×2 grid (1 column mobile).
- Icon wrapped in bordered box with blur glow, centered.
- Title, description, and hover indicator.
- No difficulty badges (removed for cleaner UI).
- Selection overlay with animated checkmark on choice.

*Difficulty.tsx:*
- 3 threat-level cards (full-width stack).
- Color-coded by threat: green/orange/red.
- Threat indicator bar (3 segments, filled based on level).
- Icon + label + description layout.
- Warning banner above footer ("Choose wisely...").

*Login.tsx & Register.tsx:*
- Symmetrical corner bracket decoration.
- Top/bottom accent lines with gradient.
- Form fields with left-side icons (Mail, Lock, etc.).
- Icon color changes on focus: gray → accent color.
- Success overlay for Register (green radial glow, checkmark).
- Password strength bar (Register only, visual fill 0–100%).

*Arena.tsx:*
- Resizable split layout: Monaco editor (left) + terminal/test cases (right).
- Horizontal drag handle with icon affordance (GripVertical).
- Vertical split in right panel: output / test cases tabs.
- Chaos meter + sabotage alert overlay.
- Terminal header with system buttons (red/yellow/green dots).
- Test case badges: passed (green), failed (red), pending (gray).

### Responsive Design
- *Mobile:* Single-column layouts, p-6 padding, touch-friendly button sizes (min 44px).
- *Tablet:* 2-column grids where applicable (Skills).
- *Desktop:* Full 2×2 or multi-column layouts, resizable panels (Arena).
- *Breakpoints:* Tailwind defaults (md: = 768px, lg: = 1024px).

### Accessibility & Polish
- *Contrast Ratio:* #00f3ff on #050505 ≈ 12:1 (WCAG AAA compliant).
- *Semantic HTML:* <motion.button>, <form>, <label htmlFor>.
- *ARIA:* role="alert" on error messages.
- *Confetti:* Celebratory effect on win (Arena), 200 pieces in cyan/purple/red.
- *Loading States:* Spinner text ("PROCESSING..."), disabled button opacity fade.

### Custom Tailwind Classes & Animations
- .scanlines — overlay with CRT effect.
- .clip-path-polygon — decorative corner cuts (if used).
- @keyframes gradient-flow — animated background position.
- @keyframes glitch-1/glitch-2 — offset text animation for glitch effect.
- animate-gradient-flow, animate-glitch-1, animate-glitch-2 — applied to elements.

### Implementation Notes for Teams
- *All pages inherit background effects:* Scanlines + grid + floating particles + pulsing orbs. Copy-paste the effect block for consistency.
- *Card decorations:* Use corner brackets for any new card components; match primary accent color.
- *Color consistency:* Always use Tailwind color variables (e.g., text-cyber-cyan, border-cyber-cyan) for theme cohesion.
- *Animation timing:* Framer Motion transition={{ duration: 0.3–0.5 }} for snappy feel; 3–6s for background loops.
- *Focus states critical:* All interactive elements must have visible focus (border + shadow).
- *Avoid light colors:* Stick to dark grays and the neon palette; no white unless it's for high emphasis.

## 6. PAGE FLOW & ROUTING
1. *Landing* (Landing.tsx) — Short intro animation, then cut to Login.
2. *Auth* — *Login* (Login.tsx). If new user → *Register* (Register.tsx) → after signup return to Login. *Supabase* handles auth and session/caching.
3. *Skills* (Skills.tsx) — Four skill buttons: *Pandas, **OOPS, **CP, **Cryptograph*. Selection is persisted (backend/Supabase) and drives which chaos knowledge/agent behavior is used.
4. *Difficulty* (Difficulty.tsx) — Three difficulty buttons matching game mechanics:
   - *Syntax Goblin:* Beginner bugs (missing colons, typos).
   - *Logic Gremlin:* Intermediate bugs (off-by-one errors, state mutation issues).
   - *Semantic Impostor:* Advanced bugs (subtle library misuses from docs).  
   Selection is persisted (backend/Supabase).
5. *Arena* (Arena.tsx) — Main dojo (Monaco + Pyodide). *TODO:* Add test cases to the terminal bar; make terminal bar smaller; add bottom margins so it doesn’t touch the screen edge.

## 6. FILE STRUCTURE & GUIDELINES
- `src/components/Arena.tsx`: The heart of the app (Monaco + Pyodide Output). Calls backend `POST /api/sabotage` with code, difficulty, skill (from Skills → Difficulty → Arena via location state).
- `src/lib/pyodide.ts`: Singleton to manage Python runtime.
- `src/lib/gemini.ts`: Legacy client-side saboteur (fallback); primary saboteur runs on backend.
- `src/data/chaos-knowledge.ts`: Local chaos patterns fallback.
- **Backend:** `server/src/index.ts` — MCP SSE + `POST /api/sabotage`. `server/src/services/sabotage-service.ts` — builds prompt with chaos + doc context, calls Gemini. `server/src/services/docs-service.ts` — skill → doc text (docret-style for libraries, static for OOPS/CP/Cryptography). `server/src/services/docret-fetcher.ts` — Serper API + scrape for official library docs.
- **Env:** `.env.local` (frontend): `VITE_SUPABASE_*`. Server: `GROQ_API_KEY` or `VITE_GROQ_API_KEY` (required for sabotage), `SERPER_API_KEY` (optional; live doc fetch). (DO NOT COMMIT secrets.)