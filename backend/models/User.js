import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide your full name'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Please provide an email address'],
        unique: true, // Prevents two accounts from using the same email
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, 'Please provide a secure password'],
        minlength: [6, 'Password must be at least 6 characters long']
    },
    role: {
        type: String,
        enum: ['student', 'admin'], // Only allows these two roles
        default: 'student' // Anyone who signs up defaults to a student
    },
    enrolledBatches: [{
        type: String, // Storing batch names or tags like ['Class-11-CA', 'Class-12-CA']
        default: []
    }],

    xp: {type: Number, default: 0}, // Experience points for gamification

    isApproved: { type: Boolean, default: false }, // 🚨 Defaults to false for new students!
    batchTag: { type: String, default: 'Pending' }, // 🚨 Stays as 'Pending' until admin allocates a batch
    
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Create the operational model from our schema blueprint
const User = mongoose.model('User', userSchema);
export default User;