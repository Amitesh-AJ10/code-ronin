# PROJECT: CodeRonin - Final Context

## Overview
CodeRonin is a "Debug Dojo" where an AI "Saboteur" actively injects realistic bugs into the user's workspace to build resilience and deep library comprehension. The user must fix these bugs and pass strict test cases.

## Core Mechanics
1. **The Chaos Meter**: Fills as the user writes code.
2. **The Sabotage**: At 100%, the AI Agent analyzes the code and injects a bug.
   - **Constraint**: The Saboteur must NOT add comments revealing the bug. It must be stealthy.
   - **Constraint**: The Saboteur must NOT add code outside existing function scopes to prevent `NameError`.
3. **Win State**: User fixes the bug, passes all Pyodide test cases.

## Technical Architecture

### Frontend (React + Vite)
- **Pyodide Runtime**:
  - Version: `0.24.1` (Downgraded from 0.26.x for stability/reference match).
  - Initialization: Automatically loads when the Arena mounts.
  - **Program Input**: Automatically filled with the *first test case input* to prevent "No output" errors on initial run.
- **Arena Component**:
  - **Test Cases**: Dynamically fetched from the backend (not hardcoded).
  - **Debugging**: Displays "Actual Output" alongside "Expected" when tests fail.
  - **Output Handling**: Explicitly shows `(No output generated)` if stdout is empty.

### Backend (Node/Express + MCP)
- **Boilerplate API**:
  - Returns initial code + `testCases` + `docQuery` context.
  - **Boilerplate Code**: Deliberately *incomplete* (uses TODOs). The user must implement the logic to pass the tests.
  - **Pandas Output**: configured to strip headers (`header=False`) to match clean test case expectations.
- **Sabotage Service**:
  - Uses Groq (Llama 3) to inject bugs.
  - Prompts are strictly engineered to produce valid, stealthy bugs without comments or global scope pollution.

## Troubleshooting Logic
- **"No Output" Error**: usually caused by empty stdin or syntax errors crashing Pyodide before print. Fixed by auto-filling stdin.
- **Column Header Mismatch**: Pandas `to_string` defaults to showing headers. Fixed by enforcing `header=False` in templates and user solutions.
- **Saboteur Crashes**: Caused by inserting global code referring to local vars. Fixed by prompt constraints.

## Current State
- **Files**: `server/src/data/boilerplate-code.ts` contains the incomplete templates.
- **Tests**: `server/src/data/boilerplates.ts` contains the matching test cases.
- **Execution**: `src/lib/pyodide.ts` manages the WASM runtime.

## User Rules
- **Sabotage**: No comments from the bot.
- **Boilerplate**: Must be a challenge (TODOs), not a solution.
- **Tests**: Must be relevant to the specific function/skill.
