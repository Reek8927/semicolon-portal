import express from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import Payment from '../models/Payment.js';

const router = express.Router();

// Initialize the isolated SDK instance using explicit environment verification blocks
const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// 1. CREATE SECURE ORDER (POST http://localhost:5000/api/payments/order)
router.post('/order', async (req, res) => {
    try {
        const { amountInINR } = req.body;

        if (!amountInINR) {
            return res.status(400).json({ success: false, message: 'Missing amount input values.' });
        }

        const amountInPaise = Math.round(amountInINR * 100);

        // Edge Case Protection: Enforce Razorpay's lowest possible limit rule constraint
        if (amountInPaise < 100) {
            return res.status(400).json({ success: false, message: 'Minimum transaction amount is 100 paise (₹1).' });
        }

        const options = {
            amount: amountInPaise,
            currency: "INR",
            receipt: `rcpt_invoice_${Date.now().toString().slice(-6)}`
        };

        const order = await razorpayInstance.orders.create(options);
        
        res.status(201).json({
            success: true,
            order_id: order.id,
            amount: order.amount,
            currency: order.currency
        });
    } catch (error) {
        // Handle credential authentication failures explicitly
        if (error.statusCode === 401) {
            return res.status(401).json({ success: false, message: 'Razorpay authentication failed. Check server key rings.' });
        }
        res.status(500).json({ success: false, message: 'Razorpay Order Creation Engine failure.', error: error.message });
    }
});

// 2. CRYPTOGRAPHIC SIGNATURE VERIFICATION (POST http://localhost:5000/api/payments/verify)
router.post('/verify', async (req, res) => {
    try {
        const { 
            razorpay_order_id, 
            razorpay_payment_id, 
            razorpay_signature, 
            userId, 
            studentName, 
            feeMonth, 
            amount 
        } = req.body;

        // Input payload parameter checks
        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({ success: false, message: 'Missing transaction signatures or structural parameters.' });
        }

        // HMAC-SHA256 signature generation procedure
        const payloadText = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(payloadText.toString())
            .digest("hex");

        const signaturesMatch = expectedSignature === razorpay_signature;

        if (!signaturesMatch) {
            return res.status(400).json({ success: false, message: 'Transaction signature verification failed. Secure lock active.' });
        }

        // Write down verified credit to MongoDB
        const authorizedReceipt = new Payment({
            userId,
            studentName,
            amount,
            feeMonth,
            transactionId: razorpay_payment_id,
            status: 'Successful'
        });

        await authorizedReceipt.save();
        res.json({ success: true, message: 'Payment authenticated and cataloged live! 💳✨' });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal processing signature fault.', error: error.message });
    }
});

export default router;