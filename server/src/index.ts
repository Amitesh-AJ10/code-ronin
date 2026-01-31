import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import {
    ListResourcesRequestSchema,
    ReadResourceRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import express from "express";
import cors from "cors";
import { chaosResources } from "./resources.js";

const app = express();
app.use(cors());

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

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`MCP Server running on http://localhost:${PORT}/sse`);
});
