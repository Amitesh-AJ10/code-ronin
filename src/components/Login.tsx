import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase, testSupabaseConnection } from '../lib/supabase';
import { motion } from 'framer-motion';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [supabaseStatus, setSupabaseStatus] = useState<{ ok: boolean; message: string } | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        testSupabaseConnection().then(setSupabaseStatus);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        setLoading(false);

        if (signInError) {
            const msg =
                signInError.message.toLowerCase().includes('email not confirmed')
                    ? 'Check your email and click the confirmation link, then try again.'
                    : signInError.message;
            setError(msg);
            return;
        }
        navigate('/skills', { replace: true });
    };

    return (
        <div className="min-h-screen bg-neon-bg flex flex-col items-center justify-center p-6 font-mono">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md rounded-lg border border-neon-cyan/30 bg-black/40 p-8 shadow-[0_0_20px_rgba(0,243,255,0.1)]"
            >
                <h1 className="font-orbitron text-2xl text-neon-cyan tracking-widest uppercase mb-2">
                    Code<span className="text-white">Ronin</span>
                </h1>
                <p className="text-sm text-gray-400 mb-6">Sign in to enter the dojo</p>

                {supabaseStatus !== null && (
                    <div
                        className={`mb-4 rounded px-3 py-2 text-xs font-mono ${
                            supabaseStatus.ok ? 'bg-green-900/30 border border-green-500/50 text-green-400' : 'bg-red-900/30 border border-red-500/50 text-red-400'
                        }`}
                        role="status"
                    >
                        Supabase: {supabaseStatus.message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <label htmlFor="email" className="block text-xs text-neon-cyan/80 uppercase tracking-wider mb-1">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            autoComplete="email"
                            className="w-full px-4 py-2 rounded bg-gray-900 border border-gray-700 text-white placeholder-gray-500 focus:border-neon-cyan focus:outline-none focus:ring-1 focus:ring-neon-cyan"
                            placeholder="you@example.com"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-xs text-neon-cyan/80 uppercase tracking-wider mb-1">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            autoComplete="current-password"
                            className="w-full px-4 py-2 rounded bg-gray-900 border border-gray-700 text-white placeholder-gray-500 focus:border-neon-cyan focus:outline-none focus:ring-1 focus:ring-neon-cyan"
                            placeholder="••••••••"
                        />
                    </div>
                    {error && (
                        <p className="text-sm text-glitch-red" role="alert">
                            {error}
                        </p>
                    )}
                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-2 w-full py-2 rounded font-bold text-black bg-neon-cyan hover:bg-neon-cyan/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {loading ? 'Signing in...' : 'Sign in'}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-400">
                    New here?{' '}
                    <Link to="/register" className="text-neon-cyan hover:underline">
                        Register
                    </Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Login;
