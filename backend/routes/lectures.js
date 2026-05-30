import express from 'express';
import Lecture from '../models/Lecture.js';
import { verifyAdmin } from '../middleware/verifyAdmin.js';

const router = express.Router();

// 1. UPLOAD A NEW LECTURE (POST http://localhost:5000/api/lectures/upload)
// This is the action your Admin Panel will take when you paste a new video link
router.post('/upload', verifyAdmin, async (req, res) => {
    try {
        const { batchTag, chapterName, topicTitle, youtubeVideoId, notesUrl, dppUrl } = req.body;

        // Ensure essential fields aren't blank
        if (!batchTag || !chapterName || !topicTitle || !youtubeVideoId) {
            return res.status(400).json({ message: 'Please fill in all mandatory fields (Batch, Chapter, Topic, Video ID).' });
        }

        const newLecture = new Lecture({
            batchTag,
            chapterName,
            topicTitle,
            youtubeVideoId,
            notesUrl,
            dppUrl
        });

        await newLecture.save();
        res.status(201).json({ message: 'Lecture and study materials added successfully! 🎉', lecture: newLecture });

    } catch (error) {
        res.status(500).json({ message: 'Failed to upload lecture.', error: error.message });
    }
});

// 2. FETCH LECTURES FOR A SPECIFIC BATCH (GET http://localhost:5000/api/lectures/batch/:batchTag)
// This fetches the exact content organized by chapter when a student opens their dashboard
router.get('/batch/:batchTag', async (req, res) => {
    try {
        const { batchTag } = req.params;
        
        // Find all lectures matching the requested class/batch tag, sorted newest first
        const lectures = await Lecture.find({ batchTag }).sort({ createdAt: 1 });
        
        res.json(lectures);
    } catch (error) {
        res.status(500).json({ message: 'Failed to load batch lectures.', error: error.message });
    }
});

export default router;