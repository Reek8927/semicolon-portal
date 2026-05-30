import express from 'express';
import Quiz from '../models/Quiz.js';

const router = express.Router();

// 1. CREATE/UPLOAD A NEW DPP QUIZ (POST http://localhost:5000/api/quizzes/create)
router.post('/create', async (req, res) => {
    try {
        const { batchTag, lectureId, quizTitle, questions } = req.body;

        const newQuiz = new Quiz({
            batchTag,
            lectureId,
            quizTitle,
            questions
        });

        await newQuiz.save();
        res.status(201).json({ message: 'Interactive DPP Quiz created successfully! 🎯', quiz: newQuiz });
    } catch (error) {
        res.status(500).json({ message: 'Failed to create quiz.', error: error.message });
    }
});

// 2. FETCH QUIZ FOR A SPECIFIC LECTURE (GET http://localhost:5000/api/quizzes/lecture/:lectureId)
router.get('/lecture/:lectureId', async (req, res) => {
    try {
        const { lectureId } = req.params;
        const quiz = await Quiz.findOne({ lectureId });
        
        if (!quiz) {
            return res.status(404).json({ message: 'No interactive quiz found for this lecture.' });
        }
        res.json(quiz);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching quiz data.', error: error.message });
    }
});

export default router;