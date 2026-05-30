import React, { useState, useEffect } from 'react';

function Fees() {
    const user = JSON.parse(localStorage.getItem('user')) || null;
    const [history, setHistory] = useState([]);
    const [targetMonth, setTargetMonth] = useState('June 2026');
    const [processing, setProcessing] = useState(false);
    const [message, setMessage] = useState('');
    const [uiError, setUiError] = useState('');

    const tuitionAmount = 212; // Invoice Amount Rate Metric (INR)

    const fetchPaymentHistory = () => {
        if (!user) return;
        const studentId = user.id || user._id;
        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/payments/history/${studentId}`)
            .then(res => res.ok ? res.json() : [])
            .then(data => setHistory(data))
            .catch(err => console.error("History logging pipeline dropped:", err));
    };

    useEffect(() => { fetchPaymentHistory(); }, []);

    const handlePayFees = async () => {
        setProcessing(true);
        setMessage('');
        setUiError('');

        try {
            // STEP 1: Query the backend order compilation station
            const orderResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/payments/order`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amountInINR: tuitionAmount })
            });
            const orderData = await orderResponse.json();

            if (!orderData.success) {
                throw new Error(orderData.message || 'Order structural definition failure.');
            }

            // STEP 2: Configure Checkout options map arrays
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Loaded safely via Vite runtime vars environment prefix
                amount: orderData.amount,
                currency: orderData.currency,
                name: "; Semicolon Coaching Center",
                description: `Monthly Tuition Fees for ${targetMonth}`,
                order_id: orderData.order_id,
                
                handler: async function (response) {
                    // STEP 3: Dispatch completed validation packets back down to verification routes
                    try {
                        const verifyRes = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/payments/verify`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                                userId: user.id || user._id,
                                studentName: user.name,
                                feeMonth: targetMonth,
                                amount: tuitionAmount
                            })
                        });

                        const verifyData = await verifyRes.json();
                        if (verifyData.success) {
                            setMessage(`Tuition fee recorded and cleared for ${targetMonth}! 💳✨`);
                            fetchPaymentHistory();
                        } else {
                            setUiError(`Audit mismatch: ${verifyData.message}`);
                        }
                    } catch (err) {
                        setUiError('Signature verification channel interrupted.');
                    }
                    setProcessing(false);
                },
                prefill: {
                    name: user?.name,
                    email: user?.email
                },
                theme: { color: "#06b6d4" },
                modal: {
                    // Handle interface dismiss cancels cleanly
                    ondismiss: function () {
                        setProcessing(false);
                        setUiError('Transaction window closed by customer.');
                    }
                }
            };

            const rzpWindow = new window.Razorpay(options);
            
            // Handle terminal connection failures natively
            rzpWindow.on('payment.failed', function (response) {
                setUiError(`Transaction rejected: ${response.error.description}`);
                setProcessing(false);
            });

            rzpWindow.open();

        } catch (err) {
            setUiError(err.message);
            setProcessing(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 pb-16 grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
            <div className="md:col-span-1 bg-[#161b26]/60 backdrop-blur-md border border-white/5 p-6 rounded-3xl h-fit space-y-5 shadow-2xl">
                <h3 className="font-black text-white text-base uppercase tracking-wider flex items-center gap-2">Tuition Desk</h3>
                {message && <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs text-center">{message}</div>}
                {uiError && <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-xs text-center">{uiError}</div>}
                <div className="space-y-3">
                    <select value={targetMonth} onChange={(e) => setTargetMonth(e.target.value)} className="w-full p-3 bg-black/30 border border-white/5 rounded-xl text-xs text-slate-300 focus:outline-none">
                        <option value="June 2026">June 2026</option>
                        <option value="July 2026">July 2026</option>
                    </select>
                    <div className="p-4 bg-black/40 rounded-xl border border-white/5 flex justify-between items-center">
                        <span className="text-xs text-slate-400 font-bold">Monthly Rate</span>
                        <span className="text-lg font-black text-white">₹{tuitionAmount}</span>
                    </div>
                    <button onClick={handlePayFees} disabled={processing} className="w-full bg-cyan-400 hover:bg-cyan-500 text-slate-950 font-black py-3 rounded-xl text-xs uppercase tracking-widest cursor-pointer disabled:opacity-40">
                        {processing ? 'Processing Order...' : `Secure Pay ₹${tuitionAmount}`}
                    </button>
                </div>
            </div>
            
            <div className="md:col-span-2 bg-[#161b26]/60 backdrop-blur-md border border-white/5 p-6 rounded-3xl shadow-2xl space-y-4">
                <h3 className="font-black text-white text-base uppercase tracking-wider border-b border-white/5 pb-3">📜 Receipt History Logs</h3>
                <div className="space-y-2.5 max-h-[60vh] overflow-y-auto">
                    {history.map((receipt) => (
                        <div key={receipt._id} className="flex justify-between items-center p-4 bg-black/20 border border-white/5 rounded-2xl text-xs">
                            <div>
                                <span className="font-bold text-white text-sm">{receipt.feeMonth}</span>
                                <p className="text-[10px] text-slate-500 font-mono">Ref ID: {receipt.transactionId}</p>
                            </div>
                            <span className="text-emerald-400 font-black text-base">₹{receipt.amount}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Fees;