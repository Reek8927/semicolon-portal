import React, { useState } from 'react';

function Auth() {
    const [isLogin, setIsLogin] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
        const payload = isLogin ? { email, password } : { name, email, password };

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Authentication configuration failed');
            }

            if (isLogin) {
                // 1. Commit token and profile object parameters to local cache storage
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user)); // This passes { id, name, email, role }
                
                setMessage(`Session verified! Diverting to authorized dashboard space...`);
                
                // 2. Evaluate role property values to perform precise conditional workspace split-routing
                setTimeout(() => {
                    if (data.user.role === 'admin') {
                        window.location.href = '/admin';
                    } else {
                        window.location.href = '/dashboard';
                    }
                }, 1200);

            } else {
                setMessage('Account cataloged successfully! Diverting to security sign-in... 🎉');
                setTimeout(() => {
                    setIsLogin(true);
                    setName('');
                    setEmail('');
                    setPassword('');
                    setMessage('');
                }, 2000);
            }

        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[75vh] px-4 relative animate-fade-in">
            {/* Ambient Background Light Glowing Vector Orbs */}
            <div className="absolute top-1/4 left-1/3 h-64 w-64 bg-cyan-500/10 rounded-full blur-[90px] pointer-events-none"></div>
            <div className="absolute bottom-1/4 right-1/3 h-64 w-64 bg-purple-500/10 rounded-full blur-[90px] pointer-events-none"></div>

            {/* Pinterest-Style Frosted Glass Gateway Container Card */}
            <div className="bg-[#161b26]/60 backdrop-blur-md border border-white/5 p-8 rounded-3xl w-full max-w-md shadow-2xl relative z-10 space-y-6 transition-all duration-300 hover:border-white/10">
                
                <div className="text-center space-y-1">
                    <h2 className="text-3xl font-black text-white tracking-tight">
                        {isLogin ? '; Semicolon' : 'Create Profile'}
                    </h2>
                    <p className="text-slate-400 text-xs font-medium">
                        {isLogin ? 'Provide secure teacher or student keys to enter' : 'Register your identity parameters to initialize learning data'}
                    </p>
                </div>

                {/* Status Update Information Ribbons */}
                {message && (
                    <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs font-medium text-center shadow-inner">
                        {message}
                    </div>
                )}
                {error && (
                    <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-xs font-medium text-center shadow-inner">
                        {error}
                    </div>
                )}

                {/* Interactive Dynamic Form Matrix */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLogin && (
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5 pl-1">Legal Full Name</label>
                            <input 
                                type="text" 
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-3 bg-black/30 border border-white/5 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 focus:bg-black/50 transition duration-200 font-medium"
                                placeholder="e.g., Ayush Basu" 
                                required 
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5 pl-1">Email Registration Key</label>
                        <input 
                            type="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 bg-black/30 border border-white/5 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 focus:bg-black/50 transition duration-200 font-medium"
                            placeholder="student@semicolon.com" 
                            required 
                        />
                    </div>

                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5 pl-1">Password Identifier</label>
                        <input 
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 bg-black/30 border border-white/5 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 focus:bg-black/50 transition duration-200 font-mono"
                            placeholder="••••••••" 
                            required 
                        />
                    </div>

                    <button type="submit" className="w-full bg-white text-slate-950 font-black py-3 rounded-xl hover:bg-slate-100 active:scale-95 transition text-sm tracking-wide shadow-[0_4px_20px_rgba(255,255,255,0.1)] mt-4 uppercase">
                        {isLogin ? 'Establish Connection' : 'Generate Profile'}
                    </button>
                </form>

                {/* Subtext Footer Toggles */}
                <div className="text-center text-xs text-slate-400 border-t border-white/5 pt-4">
                    {isLogin ? "New curriculum operator? " : "Profile entry established? "}
                    <button 
                        onClick={() => { setIsLogin(!isLogin); setError(''); setMessage(''); }} 
                        className="text-lime-400 font-bold hover:underline ml-0.5 tracking-wide bg-transparent border-none cursor-pointer"
                    >
                        {isLogin ? 'Sign Up' : 'Log In'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Auth;