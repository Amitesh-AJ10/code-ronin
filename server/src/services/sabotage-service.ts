/**
 * Sabotage service: builds saboteur prompt with chaos patterns + doc context + end goal,
 * calls Groq (Llama), returns sabotaged code + explanation.
 */
import path from "path";
import dotenv from "dotenv";

// Load .env.local before reading env (ESM loads this module before index.ts top-level runs)
const cwd = process.cwd();
dotenv.config({ path: path.join(cwd, ".env.local") });
dotenv.config({ path: path.join(cwd, "..", ".env.local") });

import Groq from "groq-sdk";
import { chaosResources } from "../resources.js";
import { getDocContextForSkill } from "./docs-service.js";

const GROQ_API_KEY = process.env.GROQ_API_KEY ?? process.env.VITE_GROQ_API_KEY ?? "";
const groq = GROQ_API_KEY ? new Groq({ apiKey: GROQ_API_KEY }) : null;
const SABOTAGE_MODEL = "llama-3.1-8b-instant";

export type SabotageType = "syntax" | "logic" | "semantic";

export interface SabotageResult {
    sabotagedCode: string;
    explanation: string;
    type: SabotageType;
}

export interface SabotageInput {
    code: string;
    difficulty: number;
    skill?: string;
    endGoal?: string;
    /** Optional: use this doc query for context (from boilerplate challenge) instead of deriving from code. */
    docQuery?: string;
    challengeId?: string;
}

/**
 * Derive a short doc-search query from code (for library docs).
 */
function queryFromCode(code: string, skill?: string): string {
    const lower = code.toLowerCase();
    if (skill?.toLowerCase() === "pandas" || lower.includes("pandas") || lower.includes("dataframe")) {
        return "DataFrame common errors";
    }
    if (lower.includes("merge") || lower.includes("join")) return "merge join";
    if (lower.includes("groupby")) return "groupby";
    return "common errors";
}

/**
 * Run saboteur: get chaos + doc context, build prompt, call Groq.
 */
export async function runSabotage(input: SabotageInput): Promise<SabotageResult | null> {
    if (!groq || !GROQ_API_KEY) {
        console.warn("GROQ_API_KEY not set; sabotage skipped.");
        return null;
    }

    const { code, difficulty, skill, endGoal, docQuery: explicitDocQuery } = input;

    // Sabotage type from difficulty (0–33: syntax, 33–66: logic, 66+: semantic)
    let type: SabotageType = "syntax";
    if (difficulty > 66) type = "semantic";
    else if (difficulty > 33) type = "logic";

    const patterns = chaosResources[type];
    const pattern = patterns[Math.floor(Math.random() * patterns.length)];

    // Doc context: use explicit docQuery from boilerplate when provided, else derive from code; then store-first fetch
    let docContext: string | null = null;
    if (skill) {
        const query = explicitDocQuery ?? queryFromCode(code, skill);
        docContext = await getDocContextForSkill(skill, query, "common errors");
    }

    const docSection = docContext
        ? `\nSkill / documentation context (use to make the bug realistic and aligned with this skill):\n${docContext.slice(0, 4000)}\n`
        : "";

    const endGoalSection = endGoal
        ? `\nUser's end goal (intended behavior): ${endGoal}\n`
        : "";

    const prompt = `You are the "Code Saboteur". Your goal is to inject a realistic bug into the user's Python code.
${endGoalSection}
User Code:
\`\`\`python
${code}
\`\`\`
${docSection}
Sabotage Type: ${type.toUpperCase()}
Specific Tactic: ${pattern.name} (${pattern.description})

Instructions:
1. Modify the code to introduce a subtle bug matching the tactic.
2. Keep the code mostly identical, just change the specific part.
3. Return ONLY a JSON object with this structure (no markdown, no extra text). In sabotagedCode, use escaped newlines (\\n) not actual line breaks:
{"sabotagedCode": "line1\\nline2\\nline3", "explanation": "A short cryptic hint, in a gamified way, like a treasure hunt clue, but keep it short.", "type": "${type}"}`;

    try {
        const completion = await groq.chat.completions.create({
            model: SABOTAGE_MODEL,
            messages: [{ role: "user", content: prompt }],
            temperature: 0.4,
            max_tokens: 2048,
        });
        const text = completion.choices[0]?.message?.content?.trim() ?? "";
        const jsonStr = text.replace(/```json/g, "").replace(/```/g, "").trim();
        const sanitized = escapeControlCharsInJsonStrings(jsonStr);
        return JSON.parse(sanitized) as SabotageResult;
    } catch (error) {
        console.error("Sabotage failed:", error);
        return null;
    }
}

/**
 * Escape raw newlines/tabs inside JSON string values so JSON.parse() succeeds.
 * LLMs often return literal newlines in multi-line string fields (e.g. sabotagedCode).
 */
function escapeControlCharsInJsonStrings(raw: string): string {
    let out = "";
    let inString = false;
    let escaped = false;
    for (let i = 0; i < raw.length; i++) {
        const c = raw[i];
        if (escaped) {
            out += c;
            escaped = false;
            continue;
        }
        if (c === "\\" && inString) {
            out += c;
            escaped = true;
            continue;
        }
        if (c === '"') {
            inString = !inString;
            out += c;
            continue;
        }
        if (inString) {
            if (c === "\n") {
                out += "\\n";
            } else if (c === "\r") {
                out += "\\r";
            } else if (c === "\t") {
                out += "\\t";
            } else {
                out += c;
            }
        } else {
            out += c;
        }
    }
    return out;
}
