import React, { useState, useEffect } from 'react';

function Leaderboard() {
    const [leaders, setLeaders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/leaderboard/top`)
            .then(res => res.ok ? res.json() : [])
            .then(data => { setLeaders(data); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    if (loading) return <div className="text-center py-12 text-slate-400 font-mono">Syncing Scoreboards...</div>;

    return (
        <div className="max-w-2xl mx-auto px-4 space-y-6">
            
            {/* Header Banner */}
            <div className="bg-gradient-to-br from-purple-500 via-indigo-500 to-cyan-500 p-6 rounded-3xl shadow-xl text-slate-950">
                <h1 className="text-2xl font-black tracking-tight">Semicolon Hall of Fame 🏆</h1>
                <p className="text-xs font-semibold opacity-90">Points are compiled live based on completed daily practice problems.</p>
            </div>

            {/* Frosted Glass Leaderboard Podiums Container */}
            <div className="bg-[#161b26]/60 backdrop-blur-md border border-white/5 p-6 rounded-3xl shadow-2xl space-y-3">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500 px-4 pb-2 border-b border-white/5">
                    <span>Rank & Student Name</span>
                    <span>Total Experience (XP)</span>
                </div>

                {leaders.length === 0 ? (
                    <p className="text-center py-6 text-xs text-slate-500 font-medium">No submission profiles documented yet. Be the first to secure points!</p>
                ) : (
                    <div className="space-y-2">
                        {leaders.map((student, index) => {
                            // Highlighting top 3 spots with distinct styling cues
                            let rankBadge = "bg-white/5 text-slate-400";
                            if (index === 0) rankBadge = "bg-amber-400 text-slate-950 shadow-[0_0_15px_rgba(234,179,8,0.3)] font-black animate-bounce";
                            if (index === 1) rankBadge = "bg-slate-300 text-slate-950 font-bold";
                            if (index === 2) rankBadge = "bg-amber-700/60 text-amber-200 font-bold";

                            return (
                                <div 
                                    key={student._id} 
                                    className={`flex justify-between items-center p-4 rounded-2xl transition-all duration-300 transform hover:scale-[1.01] border ${
                                        index === 0 
                                            ? 'bg-white/10 border-amber-500/30' 
                                            : 'bg-black/20 border-white/0 hover:border-white/5 hover:bg-white/5'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className={`h-6 w-6 rounded-lg flex items-center justify-center text-xs ${rankBadge}`}>
                                            {index + 1}
                                        </span>
                                        <span className={`text-sm font-bold ${index === 0 ? 'text-white' : 'text-slate-300'}`}>
                                            {student.name}
                                        </span>
                                    </div>
                                    <span className={`font-mono text-xs font-bold ${index === 0 ? 'text-lime-400' : 'text-cyan-400'}`}>
                                        {student.xp} XP
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Leaderboard;