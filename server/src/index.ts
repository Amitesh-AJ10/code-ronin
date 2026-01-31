import path from "path";
import dotenv from "dotenv";

// Load project root .env.local so existing VITE_GEMINI_API_KEY works for backend
const cwd = process.cwd();
dotenv.config({ path: path.join(cwd, ".env.local") });
dotenv.config({ path: path.join(cwd, "..", ".env.local") });

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import {
    ListResourcesRequestSchema,
    ReadResourceRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import express from "express";
import cors from "cors";
import { chaosResources } from "./resources.js";
import { runSabotage } from "./services/sabotage-service.js";

const app = express();
app.use(cors());
app.use(express.json());

// Initialize MCP Server (Low-Level)
const server = new Server(
    {
        name: "code-ronin-server",
        version: "1.0.0",
    },
    {
        capabilities: {
            resources: {},
        },
    }
);

// Resource Handlers
server.setRequestHandler(ListResourcesRequestSchema, async () => {
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

server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
    const uri = request.params.uri;
    if (uri === "chaos://patterns") {
        return {
            contents: [
                {
                    uri: uri,
                    mimeType: "application/json",
                    text: JSON.stringify(chaosResources),
                },
            ],
        };
    }
    throw new Error("Resource not found");
});

let transport: SSEServerTransport;

app.get("/sse", async (req, res) => {
    console.log("Client connected via SSE");
    transport = new SSEServerTransport("/message", res);
    await server.connect(transport);
});

app.post("/message", async (req, res) => {
    // console.log("Received message");
    if (transport) {
        await transport.handlePostMessage(req, res);
    } else {
        res.status(404).json({ error: "Session not initialized" });
    }
});

// Sabotage API: backend runs saboteur with chaos + doc context + Gemini
app.post("/api/sabotage", async (req, res) => {
    try {
        const { code, difficulty, skill, endGoal } = req.body ?? {};
        if (typeof code !== "string" || typeof difficulty !== "number") {
            res.status(400).json({ error: "Missing or invalid code / difficulty" });
            return;
        }
        const result = await runSabotage({
            code,
            difficulty,
            skill: typeof skill === "string" ? skill : undefined,
            endGoal: typeof endGoal === "string" ? endGoal : undefined,
        });
        if (!result) {
            res.status(503).json({ error: "Sabotage unavailable (check GROQ_API_KEY)" });
            return;
        }
        res.json(result);
    } catch (e) {
        console.error("POST /api/sabotage error:", e);
        res.status(500).json({ error: "Sabotage failed" });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`MCP Server running on http://localhost:${PORT}/sse`);
});
