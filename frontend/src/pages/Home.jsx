import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
    const token = localStorage.getItem('token');

    return (
        <div className="max-w-6xl mx-auto px-4 py-12 space-y-24 text-center md:text-left">
            
            {/* HERO SECTION: Dynamic Main Title and Glowing Background Gradients */}
            <div className="relative rounded-3xl bg-[#161b26]/40 border border-white/5 p-8 md:p-16 shadow-2xl overflow-hidden flex flex-col md:flex-row items-center justify-between gap-12">
                <div className="absolute -left-20 -bottom-20 h-72 w-72 bg-purple-500/10 rounded-full blur-3xl"></div>
                <div className="absolute -right-20 -top-20 h-72 w-72 bg-lime-500/10 rounded-full blur-3xl"></div>

                <div className="space-y-6 max-w-xl relative z-10">
                    <span className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1 rounded-full text-[11px] font-black tracking-widest text-lime-400 uppercase">
                        <span className="h-2 w-2 bg-lime-400 rounded-full animate-ping"></span>
                        Next-Gen Learning Portal Live
                    </span>
                    <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-none text-white">
                        Master Computer Applications with <span className="bg-gradient-to-r from-lime-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent">; Semicolon</span>
                    </h1>
                    <p className="text-slate-400 text-base md:text-lg font-medium leading-relaxed">
                        An immersive, distraction-free digital ecosystem built exclusively for modern programming students. Stream elite video modules, conquer interactive daily practice problems, and execute syntax effortlessly.
                    </p>
                    
                    <div className="pt-2 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                        {!token ? (
                            <Link to="/" className="bg-white text-slate-950 font-black px-8 py-3.5 rounded-2xl text-sm transition shadow-[0_4px_25px_rgba(255,255,255,0.2)] hover:bg-slate-100 tracking-wide text-center">
                                Access Student Portal ➜
                            </Link>
                        ) : (
                            <Link to="/dashboard" className="bg-gradient-to-r from-lime-400 to-emerald-400 text-slate-950 font-black px-8 py-3.5 rounded-2xl text-sm transition shadow-[0_4px_25px_rgba(163,230,53,0.2)] hover:opacity-90 tracking-wide text-center">
                                Go To My Dashboard ➜
                            </Link>
                        )}
                    </div>
                </div>

                {/* Visual Accent Container Mocking a Futuristic Code Window */}
                <div className="w-full max-w-sm bg-black/40 border border-white/10 rounded-2xl p-6 shadow-2xl font-mono text-xs text-slate-400 space-y-3 relative z-10 self-stretch flex flex-col justify-center">
                    <div className="flex gap-1.5 border-b border-white/5 pb-3">
                        <span className="h-3 w-3 bg-rose-500/80 rounded-full"></span>
                        <span className="h-3 w-3 bg-amber-500/80 rounded-full"></span>
                        <span className="h-3 w-3 bg-emerald-500/80 rounded-full"></span>
                    </div>
                    <p className="text-purple-400"><span className="text-slate-500">// Welcome to Semicolon Coaching</span></p>
                    <p><span className="text-teal-400">const</span> studentProfile = &#123;</p>
                    <p className="pl-4">name: <span className="text-amber-300">"Your Future Self"</span>,</p>
                    <p className="pl-4">syllabus: <span className="text-amber-300">"Computer Application"</span>,</p>
                    <p className="pl-4">interactiveDPP: <span className="text-lime-400">true</span>,</p>
                    <p className="pl-4">readyToCode: <span className="text-lime-400">true</span></p>
                    <p>&#125;;</p>
                </div>
            </div>

            {/* FEATURES SHOWCASE GRID: Frosted Glass Cards */}
            <div className="space-y-12">
                <div className="text-center space-y-2">
                    <h2 className="text-3xl font-black tracking-tight text-white">Engineered For Top Performance</h2>
                    <p className="text-slate-400 text-sm max-w-md mx-auto">Everything a computer application student needs to score maximum marks, consolidated into a single tab.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Feature 1 */}
                    <div className="bg-[#161b26]/50 border border-white/5 p-6 rounded-3xl text-left space-y-4 shadow-xl">
                        <div className="h-12 w-12 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-2xl flex items-center justify-center font-bold text-xl shadow-[0_0_15px_rgba(59,130,246,0.1)]">
                            🎥
                        </div>
                        <h3 className="text-lg font-bold text-white tracking-tight">Structured Video Lectures</h3>
                        <p className="text-slate-400 text-xs leading-relaxed">High-definition, localized syllabus video streams delivered sequentially by chapter without ad distractions or algorithm recommendations.</p>
                    </div>

                    {/* Feature 2 */}
                    <div className="bg-[#161b26]/50 border border-white/5 p-6 rounded-3xl text-left space-y-4 shadow-xl">
                        <div className="h-12 w-12 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-2xl flex items-center justify-center font-bold text-xl shadow-[0_0_15px_rgba(245,158,11,0.1)]">
                            🎯
                        </div>
                        <h3 className="text-lg font-bold text-white tracking-tight">Interactive DPP Quizzes</h3>
                        <p className="text-slate-400 text-xs leading-relaxed">Ditch clumsy assignment papers. Practice your topics instantly with our vibrant multiple-choice engine packed with automated scoring and code rationale sheets.</p>
                    </div>

                    {/* Feature 3 */}
                    <div className="bg-[#161b26]/50 border border-white/5 p-6 rounded-3xl text-left space-y-4 shadow-xl">
                        <div className="h-12 w-12 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-2xl flex items-center justify-center font-bold text-xl shadow-[0_0_15px_rgba(168,85,247,0.1)]">
                            ⚡
                        </div>
                        <h3 className="text-lg font-bold text-white tracking-tight">Ethereal Styling Concept</h3>
                        <p className="text-slate-400 text-xs leading-relaxed">An elegant dark mode canvas inspired by modern IDE interfaces, carefully engineered to eliminate eye fatigue during extensive code study periods.</p>
                    </div>
                </div>
            </div>

            {/* PLATFORM METRICS REPLICA (Pulling from your Pinterest style) */}
            <div className="bg-[#161b26]/20 border border-white/5 p-8 rounded-3xl flex flex-wrap gap-8 items-center justify-around text-center shadow-inner">
                <div>
                    <h4 className="text-3xl font-black text-white">100%</h4>
                    <p className="text-slate-500 text-xs uppercase font-bold mt-1 tracking-wider">Syllabus Covered</p>
                </div>
                <div className="h-8 w-px bg-white/5 hidden sm:block"></div>
                <div>
                    <h4 className="text-3xl font-black text-lime-400">Live</h4>
                    <p className="text-slate-500 text-xs uppercase font-bold mt-1 tracking-wider">Interactive DPPs</p>
                </div>
                <div className="h-8 w-px bg-white/5 hidden sm:block"></div>
                <div>
                    <h4 className="text-3xl font-black text-purple-400">0 Ads</h4>
                    <p className="text-slate-500 text-xs uppercase font-bold mt-1 tracking-wider">Distraction-Free</p>
                </div>
            </div>

        </div>
    );
}

export default Home;