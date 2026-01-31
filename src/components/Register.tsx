import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion';

const Register: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }
        setLoading(true);

        const { error: signUpError } = await supabase.auth.signUp({ email, password });
        setLoading(false);

        if (signUpError) {
            setError(signUpError.message);
            return;
        }
        setSuccess(true);
        setTimeout(() => navigate('/login', { replace: true }), 2000);
    };

    if (success) {
        return (
            <div className="min-h-screen bg-neon-bg flex flex-col items-center justify-center p-6 font-mono">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-md rounded-lg border border-neon-cyan/30 bg-black/40 p-8 text-center"
                >
                    <p className="text-neon-cyan font-orbitron text-lg">Account created.</p>
                    <p className="text-gray-400 mt-2">Check your email and click the confirmation link.</p>
                    <p className="text-gray-500 mt-1 text-sm">Then sign in. Redirecting to login...</p>
                </motion.div>
            </div>
        );
    }

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
                <p className="text-sm text-gray-400 mb-6">Create an account</p>

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
                            autoComplete="new-password"
                            minLength={6}
                            className="w-full px-4 py-2 rounded bg-gray-900 border border-gray-700 text-white placeholder-gray-500 focus:border-neon-cyan focus:outline-none focus:ring-1 focus:ring-neon-cyan"
                            placeholder="••••••••"
                        />
                    </div>
                    <div>
                        <label htmlFor="confirmPassword" className="block text-xs text-neon-cyan/80 uppercase tracking-wider mb-1">
                            Confirm password
                        </label>
                        <input
                            id="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            autoComplete="new-password"
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
                        {loading ? 'Creating account...' : 'Register'}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-400">
                    Already have an account?{' '}
                    <Link to="/login" className="text-neon-cyan hover:underline">
                        Sign in
                    </Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Register;
