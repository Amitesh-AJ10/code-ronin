import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Play, SquareTerminal } from 'lucide-react';
import { pyodideManager } from '../lib/pyodide';
import { motion } from 'framer-motion';

const Arena: React.FC = () => {
    const [code, setCode] = useState<string>("# Write your Python code here\nprint('Hello, CodeRonin!')\n");
    const [output, setOutput] = useState<string>("> Ready for execution...");
    const [isRunning, setIsRunning] = useState<boolean>(false);
    const [isPyodideReady, setIsPyodideReady] = useState<boolean>(false);

    useEffect(() => {
        pyodideManager.init().then(() => setIsPyodideReady(true));
    }, []);

    const handleRun = async () => {
        if (!isPyodideReady) return;
        setIsRunning(true);
        setOutput("> Running...");

        const { output: result, error } = await pyodideManager.runCode(code);

        if (error) {
            setOutput(`> Error:\n${error}`);
        } else {
            setOutput(`> Output:\n${result}`);
        }
        setIsRunning(false);
    };

    return (
        <div className="flex flex-col h-screen bg-neon-bg text-white font-mono overflow-hidden">
            {/* Header */}
            <header className="flex items-center justify-between px-6 py-4 border-b border-neon-cyan/20 bg-black/50 backdrop-blur">
                <h1 className="text-2xl font-orbitron text-neon-cyan tracking-widest uppercase glitch-text">
                    Code<span className="text-white">Ronin</span>
                </h1>
                <div className="flex items-center gap-4">
                    {/* Placeholder for Chaos Meter */}
                    <div className="w-32 h-2 bg-gray-800 rounded-full overflow-hidden">
                        <div className="w-0 h-full bg-neon-cyan transition-all duration-300"></div>
                    </div>
                    <span className="text-xs text-neon-cyan/80">CHAOS: 0%</span>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex gap-4 p-4 overflow-hidden">

                {/* Editor Pane */}
                <motion.div
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="flex-1 flex flex-col rounded-lg border border-neon-cyan/30 overflow-hidden bg-black/40 shadow-[0_0_15px_rgba(0,243,255,0.1)] relative"
                >
                    <div className="flex items-center justify-between p-2 bg-neon-cyan/10 border-b border-neon-cyan/20">
                        <span className="text-sm text-neon-cyan flex items-center gap-2">
                            <SquareTerminal size={14} /> main.py
                        </span>
                        <button
                            onClick={handleRun}
                            disabled={!isPyodideReady || isRunning}
                            className={`flex items-center gap-2 px-4 py-1 rounded text-sm font-bold transition-all
                    ${isPyodideReady
                                    ? 'bg-neon-cyan/20 text-neon-cyan hover:bg-neon-cyan hover:text-black shadow-[0_0_10px_rgba(0,243,255,0.3)]'
                                    : 'bg-gray-800 text-gray-500 cursor-not-allowed'}`}
                        >
                            <Play size={14} /> {isRunning ? 'RUNNING...' : 'RUN'}
                        </button>
                    </div>
                    <Editor
                        height="100%"
                        defaultLanguage="python"
                        value={code}
                        onChange={(value) => setCode(value || "")}
                        theme="vs-dark" // We will customize this later or use default dark
                        options={{
                            minimap: { enabled: false },
                            fontSize: 14,
                            fontFamily: 'JetBrains Mono',
                            cursorBlinking: 'smooth',
                            smoothScrolling: true,
                            padding: { top: 16 }
                        }}
                    />
                </motion.div>

                {/* Output Pane */}
                <motion.div
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="w-1/3 flex flex-col rounded-lg border border-neon-purple/30 overflow-hidden bg-black/40 shadow-[0_0_15px_rgba(188,19,254,0.1)]"
                >
                    <div className="p-2 bg-neon-purple/10 border-b border-neon-purple/20">
                        <span className="text-sm text-neon-purple">TERMINAL OUTPUT</span>
                    </div>
                    <div className="flex-1 p-4 font-mono text-sm whitespace-pre-wrap overflow-y-auto text-gray-300 selection:bg-neon-purple selection:text-white">
                        {output}
                    </div>
                </motion.div>

            </main>
        </div>
    );
};

export default Arena;
