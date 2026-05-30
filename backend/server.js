import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

// 🚀 CRITICAL FIX: Run dotenv initialization right here, 
// BEFORE importing your custom route files!
dotenv.config();

import authRoutes from './routes/auth.js';
import lectureRoutes from './routes/lectures.js'; 
import quizRoutes from './routes/quizzes.js'; 
import leaderboardRoutes from './routes/leaderboard.js'; 
import notificationRoutes from './routes/notifications.js';
import paymentRoutes from './routes/payments.js'; // Now process.env will be fully loaded when this executes!

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Basic Test Route
app.get('/', (req, res) => {
    res.send('Semicolon Coaching Portal Backend Server is running smoothly!');
});

// Route Connections
app.use('/api/auth', authRoutes);
app.use('/api/lectures', lectureRoutes); 
app.use('/api/quizzes', quizRoutes); 
app.use('/api/leaderboard', leaderboardRoutes); 
app.use('/api/notifications', notificationRoutes);
app.use('/api/payments', paymentRoutes);

// Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Successfully connected to MongoDB Cloud Database. ✅');
        app.listen(PORT, () => {
            console.log(`Server engine is actively running on port: ${PORT} 🚀`);
        });
    })
    .catch((error) => {
        console.error('Database connection error occurred: ❌', error.message);
    });