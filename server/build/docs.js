"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.docData = void 0;
const python_docs_js_1 = require("./data/python-docs.js");
/** Library docs (pandas, etc.) + static Python docs for OOPS, CP, Cryptograph (LSP-style). */
exports.docData = {
    pandas: "Pandas is a fast, powerful, flexible and easy to use open source data analysis and manipulation tool.\n\nKey Concepts:\n- DataFrame: 2-dimensional labeled data structure.\n- Series: 1-dimensional labeled array.\n\nCommon Errors:\n- SettingWithCopyWarning: Modifying a slice of a DataFrame.\n- MergeError: Joining DataFrames with incompatible keys.",
    oops: python_docs_js_1.pythonDocsBySkill.oops,
    cp: python_docs_js_1.pythonDocsBySkill.cp,
    cryptography: python_docs_js_1.pythonDocsBySkill.cryptography,
};
