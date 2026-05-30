import React, { useState, useEffect } from 'react';
import QuizPlayer from '../components/QuizPlayer.jsx';

function Dashboard() {
    const [lectures, setLectures] = useState([]);
    const [activeLecture, setActiveLecture] = useState(null);
    const [activeQuiz, setActiveQuiz] = useState(null);
    const [isQuizOpen, setIsQuizOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const currentBatch = 'Class-12-CA'; 

    useEffect(() => {
        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/lectures/batch/${currentBatch}`)
            .then(res => res.ok ? res.json() : [])
            .then(data => {
                setLectures(data);
                if (data.length > 0) setActiveLecture(data[0]);
                setLoading(false);
            })
            .catch(err => { setError(err.message); setLoading(false); });
    }, []);

    useEffect(() => {
        if (!activeLecture) return;
        setActiveQuiz(null);
        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/quizzes/lecture/${activeLecture._id}`)
            .then(res => res.ok ? res.json() : null)
            .then(data => setActiveQuiz(data))
            .catch(() => setActiveQuiz(null));
    }, [activeLecture]);

    if (loading) return <div className="text-center py-24 text-slate-400 font-medium tracking-wide animate-pulse">Initializing Ethereal Core Systems...</div>;
    if (error) return <div className="text-center py-24 text-rose-500 font-bold">Error Loading Streams: {error}</div>;

    return (
        <div className="px-4 space-y-6 animate-fade-in duration-500">
            
            {/* Animated Greeting Banner with Gentle Float effect */}
            <div className="relative bg-gradient-to-br from-[#a3e635] via-[#6ee7b7] to-[#34d399] p-8 rounded-3xl shadow-[0_10px_30px_rgba(163,230,53,0.15)] overflow-hidden text-slate-950 flex flex-col md:flex-row md:justify-between md:items-center gap-6 transition-all duration-500 transform hover:shadow-[0_15px_35px_rgba(163,230,53,0.3)]">
                <div className="absolute -right-10 -top-10 h-40 w-40 bg-white/20 rounded-full blur-2xl animate-pulse"></div>
                <div className="relative z-10 space-y-1">
                    <span className="bg-slate-950/10 text-slate-950 text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full">Active Classroom Hub</span>
                    <h1 className="text-3xl font-black tracking-tight">Class 12 Computer Application 🖥️</h1>
                    <p className="text-sm font-semibold text-slate-900/80">Continuous Streak: Active • Real-time curriculum delivery environment</p>
                </div>
                <button onClick={() => { localStorage.clear(); window.location.href = '/'; }} className="relative z-10 bg-slate-950 text-white font-bold text-xs px-5 py-3 rounded-2xl hover:bg-slate-900 active:scale-95 transition-all duration-200 tracking-wide shadow-lg self-start md:self-auto">
                    Terminate Session
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* LEFT PANEL: Playlist Card Stacks with Smooth Dynamic Scaling items */}
                <div className="bg-[#161b26]/60 backdrop-blur-md border border-white/5 p-4 rounded-3xl shadow-xl h-[72vh] overflow-y-auto space-y-3">
                    <div className="px-2 pb-2 border-b border-white/5 flex items-center justify-between">
                        <span className="font-black text-xs uppercase tracking-widest text-slate-400">Curriculum Syllabus</span>
                        <span className="bg-white/5 text-slate-300 font-mono text-[10px] px-2 py-0.5 rounded border border-white/5">{lectures.length} Topics</span>
                    </div>
                    
                    <div className="space-y-2.5">
                        {lectures.map((lecture, idx) => (
                            <button
                                key={lecture._id}
                                onClick={() => setActiveLecture(lecture)}
                                className={`w-full text-left p-4 rounded-2xl border flex flex-col gap-1.5 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] ${
                                    activeLecture?._id === lecture._id
                                        ? 'bg-white/10 border-white/20 shadow-xl text-white font-bold translate-x-1'
                                        : 'bg-black/20 border-white/0 hover:border-white/5 hover:bg-white/5 text-slate-400'
                                }`}
                            >
                                <span className={`text-[10px] font-black uppercase tracking-wider ${activeLecture?._id === lecture._id ? 'text-lime-400' : 'text-slate-500'}`}>
                                    {lecture.chapterName}
                                </span>
                                <span className="text-sm tracking-tight leading-snug">
                                    {idx + 1}. {lecture.topicTitle}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* RIGHT PANEL: Video and Interactive Control Tabs */}
                <div className="lg:col-span-2 space-y-4">
                    {activeLecture && (
                        <>
                            <div className="aspect-video w-full rounded-3xl overflow-hidden shadow-2xl border border-white/5 bg-black transition-transform duration-500 hover:scale-[1.005]">
                                <iframe
                                    className="w-full h-full"
                                    src={`https://www.youtube.com/embed/${activeLecture.youtubeVideoId}?rel=0&modestbranding=1`}
                                    title={activeLecture.topicTitle}
                                    frameBorder="0"
                                    allowFullScreen
                                ></iframe>
                            </div>

                            <div className="bg-[#161b26]/40 backdrop-blur-md border border-white/5 p-6 rounded-3xl shadow-xl space-y-4">
                                <div>
                                    <span className="bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-widest animate-pulse">
                                        {activeLecture.chapterName}
                                    </span>
                                    <h2 className="text-xl font-black text-white tracking-tight mt-3">{activeLecture.topicTitle}</h2>
                                </div>
                                
                                <div className="flex flex-wrap gap-3 border-t border-white/5 pt-4">
                                    {activeLecture.notesUrl && (
                                        <a href={activeLecture.notesUrl} target="_blank" rel="noreferrer" className="bg-white/5 hover:bg-white/10 text-white border border-white/10 px-5 py-3 rounded-2xl text-xs font-bold tracking-wide transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 hover-glow">
                                            📄 Chapter Review Notes
                                        </a>
                                    )}

                                    {/* Quiz Launcher Button with custom bouncing float look */}
                                    {activeQuiz ? (
                                        <button onClick={() => setIsQuizOpen(true)} className="bg-white text-slate-950 hover:bg-slate-200 px-5 py-3 rounded-2xl text-xs font-black tracking-wide transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0 shadow-[0_4px_20px_rgba(255,255,255,0.15)] hover:shadow-[0_8px_25px_rgba(163,230,53,0.3)] flex items-center gap-1.5 context-glowing">
                                            🎯 Start Interactive DPP Quiz
                                        </button>
                                    ) : (
                                        <button disabled className="bg-white/5 text-slate-600 border border-white/5 px-5 py-3 rounded-2xl text-xs font-semibold cursor-not-allowed">
                                            No Quiz Structure Loaded
                                        </button>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </div>

            </div>

            {isQuizOpen && activeQuiz && (
                <QuizPlayer quizData={activeQuiz} onClose={() => setIsQuizOpen(false)} />
            )}
        </div>
    );
}

export default Dashboard;