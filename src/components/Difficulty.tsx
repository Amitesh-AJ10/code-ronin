import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const DIFFICULTIES = [
    { id: 'syntax', label: 'Syntax Goblin', desc: 'Beginner — missing colons, typos' },
    { id: 'logic', label: 'Logic Gremlin', desc: 'Intermediate — off-by-one, state bugs' },
    { id: 'semantic', label: 'Semantic Impostor', desc: 'Advanced — subtle library misuses' },
] as const;

const Difficulty: React.FC = () => {
    const navigate = useNavigate();

    const handleDifficulty = (id: string) => {
        // TODO: persist difficulty (Supabase/backend)
        navigate('/arena', { replace: true });
    };

    return (
        <div className="min-h-screen bg-neon-bg flex flex-col items-center justify-center p-6 font-mono">
            <motion.h1
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-orbitron text-2xl text-neon-cyan tracking-widest uppercase mb-2"
            >
                Code<span className="text-white">Ronin</span>
            </motion.h1>
            <p className="text-gray-400 text-sm mb-10">Choose difficulty</p>
            <div className="flex flex-col gap-4 w-full max-w-md">
                {DIFFICULTIES.map((d, i) => (
                    <motion.button
                        key={d.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        onClick={() => handleDifficulty(d.id)}
                        className="py-4 px-6 rounded-lg border border-neon-purple/30 bg-black/40 text-left hover:border-neon-purple hover:bg-neon-purple/10 transition-colors"
                    >
                        <span className="font-orbitron text-white tracking-wider block">{d.label}</span>
                        <span className="text-xs text-gray-400 mt-1">{d.desc}</span>
                    </motion.button>
                ))}
            </div>
        </div>
    );
};

export default Difficulty;
