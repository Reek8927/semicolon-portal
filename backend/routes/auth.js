import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { verifyAdmin } from '../middleware/verifyAdmin.js';
import bcrypt from 'bcrypt'; // Safely imported for hash evaluations

const router = express.Router();

// 💡 CONFIGURATION TOGGLE FLAG:
// Set this to true if your database stores hashed/encrypted passwords!
// Set this to false if your database stores normal plain-text passwords.
const USE_BCRYPT = false; 

// 1. STUDENT REGISTRATION (POST http://localhost:5000/api/auth/register)
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'This email is already registered.' });
        }

        // Process password parameters based on configuration flag
        let finalPassword = password;
        if (USE_BCRYPT) {
            const salt = await bcrypt.genSalt(10);
            finalPassword = await bcrypt.hash(password, salt);
        }

        const newUser = new User({
            name,
            email,
            password: finalPassword,
            role: 'student',
            xp: 0,
            isApproved: false,
            batchTag: 'Pending'
        });

        await newUser.save();
        res.status(201).json({ message: 'Registration staged! Awaiting administrator evaluation clearance.' });
    } catch (error) {
        res.status(500).json({ message: 'Registration structural processing failure.', error: error.message });
    }
});

// 2. STUDENT/ADMIN SECURE LOGIN (POST http://localhost:5000/api/auth/login)
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials key parameters.' });
        }

        // 🔐 DYNAMIC PASSWORD VERIFICATION CHECK MATCHES BOTH STYLES
        let isMatch = false;
        if (USE_BCRYPT) {
            isMatch = await bcrypt.compare(password, user.password);
        } else {
            isMatch = (user.password === password);
        }

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid password signature configuration.' });
        }

        // Build token security contexts
        const tokenPayload = {
            id: user._id,
            role: user.role
        };

        const token = jwt.sign(
            tokenPayload, 
            process.env.JWT_SECRET || 'fallback_semicolon_key_hash', 
            { expiresIn: '1d' }
        );

        // Explicitly pass fresh fields back to the browser application runtime storage cache
        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isApproved: user.isApproved, 
                batchTag: user.batchTag,       
                xp: user.xp
            }
        });

    } catch (error) {
        res.status(500).json({ message: 'Core server authentication validation failure.', error: error.message });
    }
});

// 3. ADMIN READ: GET PENDING WAITING ROOM ROSTER (GET http://localhost:5000/api/auth/pending) - Secured
router.get('/pending', verifyAdmin, async (req, res) => {
    try {
        const pendingStudents = await User.find({ isApproved: false, role: 'student' }).select('-password');
        res.json(pendingStudents);
    } catch (error) {
        res.status(500).json({ message: 'Failed to extract pending roster maps.', error: error.message });
    }
});

// 4. ADMIN EXECUTION: ADMIT STUDENT & UPDATE BATCH TARGETS (POST http://localhost:5000/api/auth/approve) - Secured
router.post('/approve', verifyAdmin, async (req, res) => {
    try {
        const { studentId, allocatedBatch } = req.body;

        if (!studentId || !allocatedBatch) {
            return res.status(400).json({ message: 'Missing student identifier or batch target metrics payload.' });
        }

        const approvedUser = await User.findByIdAndUpdate(
            studentId,
            { isApproved: true, batchTag: allocatedBatch },
            { new: true }
        ).select('-password');

        res.json({ 
            message: `Admissions status authorized! ${approvedUser.name} routed into ${allocatedBatch}.`, 
            student: approvedUser 
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to write validation parameters down to users document.', error: error.message });
    }
});

export default router;