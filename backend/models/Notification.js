import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
    batchTag: { type: String, required: true }, // e.g., 'Class-12-CA' or 'All'
    title: { type: String, required: true },    // e.g., 'New Assignment Dropped! 🎯'
    message: { type: String, required: true },  // e.g., 'DPP 03 for Logic Gates is now live.'
    createdAt: { type: Date, default: Date.now }
});

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;