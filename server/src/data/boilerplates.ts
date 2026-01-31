/**
 * Boilerplate templates per (skill, difficulty). Each challenge has code + optional docQuery
 * for sabotage to use when fetching doc context from the local store.
 */

import * as C from "./boilerplate-code.js";

export type DifficultyId = "syntax" | "logic" | "semantic";

export interface BoilerplateTemplate {
    id: string;
    code: string;
    docQuery?: string;
}

/** skill -> difficultyId -> list of templates (one chosen at random) */
export const boilerplatesBySkillAndDifficulty: Record<
    string,
    Partial<Record<DifficultyId, BoilerplateTemplate[]>>
> = {
    Pandas: {
        syntax: [
            { id: "pandas-csv-syntax", code: C.PANDAS_CSV_SYNTAX, docQuery: "DataFrame common errors" },
            { id: "pandas-read-csv-syntax", code: C.PANDAS_READ_CSV_SYNTAX, docQuery: "DataFrame common errors" },
        ],
        logic: [
            { id: "pandas-groupby-logic", code: C.PANDAS_GROUPBY_LOGIC, docQuery: "groupby" },
            { id: "pandas-filter-logic", code: C.PANDAS_FILTER_LOGIC, docQuery: "DataFrame indexing" },
        ],
        semantic: [
            { id: "pandas-merge-semantic", code: C.PANDAS_MERGE_SEMANTIC, docQuery: "merge join" },
        ],
    },
    OOPS: {
        syntax: [{ id: "oops-class-syntax", code: C.OOPS_CLASS_SYNTAX }],
        logic: [{ id: "oops-inheritance-logic", code: C.OOPS_INHERITANCE_LOGIC }],
        semantic: [{ id: "oops-mutable-default-semantic", code: C.OOPS_MUTABLE_DEFAULT_SEMANTIC }],
    },
    CP: {
        syntax: [{ id: "cp-range-syntax", code: C.CP_RANGE_SYNTAX }],
        logic: [{ id: "cp-slice-logic", code: C.CP_SLICE_LOGIC }],
        semantic: [{ id: "cp-division-semantic", code: C.CP_DIVISION_SEMANTIC }],
    },
    Cryptography: {
        syntax: [{ id: "crypto-hash-syntax", code: C.CRYPTO_HASH_SYNTAX }],
        logic: [{ id: "crypto-compare-logic", code: C.CRYPTO_COMPARE_LOGIC }],
        semantic: [{ id: "crypto-constant-time-semantic", code: C.CRYPTO_CONSTANT_TIME_SEMANTIC }],
    },
};
