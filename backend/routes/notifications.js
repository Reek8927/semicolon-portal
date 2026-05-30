import express from 'express';
import Notification from '../models/Notification.js';
import { verifyAdmin } from '../middleware/verifyAdmin.js';

const router = express.Router();

// 1. PUSH A NEW NOTIFICATION (POST http://localhost:5000/api/notifications/create) - Secured for Admins
router.post('/create', verifyAdmin, async (req, res) => {
    try {
        const { batchTag, title, message } = req.body;

        const newNotification = new Notification({ batchTag, title, message });
        await newNotification.save();

        res.status(201).json({ message: 'Notification broadcasted live! 🔔', notification: newNotification });
    } catch (error) {
        res.status(500).json({ message: 'Failed to create notification.', error: error.message });
    }
});

// 2. FETCH ALERTS FOR A SPECIFIC BATCH (GET http://localhost:5000/api/notifications/batch/:batchTag)
router.get('/batch/:batchTag', async (req, res) => {
    try {
        const { batchTag } = req.params;
        // Fetch notifications matching their specific batch or global broadcast announcements
        const alerts = await Notification.find({ batchTag: { $in: [batchTag, 'All'] } })
            .sort({ createdAt: -1 })
            .limit(10);
            
        res.json(alerts);
    } catch (error) {
        res.status(500).json({ message: 'Error pulling notifications.', error: error.message });
    }
});

export default router;