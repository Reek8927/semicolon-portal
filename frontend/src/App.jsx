import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Auth from './pages/Auth.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Admin from './pages/Admin.jsx';
import Leaderboard from './pages/Leaderboard.jsx';
import Fees from './pages/Fees.jsx'; // 💳 Payment portal import

function App() {
  // 🚀 LIVE STATE SYSTEM CONFIGURATION:
  // We extract tokens and user profiles directly out of cache storage hooks
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);

  // Centralized route permissions flags calculated on the active user state context
  const isTeacher = user && user.role === 'admin';
  const isApprovedStudent = user && user.role === 'student' && user.isApproved === true;
  const isPendingStudent = user && user.role === 'student' && !user.isApproved;

  // Notification UI states
  const [notifications, setNotifications] = useState([]);
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  // 🚀 ACTIVE SYNCHRONIZATION EVENT MATRIX:
  // Flashes data re-evaluation flags immediately when Auth.jsx logs a student profile in
  useEffect(() => {
    const handleAuthStateShift = () => {
      setToken(localStorage.getItem('token') || null);
      setUser(JSON.parse(localStorage.getItem('user')) || null);
    };

    // Listen global-wide for the event flag dispatch token
    window.addEventListener('authChange', handleAuthStateShift);
    
    return () => {
      window.removeEventListener('authChange', handleAuthStateShift);
    };
  }, []);

  // Sync classroom notification feed automatically if student is approved and logged in
  useEffect(() => {
    if (!token || isTeacher || isPendingStudent) return;
    
    const activeBatch = user?.batchTag || 'Class-12-CA';
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/notifications/batch/${activeBatch}`)
      .then(res => res.ok ? res.json() : [])
      .then(data => setNotifications(data))
      .catch(err => console.error('Notification synchronization offline:', err));
  }, [token, isTeacher, isPendingStudent, user?.batchTag]);

  // Core execution: clear storage parameters and hard-refresh context views
  const handleLogout = () => {
    localStorage.clear();
    // Re-initialize app state variables to null values natively
    setToken(null);
    setUser(null);
    window.location.href = '/';
  };

  return (
    <Router>
      <div className="min-h-screen bg-[#0b0f19] text-slate-100 font-sans selection:bg-purple-500/30">
        
        {/* Pinterest-Style Premium Floating Navigation Header Layout */}
        <header className="p-4 max-w-7xl mx-auto relative z-50">
          <nav className="bg-[#161b26]/80 backdrop-blur-md border border-white/5 px-6 py-4 rounded-2xl flex justify-between items-center shadow-xl">
            
            {/* Logo Link redirects safely to root home anchor pages */}
            <Link to="/" className="flex items-center gap-2 group">
              <span className="h-3 w-3 bg-lime-400 rounded-full shadow-[0_0_10px_#a3e635]"></span>
              <div className="font-black text-xl tracking-wider bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                ; SEMICOLON
              </div>
            </Link>
            
            {/* Navigation Action Anchors Links Group Module */}
            <div className="flex items-center bg-black/40 p-1 rounded-xl border border-white/5 space-x-1">
              <Link to="/" className="px-3 py-1.5 text-slate-400 hover:text-white font-bold text-xs transition">Home</Link>
              
              {!token ? (
                <Link to="/auth" className="px-4 py-1.5 bg-white text-slate-950 font-black text-xs rounded-lg transition shadow-md">
                  Portal Login
                </Link>
              ) : (
                <>
                  {/* Dynamic Badge Displayed only when account validation queue is open */}
                  {isPendingStudent && (
                    <span className="text-[10px] bg-amber-500/10 border border-amber-500/20 text-amber-400 font-black px-3 py-1 rounded-lg uppercase tracking-wider animate-pulse mr-1">
                      Awaiting Approval ⏳
                    </span>
                  )}

                  {/* Standard Approved Students Workspaces links */}
                  {isApprovedStudent && <Link to="/dashboard" className="px-3 py-1.5 text-slate-300 hover:text-white font-bold text-xs transition">Classroom</Link>}
                  {isApprovedStudent && <Link to="/leaderboard" className="px-3 py-1.5 text-slate-400 hover:text-white font-semibold text-xs transition">Leaderboard</Link>}
                  {isApprovedStudent && <Link to="/fees" className="px-3 py-1.5 text-slate-400 hover:text-white font-semibold text-xs transition">Fees 💳</Link>}

                  {/* High-Level Admin Control Center Pathways link */}
                  {isTeacher && <Link to="/admin" className="px-3 py-1.5 text-cyan-400 hover:text-cyan-300 font-bold text-xs transition font-mono">Admin Desk</Link>}
                  
                  {/* 🔔 Interactive Notification Dropdown Triggers */}
                  {isApprovedStudent && (
                    <div className="relative">
                      <button 
                        onClick={() => setIsAlertOpen(!isAlertOpen)} 
                        className="p-1.5 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/5 rounded-xl text-xs transition relative cursor-pointer"
                      >
                        <span>🔔</span>
                        {notifications.length > 0 && (
                          <span className="absolute -top-1 -right-1 h-2 w-2 bg-cyan-400 rounded-full shadow-[0_0_8px_#22d3ee]"></span>
                        )}
                      </button>

                      {isAlertOpen && (
                        <div className="absolute right-0 mt-3 w-72 bg-[#161b26] border border-white/10 p-4 rounded-2xl shadow-2xl space-y-3 z-50 animate-scale-up">
                          <div className="flex justify-between items-center pb-2 border-b border-white/5">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Classroom Updates</span>
                            <span className="text-[9px] bg-cyan-500/10 text-cyan-400 px-1.5 rounded font-bold">{notifications.length} New</span>
                          </div>
                          <div className="max-h-60 overflow-y-auto space-y-2 pr-0.5">
                            {notifications.length === 0 ? (
                              <p className="text-center py-4 text-[11px] text-slate-500">All caught up! No active updates found.</p>
                            ) : (
                              notifications.map((alert) => (
                                <div key={alert._id} className="p-2.5 bg-black/20 border border-white/5 rounded-xl text-left space-y-0.5">
                                  <h4 className="font-bold text-xs text-slate-200">{alert.title}</h4>
                                  <p className="text-[10px] text-slate-400 leading-normal">{alert.message}</p>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Universal Logout Operator Block Button */}
                  <button 
                    onClick={handleLogout} 
                    className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 font-bold text-xs rounded-lg transition active:scale-95 cursor-pointer"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </nav>
        </header>

        {/* Dynamic Display Canvas View Routing Matrix */}
        <main className="container mx-auto max-w-7xl py-4 relative z-10">
          <Routes>
            <Route path="/" element={<Home />} />
            
            {/* Form Routing Security Matrix Checks */}
            <Route path="/auth" element={!token ? <Auth /> : (isTeacher ? <Navigate to="/admin" /> : <Navigate to="/dashboard" />)} />
            
            {/* Guarded Student Dashboard Route (Splits between Waiting Room and active classroom) */}
            <Route path="/dashboard" element={
              token && !isTeacher ? (
                isApprovedStudent ? (
                  <Dashboard />
                ) : (
                  /* 🔒 FROSTED GLASS LOCKED WAITING ROOM COMPONENT VIEW */
                  <div className="max-w-md mx-auto mt-24 bg-[#161b26]/60 backdrop-blur-md border border-white/5 p-8 rounded-3xl text-center space-y-4 shadow-2xl relative">
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 text-5xl animate-bounce">🔒</div>
                    <h2 className="text-xl font-black text-white tracking-tight pt-2">Admissions Request Processing</h2>
                    <p className="text-xs text-slate-400 leading-relaxed font-medium">
                      Hey {user?.name || "Student"}, your registration parameters have been securely staged. Semicolon Admin is currently reviewing your application credentials. You will gain immediate entry the moment a teacher verifies your seat and allocates your active batch!
                    </p>
                    <div className="border-t border-white/5 pt-4">
                      <button onClick={handleLogout} className="text-xs text-rose-400 hover:text-rose-300 font-bold hover:underline bg-transparent border-none cursor-pointer">
                        Sign Out / Clear Session State
                      </button>
                    </div>
                  </div>
                )
              ) : (
                <Navigate to="/auth" />
              )
            } />
            
            {/* Guarded Admin Dashboard Route */}
            <Route path="/admin" element={token && isTeacher ? <Admin /> : <Navigate to="/auth" />} />
            
            {/* Guarded Gamified Leaderboard Route */}
            <Route path="/leaderboard" element={token && isApprovedStudent ? <Leaderboard /> : <Navigate to="/auth" />} />
            
            {/* Guarded Invoice Payment Ledger Route */}
            <Route path="/fees" element={token && isApprovedStudent ? <Fees /> : <Navigate to="/auth" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;