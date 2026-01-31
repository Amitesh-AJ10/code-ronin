import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const SKILLS = ['Pandas', 'OOPS', 'CP', 'Cryptograph'] as const;

const Skills: React.FC = () => {
    const navigate = useNavigate();

    const handleSkill = (skill: string) => {
        // TODO: persist skill selection (Supabase/backend)
        navigate('/difficulty', { replace: true });
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
            <p className="text-gray-400 text-sm mb-10">Choose your skill</p>
            <div className="grid grid-cols-2 gap-4 w-full max-w-md">
                {SKILLS.map((skill, i) => (
                    <motion.button
                        key={skill}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        onClick={() => handleSkill(skill)}
                        className="py-4 px-6 rounded-lg border border-neon-cyan/30 bg-black/40 text-white font-orbitron tracking-wider hover:border-neon-cyan hover:bg-neon-cyan/10 transition-colors"
                    >
                        {skill}
                    </motion.button>
                ))}
            </div>
        </div>
    );
};

export default Skills;
