"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDocKeys = getDocKeys;
exports.getDocsForSkill = getDocsForSkill;
exports.getAllDocs = getAllDocs;
exports.getDocsFromDocret = getDocsFromDocret;
/**
 * Docs service: returns skill-specific doc text for the saboteur.
 * Extend with getDocsFromDocret() when wiring docret-mcp-server (spawn Python, MCP get_docs over stdio).
 */
const docs_js_1 = require("../docs.js");
const SKILL_TO_KEY = {
    Pandas: "pandas",
    pandas: "pandas",
    OOPS: "oops",
    oops: "oops",
    CP: "cp",
    cp: "cp",
    Cryptograph: "cryptography",
    cryptography: "cryptography",
};
function getDocKeys() {
    return Object.keys(docs_js_1.docData);
}
function getDocsForSkill(skill) {
    const key = SKILL_TO_KEY[skill] ?? skill.toLowerCase();
    return docs_js_1.docData[key] ?? null;
}
function getAllDocs() {
    return { ...docs_js_1.docData };
}
/**
 * Future: call docret-mcp-server get_docs(query, library) over stdio.
 * For now returns null; backend can spawn Python and relay MCP tool calls here.
 */
async function getDocsFromDocret(_query, _library) {
    return null;
}
