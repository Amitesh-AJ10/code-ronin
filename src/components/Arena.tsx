import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Editor, { type OnChange } from '@monaco-editor/react';
import { Play, SquareTerminal, AlertTriangle, CheckCircle2, FlaskConical, Eye, EyeOff, GripVertical, Maximize2, Minimize2, RotateCcw } from 'lucide-react';
import { pyodideManager } from '../lib/pyodide';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';

export interface SabotageResult {
    sabotagedCode: string;
    explanation: string;
    type: 'syntax' | 'logic' | 'semantic';
}

const Arena: React.FC = () => {
    const location = useLocation();
    const arenaState = (location.state as { skill?: string; difficultyId?: string } | null) ?? {};
    const { skill, difficultyId } = arenaState;
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

    // UI State
    const [showHiddenTests, setShowHiddenTests] = useState<boolean>(false);
    const [activeTab, setActiveTab] = useState<'output' | 'testcases'>('output');
    
    // Resizable panels state
    const [editorWidth, setEditorWidth] = useState<number>(60); // percentage
    const [terminalHeight, setTerminalHeight] = useState<number>(50); // percentage of right panel
    const [isResizing, setIsResizing] = useState<boolean>(false);
    const [resizeType, setResizeType] = useState<'horizontal' | 'vertical' | null>(null);
    
    const containerRef = useRef<HTMLDivElement>(null);

    // Mock test cases
    const testCases = [
        { id: 1, input: 'print("Hello")', expected: 'Hello', passed: true, hidden: false },
        { id: 2, input: 'print(2 + 2)', expected: '4', passed: true, hidden: false },
        { id: 3, input: 'print("Test")', expected: 'Test', passed: null, hidden: true },
        { id: 4, input: 'print(10 * 5)', expected: '50', passed: null, hidden: true },
    ];

    useEffect(() => {
        pyodideManager.init()
            .then(() => setIsPyodideReady(true))
            .catch(err => setInitError(err.message || "Failed to load Pyodide"));
    }, []);

    // Resizing logic
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isResizing || !containerRef.current) return;

            if (resizeType === 'horizontal') {
                const containerRect = containerRef.current.getBoundingClientRect();
                const newWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;
                setEditorWidth(Math.max(30, Math.min(70, newWidth)));
            } else if (resizeType === 'vertical') {
                const containerRect = containerRef.current.getBoundingClientRect();
                const rightPanelTop = containerRect.top;
                const rightPanelHeight = containerRect.height;
                const newHeight = ((e.clientY - rightPanelTop) / rightPanelHeight) * 100;
                setTerminalHeight(Math.max(20, Math.min(80, newHeight)));
            }
        };

        const handleMouseUp = () => {
            setIsResizing(false);
            setResizeType(null);
        };

        if (isResizing) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isResizing, resizeType]);

    // Chaos Logic
    const handleEditorChange: OnChange = (value) => {
        setCode(value || "");

        if (!won && !sabotageEvent && !isThinking) {
            setChaos(prev => {
                const newChaos = prev + 2;
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
        let result: SabotageResult | null = null;
        try {
            const res = await fetch('/api/sabotage', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    code: currentCode,
                    difficulty: level * 20,
                    skill: skill ?? undefined,
                    endGoal: undefined,
                }),
            });
            if (res.ok) result = (await res.json()) as SabotageResult;
        } catch (e) {
            console.error('Sabotage API error:', e);
        }
        setIsThinking(false);

        if (result) {
            setCode(result.sabotagedCode);
            setSabotageEvent(result);
            setOutput(`> SYSTEM ALERT: SABOTAGE DETECTED!\n> HINT: ${result.explanation}`);
        } else {
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
        } else {
            setOutput(`> Output:\n${result}`);

            if (sabotageEvent) {
                fixSabotage();
                setWon(true);
                setLevel(prev => prev + 1);
                setTimeout(() => setWon(false), 5000);
            }
        }
        setIsRunning(false);
    };

    const handleReset = () => {
        setCode("# Write your Python code here\nprint('Hello, CodeRonin!')\n");
        setChaos(0);
        setSabotageEvent(null);
        setOutput("> Ready for execution...");
    };

    return (
        <div className="flex flex-col h-screen bg-[#050505] text-white font-mono overflow-hidden relative">
            {won && <Confetti numberOfPieces={200} recycle={false} colors={['#00f3ff', '#bc13fe', '#ff003c']} />}

            {/* Background Effects */}
            <div className="scanlines" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#00f3ff08_1px,transparent_1px),linear-gradient(to_bottom,#00f3ff08_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-30" />

            {/* Header */}
            <header className="flex items-center justify-between px-6 py-3 border-b-2 border-cyber-cyan/20 bg-black/80 backdrop-blur-xl z-20 relative">
                {/* Accent line */}
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyber-cyan to-transparent opacity-50" />

                <div className="flex items-center gap-4">
                    <motion.h1 
                        className="text-2xl font-orbitron tracking-widest uppercase"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <span className="text-cyber-cyan">Code</span>
                        <span className="text-white">Ronin</span>
                    </motion.h1>
                    
                    {/* Level badge */}
                    <motion.div
                        className="px-3 py-1 rounded-md border-2 border-cyber-cyan/50 bg-cyber-cyan/10"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200 }}
                    >
                        <span className="text-xs text-cyber-cyan font-bold">LEVEL {level}</span>
                    </motion.div>
                </div>

                {/* Chaos Meter */}
                <div className="flex items-center gap-4 w-1/3">
                    <div className="flex flex-col items-end min-w-[140px]">
                        <span className="text-xs text-cyber-cyan/80 uppercase tracking-wider font-bold">Chaos Meter</span>
                        <span className={`text-[10px] font-mono ${isPyodideReady ? 'text-green-400' : 'text-red-400'}`}>
                            {initError ? `ERROR` : isPyodideReady ? 'RUNTIME READY' : 'LOADING...'}
                        </span>
                    </div>
                    <div className="flex-1 h-4 bg-gray-900/80 rounded-full overflow-hidden border-2 border-gray-700 relative">
                        <motion.div
                            className={`h-full ${sabotageEvent ? 'bg-gradient-to-r from-red-600 to-red-500' : 'bg-gradient-to-r from-cyan-600 to-cyan-400'}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${chaos}%` }}
                            transition={{ type: 'spring', damping: 20 }}
                        />
                        {chaos >= 90 && (
                            <motion.div 
                                className="absolute inset-0 bg-white/20"
                                animate={{ opacity: [0.2, 0.5, 0.2] }}
                                transition={{ duration: 0.5, repeat: Infinity }}
                            />
                        )}
                        {/* Percentage text */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-[10px] font-bold text-white drop-shadow-[0_0_3px_rgba(0,0,0,0.8)]">
                                {chaos}%
                            </span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main ref={containerRef} className="flex-1 flex gap-0 overflow-hidden relative">

                {/* Sabotage Overlay */}
                <AnimatePresence>
                    {sabotageEvent && (
                        <motion.div
                            initial={{ opacity: 0, y: -30, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -30, scale: 0.9 }}
                            className="absolute top-8 left-1/2 -translate-x-1/2 z-50 bg-black/95 border-2 border-red-500 text-red-500 px-8 py-5 rounded-lg shadow-[0_0_40px_rgba(255,0,60,0.6)] max-w-xl text-center backdrop-blur-xl"
                        >
                            <motion.div
                                className="absolute inset-0 bg-red-500/10 rounded-lg"
                                animate={{ opacity: [0.1, 0.3, 0.1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            />
                            <div className="relative">
                                <div className="flex items-center justify-center gap-3 mb-3">
                                    <AlertTriangle size={28} className="animate-pulse" />
                                    <h2 className="text-2xl font-orbitron tracking-widest">SABOTAGE INITIATED</h2>
                                </div>
                                <p className="text-white text-sm mb-3 font-mono leading-relaxed">{sabotageEvent.explanation}</p>
                                <div className="flex items-center justify-center gap-2">
                                    <span className="px-3 py-1 rounded-full text-xs border border-red-500/50 bg-red-500/20 uppercase tracking-wider">
                                        {sabotageEvent.type}
                                    </span>
                                </div>
                            </div>
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
                            className="absolute inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center"
                        >
                            <div className="text-center">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                    className="w-16 h-16 border-4 border-cyber-cyan border-t-transparent rounded-full mx-auto mb-4"
                                />
                                <div className="text-cyber-cyan font-orbitron text-2xl animate-pulse">
                                    NEURAL SABOTEUR ANALYZING...
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Left Panel - Code Editor */}
                <motion.div
                    layout
                    style={{ width: `${editorWidth}%` }}
                    className={`flex flex-col overflow-hidden relative transition-colors duration-500
                        ${sabotageEvent
                            ? 'border-r-2 border-red-500/50 shadow-[0_0_30px_rgba(255,0,60,0.2)]'
                            : 'border-r-2 border-cyber-cyan/30'}`}
                >
                    {/* Editor Header */}
                    <div className={`flex items-center justify-between px-4 py-2 border-b-2 transition-colors duration-500
                         ${sabotageEvent ? 'bg-red-500/10 border-red-500/30' : 'bg-cyber-cyan/10 border-cyber-cyan/20'}`}>
                        <div className="flex items-center gap-3">
                            <SquareTerminal size={16} className={sabotageEvent ? 'text-red-500' : 'text-cyber-cyan'} />
                            <span className={`text-sm font-mono font-bold ${sabotageEvent ? 'text-red-500' : 'text-cyber-cyan'}`}>
                                main.py
                            </span>
                            {sabotageEvent && (
                                <motion.div
                                    className="px-2 py-0.5 rounded text-[10px] bg-red-500/20 border border-red-500/50 text-red-400 uppercase tracking-wider"
                                    animate={{ opacity: [0.5, 1, 0.5] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                >
                                    COMPROMISED
                                </motion.div>
                            )}
                        </div>
                        <div className="flex gap-2">
                            <motion.button
                                onClick={handleReset}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex items-center gap-2 px-3 py-1.5 rounded-md text-xs bg-gray-800/80 text-gray-300 border border-gray-700 hover:border-gray-500 hover:bg-gray-700 transition-all"
                            >
                                <RotateCcw size={12} />
                                RESET
                            </motion.button>
                            <motion.button
                                onClick={initError ? () => window.location.reload() : handleRun}
                                disabled={(!isPyodideReady && !initError) || isRunning || isThinking}
                                whileHover={isPyodideReady ? { scale: 1.05 } : {}}
                                whileTap={isPyodideReady ? { scale: 0.95 } : {}}
                                className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-bold transition-all
                                    ${isPyodideReady
                                        ? 'bg-cyber-cyan/20 text-cyber-cyan hover:bg-cyber-cyan hover:text-black border-2 border-cyber-cyan shadow-[0_0_15px_rgba(0,243,255,0.3)]'
                                        : initError 
                                        ? 'bg-red-900/50 text-red-200 hover:bg-red-800 cursor-pointer border-2 border-red-500' 
                                        : 'bg-gray-800 text-gray-500 cursor-not-allowed border-2 border-gray-700'}`}
                            >
                                <Play size={14} />
                                {initError ? 'RETRY' : !isPyodideReady ? 'LOADING...' : isRunning ? 'RUNNING...' : 'RUN CODE'}
                            </motion.button>
                        </div>
                    </div>

                    {/* Monaco Editor */}
                    <div className="flex-1 relative bg-[#1e1e1e]">
                        <Editor
                            height="100%"
                            defaultLanguage="python"
                            value={code}
                            onChange={handleEditorChange}
                            theme="vs-dark"
                            options={{
                                minimap: { enabled: false },
                                fontSize: 14,
                                fontFamily: 'JetBrains Mono, monospace',
                                cursorBlinking: 'smooth',
                                smoothScrolling: true,
                                padding: { top: 16, bottom: 16 },
                                lineNumbers: 'on',
                                renderLineHighlight: 'all',
                                scrollBeyondLastLine: false,
                                automaticLayout: true,
                            }}
                        />
                    </div>
                </motion.div>

                {/* Horizontal Resize Handle */}
                <div
                    className="w-1 bg-cyber-cyan/20 hover:bg-cyber-cyan/50 cursor-col-resize relative group transition-colors flex items-center justify-center"
                    onMouseDown={() => {
                        setIsResizing(true);
                        setResizeType('horizontal');
                    }}
                >
                    <div className="absolute inset-y-0 -left-1 -right-1" />
                    <GripVertical size={16} className="text-cyber-cyan/40 group-hover:text-cyber-cyan transition-colors" />
                </div>

                {/* Right Panel - Output & Test Cases */}
                <motion.div
                    layout
                    style={{ width: `${100 - editorWidth}%` }}
                    className="flex flex-col overflow-hidden bg-black/40"
                >
                    {/* Terminal Output */}
                    <motion.div
                        layout
                        style={{ height: `${terminalHeight}%` }}
                        className="flex flex-col border-b-2 border-cyber-cyan/20 overflow-hidden"
                    >
                        {/* Terminal Header */}
                        <div className="flex items-center justify-between px-4 py-2 bg-purple-500/10 border-b-2 border-purple-500/20">
                            <div className="flex items-center gap-2">
                                <SquareTerminal size={16} className="text-purple-400" />
                                <span className="text-sm text-purple-400 font-bold uppercase tracking-wider">Terminal Output</span>
                            </div>
                            {won && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/20 border border-green-500/50"
                                >
                                    <CheckCircle2 size={14} className="text-green-400" />
                                    <span className="text-xs text-green-400 font-bold">LEVEL CLEARED</span>
                                </motion.div>
                            )}
                        </div>

                        {/* Terminal Content */}
                        <div className="flex-1 p-4 font-mono text-sm whitespace-pre-wrap overflow-y-auto text-gray-300 bg-[#0a0a0a] selection:bg-purple-500/30">
                            {output}
                        </div>
                    </motion.div>

                    {/* Vertical Resize Handle */}
                    <div
                        className="h-1 bg-cyber-cyan/20 hover:bg-cyber-cyan/50 cursor-row-resize relative group transition-colors flex items-center justify-center"
                        onMouseDown={() => {
                            setIsResizing(true);
                            setResizeType('vertical');
                        }}
                    >
                        <div className="absolute inset-x-0 -top-1 -bottom-1" />
                        <div className="rotate-90">
                            <GripVertical size={16} className="text-cyber-cyan/40 group-hover:text-cyber-cyan transition-colors" />
                        </div>
                    </div>

                    {/* Test Cases Section */}
                    <motion.div
                        layout
                        style={{ height: `${100 - terminalHeight}%` }}
                        className="flex flex-col overflow-hidden"
                    >
                        {/* Test Cases Header */}
                        <div className="flex items-center justify-between px-4 py-2 bg-cyan-500/10 border-b-2 border-cyan-500/20">
                            <div className="flex items-center gap-2">
                                <FlaskConical size={16} className="text-cyan-400" />
                                <span className="text-sm text-cyan-400 font-bold uppercase tracking-wider">Test Cases</span>
                            </div>
                            <motion.button
                                onClick={() => setShowHiddenTests(!showHiddenTests)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex items-center gap-2 px-3 py-1 rounded-md text-xs bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 hover:bg-cyan-500/30 transition-all"
                            >
                                {showHiddenTests ? <EyeOff size={12} /> : <Eye size={12} />}
                                {showHiddenTests ? 'Hide' : 'Show'} Hidden Tests
                            </motion.button>
                        </div>

                        {/* Test Cases Content */}
                        <div className="flex-1 overflow-y-auto bg-[#0a0a0a] p-4">
                            <div className="space-y-3">
                                {testCases
                                    .filter(tc => !tc.hidden || showHiddenTests)
                                    .map((tc, idx) => (
                                        <motion.div
                                            key={tc.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                            className={`p-3 rounded-lg border-2 ${
                                                tc.passed === true 
                                                    ? 'bg-green-500/5 border-green-500/30'
                                                    : tc.passed === false
                                                    ? 'bg-red-500/5 border-red-500/30'
                                                    : 'bg-gray-800/30 border-gray-700/50'
                                            }`}
                                        >
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs font-bold text-cyan-400">Test Case {tc.id}</span>
                                                    {tc.hidden && (
                                                        <span className="px-2 py-0.5 rounded-full text-[10px] bg-purple-500/20 border border-purple-500/50 text-purple-400 uppercase">
                                                            Hidden
                                                        </span>
                                                    )}
                                                </div>
                                                {tc.passed === true && (
                                                    <CheckCircle2 size={16} className="text-green-500" />
                                                )}
                                                {tc.passed === false && (
                                                    <AlertTriangle size={16} className="text-red-500" />
                                                )}
                                            </div>
                                            <div className="space-y-2 text-xs font-mono">
                                                <div>
                                                    <span className="text-gray-500">Input:</span>
                                                    <div className="mt-1 p-2 bg-black/40 rounded border border-gray-800 text-gray-300">
                                                        {tc.input}
                                                    </div>
                                                </div>
                                                <div>
                                                    <span className="text-gray-500">Expected:</span>
                                                    <div className="mt-1 p-2 bg-black/40 rounded border border-gray-800 text-gray-300">
                                                        {tc.expected}
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                            </div>
                        </div>
                    </motion.div>
                </motion.div>

            </main>
        </div>
    );
};

export default Arena;