import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// 1. UPDATE STUDENT SCORE (POST http://localhost:5000/api/leaderboard/add-score)
router.post('/add-score', async (req, res) => {
    try {
        const { userId, pointsEarned } = req.body;

        if (!userId) return res.status(400).json({ message: 'User ID is required.' });

        // Find user and increment their XP safely in the database
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $inc: { xp: pointsEarned } },
            { new: true }
        );

        res.json({ message: 'XP synchronized successfully! 🚀', currentXp: updatedUser.xp });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update score.', error: error.message });
    }
});

// 2. FETCH TOP LEADERS (GET http://localhost:5000/api/leaderboard/top)
router.get('/top', async (req, res) => {
    try {
        // Fetch only students, sorted by XP highest first, limiting to top 10 profiles
        const leaders = await User.find({ role: 'student' })
            .sort({ xp: -1 })
            .limit(10)
            .select('name xp'); // Only return public display fields

        res.json(leaders);
    } catch (error) {
        res.status(500).json({ message: 'Failed to load leaderboard.', error: error.message });
    }
});

export default router;