import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const LANDING_DURATION_MS = 3000;

const Landing: React.FC = () => {
    const navigate = useNavigate();
    const [show, setShow] = useState(true);

    useEffect(() => {
        const t = setTimeout(() => {
            setShow(false);
            navigate('/login', { replace: true });
        }, LANDING_DURATION_MS);
        return () => clearTimeout(t);
    }, [navigate]);

    return (
        <AnimatePresence mode="wait">
            {show && (
                <motion.div
                    key="landing"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6 }}
                    className="min-h-screen bg-neon-bg flex flex-col items-center justify-center font-mono"
                >
                    <motion.h1
                        className="font-orbitron text-4xl md:text-5xl text-neon-cyan tracking-[0.3em] uppercase"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                    >
                        Code<span className="text-white">Ronin</span>
                    </motion.h1>
                    <motion.p
                        className="mt-4 text-gray-400 text-sm tracking-widest uppercase"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6, duration: 0.4 }}
                    >
                        The only coding platform that fights back.
                    </motion.p>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Landing;
