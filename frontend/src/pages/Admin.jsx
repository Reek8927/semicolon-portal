import React, { useState, useEffect } from 'react';

function Admin() {
    // Lecture Form Fields State Tracking Matrix
    const [batchTag, setBatchTag] = useState('Class-12-CA');
    const [chapterName, setChapterName] = useState('');
    const [topicTitle, setTopicTitle] = useState('');
    const [youtubeVideoId, setYoutubeVideoId] = useState('');
    const [notesUrl, setNotesUrl] = useState('');

    // Dynamic Quiz Form Object Blueprint Array States
    const [targetLectureId, setTargetLectureId] = useState('');
    const [quizTitle, setQuizTitle] = useState('');
    const [questions, setQuestions] = useState([
        { questionText: '', options: ['', '', '', ''], correctOptionIndex: 0, explanation: '' }
    ]);

    // Core Roster Management & Accounting Summary Lists States
    const [pendingUsers, setPendingUsers] = useState([]);
    const [selectedBatches, setSelectedBatches] = useState({}); // Maps student IDs to selected batch dropdown values
    const [allPayments, setAllPayments] = useState([]);

    // System Success & Warning Banner Notification Strings
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const token = localStorage.getItem('token');

    // 1. Fetch Waiting Students Roster Catalog
    const fetchPendingRoster = () => {
        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/pending`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(res => res.ok ? res.json() : [])
        .then(data => {
            setPendingUsers(data);
            // Default select dropdown mapping records initialization
            const initialDropdownMap = {};
            data.forEach(u => { initialDropdownMap[u._id] = 'Class-12-CA'; });
            setSelectedBatches(initialDropdownMap);
        })
        .catch(err => console.error('Error compiling pending lists:', err));
    };

    // 2. Fetch All Recorded Tuition Ledger Receipts
    const fetchRevenueLedger = () => {
        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/payments/all`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(res => res.ok ? res.json() : [])
        .then(data => setAllPayments(data))
        .catch(err => console.error('Error fetching financial records:', err));
    };

    useEffect(() => {
        if (!token) return;
        fetchPendingRoster();
        fetchRevenueLedger();
    }, [token]);

    // Execution Core: Dispatch Video Node metadata to Cloud Collections
    const handleUploadLecture = async (e) => {
        e.preventDefault();
        setMessage(''); setError('');
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/lectures/upload`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ batchTag, chapterName, topicTitle, youtubeVideoId, notesUrl })
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Upload failed');
            
            // Generate a real-time notification alert log for the student dashboard feed
            await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/notifications/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    batchTag: batchTag,
                    title: 'New Lecture Alert! 🎥',
                    message: `Topic uploaded: "${topicTitle}" has been added to ${chapterName}.`
                })
            });

            setMessage(`Lecture Published Live & Announcement Broadcasted! Securely copy this Lecture ID to link a quiz block: ${data.lecture._id}`);
            setTopicTitle(''); setYoutubeVideoId(''); setNotesUrl('');
        } catch (err) {
            setError(err.message);
        }
    };

    // Execution Core: Process incoming pending admission requests
    const handleApproveStudent = async (studentId) => {
        setMessage(''); setError('');
        const chosenBatch = selectedBatches[studentId];

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/approve`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ studentId, allocatedBatch: chosenBatch })
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Approval routine termination error');

            setMessage(data.message);
            fetchPendingRoster(); // Refresh queue lists seamlessly
        } catch (err) {
            setError(err.message);
        }
    };

    // Form Track Controller: Append clean problem slots into array memory matrices
    const addQuestionBlock = () => {
        setQuestions([...questions, { questionText: '', options: ['', '', '', ''], correctOptionIndex: 0, explanation: '' }]);
    };

    const handleQuestionChange = (index, field, value, optionIdx = null) => {
        const updatedQuestions = [...questions];
        if (optionIdx !== null) {
            updatedQuestions[index].options[optionIdx] = value;
        } else {
            updatedQuestions[index][field] = value;
        }
        setQuestions(updatedQuestions);
    };

    // Execution Core: Package composite dynamic DPP block nodes to MongoDB Collections
    const handleCreateQuiz = async (e) => {
        e.preventDefault();
        setMessage(''); setError('');
        if (!targetLectureId) {
            setError('Provide a valid target database Lecture ID parameter string to anchor quiz objects.');
            return;
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/quizzes/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ batchTag, lectureId: targetLectureId, quizTitle, questions })
            });
            if (!response.ok) throw new Error('Quiz structural formulation configuration failure.');

            setMessage('Interactive Daily Practice Problem (DPP) is now deployed live! 🎯🎉');
            setTargetLectureId(''); setQuizTitle('');
            setQuestions([{ questionText: '', options: ['', '', '', ''], correctOptionIndex: 0, explanation: '' }]);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 pb-20 space-y-8 animate-fade-in relative">
            {/* Ambient Background Neon Glowing Spot Filters */}
            <div className="absolute top-1/4 right-12 h-80 w-80 bg-blue-500/5 rounded-full blur-[130px] pointer-events-none"></div>
            <div className="absolute bottom-1/4 left-12 h-80 w-80 bg-purple-500/5 rounded-full blur-[130px] pointer-events-none"></div>

            {/* Premium Header Studio Brand Block */}
            <div className="relative bg-gradient-to-br from-slate-900 via-[#111622] to-[#161b26] p-8 rounded-3xl border border-white/5 shadow-2xl overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1 relative z-10">
                    <span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md">
                        Master Control Console
                    </span>
                    <h1 className="text-3xl font-black text-white tracking-tight pt-1">Teacher Management Desk 🧑‍🏫</h1>
                    <p className="text-slate-400 text-xs font-medium">Control admissions routing, distribute streaming curriculums, and audit class fee ledgers.</p>
                </div>
                <div className="text-4xl filter drop-shadow-[0_0_10px_rgba(6,182,212,0.3)] select-none hidden md:block">⚙️</div>
            </div>

            {/* Global Communication Response Ribbon Alert Bars */}
            {message && <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl font-mono text-xs text-center shadow-inner select-all leading-relaxed">{message}</div>}
            {error && <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-2xl font-mono text-xs text-center shadow-inner">{error}</div>}

            {/* PHASE 00: PENDING REGISTRATIONS GATEWAY DESK */}
            <div className="bg-[#161b26]/60 backdrop-blur-md border border-white/5 p-6 md:p-8 rounded-3xl shadow-2xl space-y-4 transition-all duration-300 hover:border-white/10">
                <h3 className="text-base font-black text-white uppercase tracking-wider border-b border-white/5 pb-3 flex items-center gap-2">
                    <span className="h-2 w-2 bg-purple-500 rounded-full shadow-[0_0_8px_#a855f7]"></span>
                    🎟️ Phase 00: Pending Student Admissions Roster ({pendingUsers.length})
                </h3>
                
                {pendingUsers.length === 0 ? (
                    <p className="text-center py-6 text-xs text-slate-500 font-medium">Roster clean. No student verification metrics awaiting log processing.</p>
                ) : (
                    <div className="space-y-3">
                        {pendingUsers.map((student) => (
                            <div key={student._id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-black/20 border border-white/5 rounded-2xl gap-4 transition hover:bg-black/30">
                                <div className="space-y-0.5">
                                    <h4 className="font-bold text-sm text-white leading-tight">{student.name}</h4>
                                    <p className="text-[11px] text-slate-400 font-mono">{student.email}</p>
                                </div>
                                <div className="flex items-center gap-3 self-end sm:self-auto">
                                    <select 
                                        value={selectedBatches[student._id] || 'Class-12-CA'}
                                        onChange={(e) => setSelectedBatches({ ...selectedBatches, [student._id]: e.target.value })}
                                        className="p-2.5 bg-[#0b0f19] border border-white/5 rounded-xl text-xs font-bold text-slate-300 focus:outline-none"
                                    >
                                        <option value="Class-11-CA">Class 11 CA</option>
                                        <option value="Class-12-CA">Class 12 CA</option>
                                    </select>
                                    <button 
                                        onClick={() => handleApproveStudent(student._id)}
                                        className="bg-white hover:bg-slate-200 text-slate-950 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition active:scale-95 shadow-md cursor-pointer"
                                    >
                                        Grant Entry
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* PHASE 01: COURSE LECTURE PUBLISHER CONTAINER */}
            <form onSubmit={handleUploadLecture} className="bg-[#161b26]/60 backdrop-blur-md border border-white/5 p-6 md:p-8 rounded-3xl shadow-2xl space-y-5 transition-all duration-300 hover:border-white/10">
                <h3 className="text-base font-black text-white uppercase tracking-wider border-b border-white/5 pb-3 flex items-center gap-2">
                    <span className="h-2 w-2 bg-blue-500 rounded-full shadow-[0_0_8px_#3b82f6]"></span>
                    🎥 Phase 01: Deploy Course Lecture Video
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5 pl-1">Target Class Batch</label>
                        <select value={batchTag} onChange={(e) => setBatchTag(e.target.value)} className="w-full p-3 bg-black/30 border border-white/5 rounded-xl text-xs font-bold text-slate-300 focus:outline-none focus:border-blue-500/50 focus:bg-black/50 transition">
                            <option value="Class-11-CA">Class 11 Computer Application</option>
                            <option value="Class-12-CA">Class 12 Computer Application</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5 pl-1">Chapter Identity Name</label>
                        <input type="text" value={chapterName} onChange={(e) => setChapterName(e.target.value)} placeholder="e.g., Chapter 3: Boolean Algebra" className="w-full p-3 bg-black/30 border border-white/5 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/50 focus:bg-black/50 transition font-medium" required />
                    </div>
                </div>

                <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5 pl-1">Lesson Core Topic Title</label>
                    <input type="text" value={topicTitle} onChange={(e) => setTopicTitle(e.target.value)} placeholder="e.g., K-Map Optimization and Logic Minimization Techniques" className="w-full p-3 bg-black/30 border border-white/5 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/50 focus:bg-black/50 transition font-medium" required />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5 pl-1">YouTube Video Identifier Key</label>
                        <input type="text" value={youtubeVideoId} onChange={(e) => setYoutubeVideoId(e.target.value)} placeholder="e.g., kJQP7kiw5Fk" className="w-full p-3 bg-black/30 border border-white/5 rounded-xl text-xs text-cyan-400 font-mono placeholder-slate-600 focus:outline-none focus:border-blue-500/50 focus:bg-black/50 transition" required />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5 pl-1">Cloud PDF Study Reference Notes Link</label>
                        <input type="url" value={notesUrl} onChange={(e) => setNotesUrl(e.target.value)} placeholder="https://drive.google.com/..." className="w-full p-3 bg-black/30 border border-white/5 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none" />
                    </div>
                </div>

                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-3 rounded-xl text-xs uppercase tracking-widest transition shadow-[0_4px_15px_rgba(59,130,246,0.2)] cursor-pointer">
                    Commit Lecture to Streams Catalog 🚀
                </button>
            </form>

            {/* PHASE 02: DYNAMIC QUIZ CORE DESIGN MATRIX */}
            <form onSubmit={handleCreateQuiz} className="bg-[#161b26]/60 backdrop-blur-md border border-white/5 p-6 md:p-8 rounded-3xl shadow-2xl space-y-6 transition-all duration-300 hover:border-white/10">
                <h3 className="text-base font-black text-white uppercase tracking-wider border-b border-white/5 pb-3 flex items-center gap-2">
                    <span className="h-2 w-2 bg-amber-400 rounded-full shadow-[0_0_8px_#f59e0b]"></span>
                    🎯 Phase 02: Compose Interactive DPP Data Matrix
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5 pl-1">Target Anchor Lecture ID</label>
                        <input type="text" value={targetLectureId} onChange={(e) => setTargetLectureId(e.target.value)} placeholder="Paste generated lecture code string" className="w-full p-3 bg-black/30 border border-white/5 rounded-xl text-xs font-mono text-lime-400 placeholder-slate-600 focus:outline-none focus:border-amber-500/50 transition" required />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5 pl-1">DPP Title Header</label>
                        <input type="text" value={quizTitle} onChange={(e) => setQuizTitle(e.target.value)} placeholder="e.g., DPP 03: Karnaugh Map Evaluations" className="w-full p-3 bg-black/30 border border-white/5 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-500/50 transition font-medium" required />
                    </div>
                </div>

                <div className="space-y-6">
                    {questions.map((q, qIdx) => (
                        <div key={qIdx} className="p-5 border border-white/5 bg-black/20 rounded-2xl space-y-4 relative animate-scale-up">
                            <span className="bg-amber-400 text-slate-950 px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider absolute top-4 right-4">
                                Problem #{qIdx + 1}
                            </span>
                            
                            <div className="pt-2">
                                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1.5 pl-1">Question Statement Text</label>
                                <input type="text" value={q.questionText} onChange={(e) => handleQuestionChange(qIdx, 'questionText', e.target.value)} placeholder="State the question logic query block fields here..." className="w-full p-3 bg-black/20 border border-white/5 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500/40" required />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {q.options.map((opt, oIdx) => (
                                    <div key={oIdx} className="flex items-center gap-2">
                                        <span className="text-[10px] font-black h-9 w-9 bg-white/5 text-slate-400 rounded-xl flex items-center justify-center shrink-0 font-mono">
                                            {String.fromCharCode(65 + oIdx)}
                                        </span>
                                        <input type="text" value={opt} onChange={(e) => handleQuestionChange(qIdx, 'options', e.target.value, oIdx)} placeholder="Choice description data text..." className="w-full p-2.5 bg-black/10 border border-white/5 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-amber-500/30" required />
                                    </div>
                                ))}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1.5 pl-1">Set Correct Answer</label>
                                    <select value={q.correctOptionIndex} onChange={(e) => handleQuestionChange(qIdx, 'correctOptionIndex', parseInt(e.target.value))} className="w-full p-3 bg-black/30 border border-white/5 rounded-xl text-xs font-bold text-emerald-400 focus:outline-none focus:border-amber-500/40">
                                        <option value={0}>Option A</option><option value={1}>Option B</option><option value={2}>Option C</option><option value={3}>Option D</option>
                                    </select>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1.5 pl-1">Solution Concept Rationale Explanation</label>
                                    <input type="text" value={q.explanation} onChange={(e) => handleQuestionChange(qIdx, 'explanation', e.target.value)} placeholder="Provide context logic explaining why this option validates..." className="w-full p-3 bg-black/20 border border-white/5 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-amber-500/40" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-2">
                    <button type="button" onClick={addQuestionBlock} className="flex-1 border border-dashed border-white/10 hover:border-white/20 text-slate-300 py-3 rounded-xl text-xs font-bold tracking-wider uppercase transition bg-white/[0.01] hover:bg-white/[0.03] cursor-pointer">
                        ➕ Append Another Problem Block
                    </button>
                    <button type="submit" className="flex-1 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black py-3 rounded-xl text-xs uppercase tracking-widest transition shadow-[0_4px_15px_rgba(245,158,11,0.2)] cursor-pointer">
                        Publish Interactive DPP Package Live 🎯
                    </button>
                </div>
            </form>

            {/* PHASE 03: LIVE REVENUE LEDGER SUMMARY MONITOR */}
            <div className="bg-[#161b26]/60 backdrop-blur-md border border-white/5 p-6 md:p-8 rounded-3xl shadow-2xl space-y-4 transition-all duration-300 hover:border-white/10">
                <h3 className="text-base font-black text-white uppercase tracking-wider border-b border-white/5 pb-3 flex items-center gap-2">
                    <span className="h-2 w-2 bg-emerald-400 rounded-full shadow-[0_0_8px_#34d399]"></span>
                    📈 Semicolon Tuition Revenue Ledger Records ({allPayments.length})
                </h3>
                
                <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                    {allPayments.length === 0 ? (
                        <p className="text-center py-6 text-xs text-slate-500 font-medium">No fee collection logs indexed inside the dataset collections currently.</p>
                    ) : (
                        allPayments.map((payment) => (
                            <div key={payment._id} className="flex justify-between items-center p-3.5 bg-black/20 border border-white/5 rounded-2xl text-xs transition hover:bg-black/30">
                                <div>
                                    <span className="text-white font-bold text-sm">{payment.studentName}</span>
                                    <span className="bg-white/5 text-slate-400 border border-white/5 text-[10px] px-2 py-0.5 rounded-md ml-3 font-semibold">{payment.feeMonth}</span>
                                    <p className="text-[10px] text-slate-500 font-mono mt-1">Receipt Ref: {payment.transactionId}</p>
                                </div>
                                <div className="text-right">
                                    <span className="text-emerald-400 font-black text-base">₹{payment.amount}</span>
                                    <p className="text-[9px] text-slate-500 font-mono mt-0.5">{new Date(payment.paidAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

        </div>
    );
}

export default Admin;