/**
 * Docs service: returns skill-specific doc text for the saboteur.
 * Extend with getDocsFromDocret() when wiring docret-mcp-server (spawn Python, MCP get_docs over stdio).
 */
import { docData } from "../docs.js";

const SKILL_TO_KEY: Record<string, string> = {
    Pandas: "pandas",
    pandas: "pandas",
    OOPS: "oops",
    oops: "oops",
    CP: "cp",
    cp: "cp",
    Cryptograph: "cryptography",
    cryptography: "cryptography",
};

export function getDocKeys(): string[] {
    return Object.keys(docData);
}

export function getDocsForSkill(skill: string): string | null {
    const key = SKILL_TO_KEY[skill] ?? skill.toLowerCase();
    return docData[key] ?? null;
}

export function getAllDocs(): Record<string, string> {
    return { ...docData };
}

/**
 * Future: call docret-mcp-server get_docs(query, library) over stdio.
 * For now returns null; backend can spawn Python and relay MCP tool calls here.
 */
export async function getDocsFromDocret(
    _query: string,
    _library: string
): Promise<string | null> {
    return null;
}
