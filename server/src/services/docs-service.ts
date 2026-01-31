/**
 * Docs service: returns skill-specific doc text for the saboteur.
 * - Library skills (e.g. Pandas): use getDocsFromDocret (Serper + official docs).
 * - Other skills (OOPS, CP, Cryptography): use static docData (LLM + code + end goal).
 */
import { docData } from "../docs.js";
import { getDocsFromSerper, DOCS_SITES } from "./docret-fetcher.js";

const SKILL_TO_KEY: Record<string, string> = {
    Pandas: "pandas",
    pandas: "pandas",
    OOPS: "oops",
    oops: "oops",
    CP: "cp",
    cp: "cp",
    Cryptography: "cryptography",
    cryptography: "cryptography",
};

/** Skills that have official doc sites we fetch via Serper (docret-style). */
const LIBRARY_SKILLS: Record<string, string> = {
    Pandas: "pandas",
    pandas: "pandas",
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
 * Fetch docs from official library documentation (docret-style: Serper + scrape).
 * Use for library skills; returns null if library not in DOCS_SITES or API missing.
 */
export async function getDocsFromDocret(
    query: string,
    library: string
): Promise<string | null> {
    if (!DOCS_SITES[library]) return null;
    return getDocsFromSerper(query, library);
}

/**
 * Get doc context for the saboteur: for library skills try docret, else use static docs.
 * query: e.g. "DataFrame merge" for Pandas; fallbackQuery used when docret returns nothing.
 */
export async function getDocContextForSkill(
    skill: string,
    query: string,
    fallbackQuery?: string
): Promise<string | null> {
    const key = SKILL_TO_KEY[skill] ?? skill.toLowerCase();
    const library = LIBRARY_SKILLS[skill] ?? LIBRARY_SKILLS[key];
    if (library) {
        const fromDocret = await getDocsFromDocret(query, library);
        if (fromDocret) return fromDocret;
        if (fallbackQuery && fallbackQuery !== query) {
            const retry = await getDocsFromDocret(fallbackQuery, library);
            if (retry) return retry;
        }
    }
    return getDocsForSkill(skill);
}
