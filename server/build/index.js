"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = require("@modelcontextprotocol/sdk/server/index.js");
const sse_js_1 = require("@modelcontextprotocol/sdk/server/sse.js");
const types_js_1 = require("@modelcontextprotocol/sdk/types.js");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const resources_js_1 = require("./resources.js");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
// Initialize MCP Server (Low-Level)
const server = new index_js_1.Server({
    name: "code-ronin-server",
    version: "1.0.0",
}, {
    capabilities: {
        resources: {},
    },
});
// Resource Handlers
server.setRequestHandler(types_js_1.ListResourcesRequestSchema, async () => {
    const resources = [
        {
            uri: "chaos://patterns",
            name: "Chaos Patterns",
            mimeType: "application/json",
            description: "A list of chaos patterns used for sabotage",
        },
    ];
    return {
        resources: resources,
    };
});
server.setRequestHandler(types_js_1.ReadResourceRequestSchema, async (request) => {
    const uri = request.params.uri;
    if (uri === "chaos://patterns") {
        return {
            contents: [
                {
                    uri: uri,
                    mimeType: "application/json",
                    text: JSON.stringify(resources_js_1.chaosResources),
                },
            ],
        };
    }
    throw new Error("Resource not found");
});
let transport;
app.get("/sse", async (req, res) => {
    console.log("Client connected via SSE");
    transport = new sse_js_1.SSEServerTransport("/message", res);
    await server.connect(transport);
});
app.post("/message", async (req, res) => {
    // console.log("Received message");
    if (transport) {
        await transport.handlePostMessage(req, res);
    }
    else {
        res.status(404).json({ error: "Session not initialized" });
    }
});
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`MCP Server running on http://localhost:${PORT}/sse`);
});
