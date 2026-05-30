import React, { useState } from 'react';

function QuizPlayer({ quizData, onClose }) {
    const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [score, setScore] = useState(0);
    const [showResults, setShowResults] = useState(false);
    const [userAnswers, setUserAnswers] = useState([]);

    const currentQuestion = quizData.questions[currentQuestionIdx];

    const handleOptionClick = (optionIdx) => {
        if (isSubmitted) return;
        setSelectedOption(optionIdx);
    };

    const handleVerifyAnswer = () => {
        if (selectedOption === null) return;

        const isCorrect = selectedOption === currentQuestion.correctOptionIndex;
        const newScore = isCorrect ? score + 1 : score;
        setScore(newScore);

        setUserAnswers([...userAnswers, {
            questionText: currentQuestion.questionText,
            selected: selectedOption,
            correct: currentQuestion.correctOptionIndex,
            explanation: currentQuestion.explanation
        }]);

        setIsSubmitted(true);
    };

    // 🚀 NEW: Transmit points data to the leaderboard database
    const syncXPToLeaderboard = async (finalScore) => {
        const localUser = JSON.parse(localStorage.getItem('user'));
        if (!localUser || !localUser.id) return;

        const pointsEarned = finalScore * 20; // Each correct response earns 20 XP

        try {
            await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/leaderboard/add-score`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: localUser.id, pointsEarned })
            });
            console.log(`Successfully credited ${pointsEarned} XP to student profile!`);
        } catch (err) {
            console.error("Scoreboard communication error:", err);
        }
    };

    const handleNext = () => {
        setSelectedOption(null);
        setIsSubmitted(false);

        if (currentQuestionIdx + 1 < quizData.questions.length) {
            setCurrentQuestionIdx(currentQuestionIdx + 1);
        } else {
            // Last question completed -> trigger score compilation sync
            const finalScore = selectedOption === currentQuestion.correctOptionIndex ? score + 1 : score;
            syncXPToLeaderboard(finalScore);
            setShowResults(true);
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-[#161b26] rounded-3xl shadow-2xl w-full max-w-2xl border border-white/10 max-h-[90vh] overflow-y-auto flex flex-col">
                
                {/* Header Section */}
                <div className="p-5 border-b border-white/5 flex justify-between items-center bg-black/20">
                    <div>
                        <h3 className="font-extrabold text-white text-lg">{quizData.quizTitle}</h3>
                        {!showResults && (
                            <p className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider mt-0.5">
                                Question {currentQuestionIdx + 1} of {quizData.questions.length}
                            </p>
                        )}
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-white text-xs font-bold bg-white/5 h-8 w-8 rounded-xl flex items-center justify-center border border-white/5 transition">
                        ✕
                    </button>
                </div>

                {/* Scoreboard Result Cards Panel */}
                {showResults ? (
                    <div className="p-8 text-center space-y-6 flex-1 animate-scale-up">
                        <div className="inline-flex flex-col items-center justify-center bg-gradient-to-br from-lime-400 to-emerald-400 text-slate-950 font-black text-3xl h-28 w-28 rounded-3xl shadow-[0_0_25px_rgba(163,230,53,0.3)] animate-pulse">
                            <div>{score}/{quizData.questions.length}</div>
                            <div className="text-[10px] uppercase tracking-wider opacity-80 mt-0.5">+{score * 20} XP</div>
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-white tracking-tight">DPP Evaluation Completed! 🏆</h2>
                            <p className="text-slate-400 text-xs mt-1">Your response parameters have been compiled and credited to the live leader ranking lists.</p>
                        </div>

                        {/* Solutions Explanations Tray */}
                        <div className="text-left space-y-4 border-t border-white/5 pt-6 max-h-[35vh] overflow-y-auto px-1">
                            <h4 className="font-black text-slate-400 text-[10px] uppercase tracking-widest">Answer Analysis Sheets</h4>
                            {userAnswers.map((item, idx) => (
                                <div key={idx} className="p-4 rounded-2xl border border-white/5 bg-black/20 space-y-2 text-xs">
                                    <p className="font-bold text-slate-200">{idx + 1}. {item.questionText}</p>
                                    <p className={item.selected === item.correct ? "text-emerald-400 font-bold" : "text-rose-400 font-bold"}>
                                        Your Answer: Option {String.fromCharCode(65 + item.selected)} 
                                        {item.selected === item.correct ? ' (Correct ✓)' : ` (Incorrect • Correct is ${String.fromCharCode(65 + item.correct)})`}
                                    </p>
                                    {item.explanation && (
                                        <p className="text-[11px] text-slate-400 bg-black/40 p-3 rounded-xl border border-white/5 leading-relaxed">
                                            <strong className="text-cyan-400 block mb-0.5">Explanation:</strong> {item.explanation}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>

                        <button onClick={onClose} className="w-full bg-white text-slate-950 font-black py-3 rounded-xl hover:bg-slate-200 transition shadow-lg text-sm uppercase tracking-wider">
                            Return to Lecture Studio
                        </button>
                    </div>
                ) : (
                    /* Core Question Selection Container View */
                    <div className="p-6 flex-1 space-y-5">
                        <div className="bg-black/30 border border-white/5 rounded-2xl p-5">
                            <h4 className="text-sm font-bold text-slate-200 leading-relaxed">
                                {currentQuestion.questionText}
                            </h4>
                        </div>

                        {/* Multiple Choice Layout Array Option Matrix */}
                        <div className="grid grid-cols-1 gap-2.5">
                            {currentQuestion.options.map((option, idx) => {
                                let optionStyle = "border-white/5 bg-black/10 hover:bg-white/5 text-slate-300";
                                
                                if (!isSubmitted && selectedOption === idx) {
                                    optionStyle = "border-cyan-500/50 bg-cyan-500/10 text-cyan-200 font-bold ring-1 ring-cyan-500/20";
                                } else if (isSubmitted) {
                                    if (idx === currentQuestion.correctOptionIndex) {
                                        optionStyle = "border-emerald-500/50 bg-emerald-500/10 text-emerald-300 font-bold";
                                    } else if (selectedOption === idx && idx !== currentQuestion.correctOptionIndex) {
                                        optionStyle = "border-rose-500/50 bg-rose-500/10 text-rose-300";
                                    }
                                }

                                return (
                                    <button
                                        key={idx}
                                        onClick={() => handleOptionClick(idx)}
                                        disabled={isSubmitted}
                                        className={`w-full text-left px-4 py-3 rounded-xl border text-xs transition-all duration-200 flex items-center gap-3 ${optionStyle}`}
                                    >
                                        <span className={`h-5 w-5 rounded-lg flex items-center justify-center text-[10px] font-black shrink-0 ${
                                            selectedOption === idx ? 'bg-cyan-400 text-slate-950' : 'bg-white/5 text-slate-500'
                                        }`}>
                                            {String.fromCharCode(65 + idx)}
                                        </span>
                                        <span>{option}</span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Footer Controls Operation Layout Bar */}
                        <div className="border-t border-white/5 pt-4 flex justify-end">
                            {!isSubmitted ? (
                                <button
                                    onClick={handleVerifyAnswer}
                                    disabled={selectedOption === null}
                                    className={`px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider shadow-md transition ${
                                        selectedOption === null 
                                            ? 'bg-white/5 text-slate-600 cursor-not-allowed' 
                                            : 'bg-white text-slate-950 hover:bg-slate-200'
                                    }`}
                                >
                                    Verify Answer
                                </button>
                            ) : (
                                <div className="w-full space-y-4">
                                    {currentQuestion.explanation && (
                                        <div className="p-4 bg-purple-500/5 border border-purple-500/10 rounded-xl text-[11px] text-slate-400 leading-relaxed">
                                            <strong className="text-purple-400 block mb-0.5">💡 Concept Insight:</strong>
                                            {currentQuestion.explanation}
                                        </div>
                                    )}
                                    <div className="flex justify-end">
                                        <button onClick={handleNext} className="bg-cyan-400 hover:bg-cyan-500 text-slate-950 px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition shadow-md">
                                            {currentQuestionIdx + 1 === quizData.questions.length ? 'Compile Results' : 'Next Question ➜'}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default QuizPlayer;