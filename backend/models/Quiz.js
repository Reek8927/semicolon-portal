import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
    questionText: { type: String, required: true },
    options: [{ type: String, required: true }], // Array of 4 choices
    correctOptionIndex: { type: Number, required: true }, // 0 for A, 1 for B, 2 for C, 3 for D
    explanation: { type: String, default: '' } // Why this answer is correct
});

const quizSchema = new mongoose.Schema({
    batchTag: { type: String, required: true }, // e.g., 'Class-12-CA'
    lectureId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lecture', required: true }, // Connects this quiz to a specific video class
    quizTitle: { type: String, required: true },
    questions: [questionSchema], // Array of multiple questions inside this DPP quiz
    createdAt: { type: Date, default: Date.now }
});

const Quiz = mongoose.model('Quiz', quizSchema);
export default Quiz;