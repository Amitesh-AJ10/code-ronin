import React, { useState, useEffect } from 'react';
import Editor, { type OnChange } from '@monaco-editor/react';
import { Play, SquareTerminal, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { pyodideManager } from '../lib/pyodide';
import { motion, AnimatePresence } from 'framer-motion';
import { saboteurAgent, type SabotageResult } from '../lib/gemini';
import Confetti from 'react-confetti';

const Arena: React.FC = () => {
    const [code, setCode] = useState<string>("# Write your Python code here\nprint('Hello, CodeRonin!')\n");
    const [output, setOutput] = useState<string>("> Ready for execution...");
    const [isRunning, setIsRunning] = useState<boolean>(false);
    const [isPyodideReady, setIsPyodideReady] = useState<boolean>(false);
    const [initError, setInitError] = useState<string | null>(null);

    // Game State
    const [chaos, setChaos] = useState<number>(0);
    const [sabotageEvent, setSabotageEvent] = useState<SabotageResult | null>(null);
    const [level, setLevel] = useState<number>(1);
    const [isThinking, setIsThinking] = useState<boolean>(false);
    const [won, setWon] = useState<boolean>(false);

    useEffect(() => {
        pyodideManager.init()
            .then(() => setIsPyodideReady(true))
            .catch(err => setInitError(err.message || "Failed to load Pyodide"));
    }, []);

    // Chaos Logic
    const handleEditorChange: OnChange = (value) => {
        setCode(value || "");

        // Increase chaos on every keystroke (simplified mechanics)
        if (!won && !sabotageEvent && !isThinking) {
            setChaos(prev => {
                const newChaos = prev + 2; // Increases quickly for demo
                if (newChaos >= 100) {
                    triggerSabotage(value || "");
                    return 100;
                }
                return newChaos;
            });
        }
    };

    const triggerSabotage = async (currentCode: string) => {
        setIsThinking(true);
        const result = await saboteurAgent.sabotage(currentCode, level * 20); // Scale difficulty
        setIsThinking(false);

        if (result) {
            setCode(result.sabotagedCode);
            setSabotageEvent(result);
            setOutput(`> SYSTEM ALERT: SABOTAGE DETECTED!\n> HINT: ${result.explanation}`);
        } else {
            // If API fails or is missing, just reset chaos
            setChaos(0);
        }
    };

    const fixSabotage = () => {
        setSabotageEvent(null);
        setChaos(0);
        setOutput("> Sabotage Resolved. System Normal.");
    };

    const handleRun = async () => {
        if (!isPyodideReady) return;
        setIsRunning(true);
        setOutput("> Running...");

        const { output: result, error } = await pyodideManager.runCode(code);

        if (error) {
            setOutput(`> Error:\n${error}`);
            // If they are sabotaged, they need to fix it. 
            // Running code doesn't clear sabotage unless it passes (we don't have tests yet),
            // but for now let's say if they run successfully without error after sabotage, they clear it?
            // Actually, let's keep it simple: They just need to run code that works to "Win" the level momentarily or just fix the bug.
        } else {
            setOutput(`> Output:\n${result}`);

            if (sabotageEvent) {
                // Heuristic: If previous run had error, and this one doesn't, we assume fixed.
                // Or we can just manually clear it.
                fixSabotage();
                setWon(true);
                setLevel(prev => prev + 1);
                setTimeout(() => setWon(false), 5000);
            }
        }
        setIsRunning(false);
    };

    return (
        <div className="flex flex-col h-screen bg-neon-bg text-white font-mono overflow-hidden relative">
            {won && <Confetti numberOfPieces={200} recycle={false} colors={['#00f3ff', '#bc13fe', '#ff003c']} />}

            {/* Header */}
            <header className="flex items-center justify-between px-6 py-4 border-b border-neon-cyan/20 bg-black/50 backdrop-blur z-10">
                <h1 className="text-2xl font-orbitron text-neon-cyan tracking-widest uppercase glitch-text">
                    Code<span className="text-white">Ronin</span>
                    <span className="text-xs ml-2 text-gray-500">Lv.{level}</span>
                </h1>
                <div className="flex items-center gap-4 w-1/3 justify-end">
                    <div className="flex flex-col items-end">
                        <span className="text-xs text-neon-cyan/80">CHAOS</span>
                        <span className={`text-[10px] ${isPyodideReady ? 'text-green-400' : 'text-red-400'}`} title={initError || ""}>
                            {initError ? `ERROR: ${initError.substring(0, 15)}...` : isPyodideReady ? 'RUNTIME READY' : 'LOADING RUNTIME...'}
                        </span>
                    </div>
                    <div className="flex-1 h-3 bg-gray-900 rounded-full overflow-hidden border border-gray-700 relative">
                        <motion.div
                            className={`h-full ${sabotageEvent ? 'bg-neon-red' : 'bg-neon-cyan'}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${chaos}%` }}
                            transition={{ type: 'spring', damping: 20 }}
                        />
                        {/* Scanline effect */}
                        <div className="absolute inset-0 bg-white/10 w-full h-full animate-pulse" style={{ display: chaos >= 90 ? 'block' : 'none' }}></div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex gap-4 p-4 overflow-hidden relative">

                {/* Sabotage Overlay */}
                <AnimatePresence>
                    {sabotageEvent && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="absolute top-6 left-1/2 -translate-x-1/2 z-50 bg-black/90 border border-neon-red text-neon-red px-6 py-4 rounded-lg shadow-[0_0_30px_rgba(255,0,60,0.5)] max-w-lg text-center backdrop-blur-md"
                        >
                            <div className="flex items-center justify-center gap-2 mb-2">
                                <AlertTriangle size={24} />
                                <h2 className="text-xl font-orbitron tracking-widest">SABOTAGE INITIATED</h2>
                            </div>
                            <p className="text-white mb-2">{sabotageEvent.explanation}</p>
                            <p className="text-xs text-gray-500 uppercase tracking-widest">Type: {sabotageEvent.type}</p>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Thinking Overlay */}
                <AnimatePresence>
                    {isThinking && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center"
                        >
                            <div className="text-neon-cyan font-orbitron text-2xl animate-pulse">
                                SYSTEM BREACH DETECTED...
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Editor Pane */}
                <motion.div
                    layout
                    className={`flex-1 flex flex-col rounded-lg overflow-hidden relative transition-colors duration-500
                        ${sabotageEvent
                            ? 'border border-neon-red/50 shadow-[0_0_20px_rgba(255,0,60,0.2)]'
                            : 'border border-neon-cyan/30 shadow-[0_0_15px_rgba(0,243,255,0.1)] bg-black/40'}`}
                >
                    <div className={`flex items-center justify-between p-2 border-b transition-colors duration-500
                         ${sabotageEvent ? 'bg-neon-red/10 border-neon-red/30' : 'bg-neon-cyan/10 border-neon-cyan/20'}`}>
                        <span className={`text-sm flex items-center gap-2 ${sabotageEvent ? 'text-neon-red' : 'text-neon-cyan'}`}>
                            <SquareTerminal size={14} /> main.py
                        </span>
                        <div className="flex gap-2">
                            {sabotageEvent && (
                                <button
                                    onClick={() => setCode(code)} // Dummy reset or something
                                    className="px-3 py-1 rounded text-xs bg-red-900/50 text-red-200 border border-red-500/50 hover:bg-red-800"
                                >
                                    RESET
                                </button>
                            )}
                            <button
                                onClick={initError ? () => window.location.reload() : handleRun}
                                disabled={(!isPyodideReady && !initError) || isRunning || isThinking}
                                className={`flex items-center gap-2 px-4 py-1 rounded text-sm font-bold transition-all
                                    ${isPyodideReady
                                        ? 'bg-neon-cyan/20 text-neon-cyan hover:bg-neon-cyan hover:text-black shadow-[0_0_10px_rgba(0,243,255,0.3)]'
                                        : initError ? 'bg-red-900/50 text-red-200 hover:bg-red-800 cursor-pointer' : 'bg-gray-800 text-gray-500 cursor-not-allowed'}`}
                            >
                                <Play size={14} />
                                {initError ? 'RETRY RELOAD' : !isPyodideReady ? 'LOADING...' : isRunning ? 'RUNNING...' : 'RUN'}
                            </button>
                        </div>
                    </div>
                    <Editor
                        height="100%"
                        defaultLanguage="python"
                        value={code}
                        onChange={handleEditorChange}
                        theme="vs-dark"
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
                    layout
                    className="w-1/3 flex flex-col rounded-lg border border-neon-purple/30 overflow-hidden bg-black/40 shadow-[0_0_15px_rgba(188,19,254,0.1)]"
                >
                    <div className="p-2 bg-neon-purple/10 border-b border-neon-purple/20 flex justify-between items-center">
                        <span className="text-sm text-neon-purple">TERMINAL OUTPUT</span>
                        {won && <CheckCircle2 size={16} className="text-green-400" />}
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
