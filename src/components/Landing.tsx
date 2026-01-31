import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Cpu } from 'lucide-react';

const LANDING_DURATION_MS = 3500; // Increased slightly for the animation

const Landing: React.FC = () => {
    const navigate = useNavigate();
    const [progress, setProgress] = useState(0);

    // Timer logic + Progress Bar simulation
    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                return prev + 2; // Increment progress
            });
        }, 50);

        const timeout = setTimeout(() => {
            navigate('/login', { replace: true });
        }, LANDING_DURATION_MS);

        return () => {
            clearTimeout(timeout);
            clearInterval(interval);
        };
    }, [navigate]);

    return (
        <div className="min-h-screen bg-cyber-black flex flex-col items-center justify-center font-mono relative overflow-hidden">
            
            {/* Background Effects */}
            <div className="scanlines" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyber-cyan/5 via-transparent to-transparent opacity-50" />

            <AnimatePresence>
                <motion.div
                    className="z-10 text-center space-y-8 max-w-lg w-full p-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Icon Animation */}
                    <motion.div 
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 260, damping: 20 }}
                        className="flex justify-center"
                    >
                        <div className="relative">
                            <div className="absolute inset-0 bg-cyber-cyan blur-xl opacity-20 animate-pulse" />
                            <Terminal className="w-16 h-16 text-cyber-cyan relative z-10" />
                        </div>
                    </motion.div>

                    {/* Logo Glitch Effect */}
                    <div>
                        <h1 className="font-orbitron text-5xl md:text-6xl font-black tracking-widest text-white relative inline-block">
                            <span className="absolute -inset-1 text-cyber-red opacity-50 blur-[1px] animate-glitch ml-0.5 mt-0.5">
                                CODE RONIN
                            </span>
                            <span className="absolute -inset-1 text-cyber-cyan opacity-50 blur-[1px] animate-glitch -ml-0.5 -mt-0.5">
                                CODE RONIN
                            </span>
                            <span className="relative">
                                CODE <span className="text-cyber-cyan">RONIN</span>
                            </span>
                        </h1>
                        
                        <motion.p 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="mt-4 text-cyber-dim text-sm tracking-[0.3em] uppercase flex items-center justify-center gap-2"
                        >
                            <Cpu className="w-4 h-4" />
                            System Initialization
                        </motion.p>
                    </div>

                    {/* Loader Bar */}
                    <div className="w-full bg-cyber-gray border border-cyber-dim h-2 rounded-full overflow-hidden relative">
                        <motion.div 
                            className="h-full bg-cyber-cyan shadow-[0_0_10px_#00f3ff]"
                            style={{ width: `${progress}%` }}
                        />
                    </div>

                    {/* Terminal Output */}
                    <div className="h-16 text-xs text-left text-gray-500 font-mono space-y-1 overflow-hidden">
                        <p>{'>'} Connecting to Pyodide Runtime...</p>
                        {progress > 30 && <p>{'>'} Loading Neural Saboteur Models...</p>}
                        {progress > 60 && <p className="text-cyber-cyan">{'>'} ESTABLISHING SECURE CONNECTION...</p>}
                        {progress > 90 && <p className="text-green-500">{'>'} ACCESS GRANTED.</p>}
                    </div>

                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default Landing;