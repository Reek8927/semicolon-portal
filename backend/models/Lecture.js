import mongoose from 'mongoose';

const lectureSchema = new mongoose.Schema({
    batchTag: {
        type: String,
        required: [true, 'Every lecture must belong to a specific batch (e.g., Class-12-CA)'],
        trim: true
    },
    chapterName: {
        type: String,
        required: [true, 'Please specify the Chapter name'],
        trim: true
    },
    topicTitle: {
        type: String,
        required: [true, 'Please specify the specific Topic title'],
        trim: true
    },
    youtubeVideoId: {
        type: String,
        required: [true, 'Please provide the 11-character YouTube Video ID'],
        trim: true
    },
    notesUrl: {
        type: String, // A web link to your PDF notes stored in the cloud
        default: ''
    },
    dppUrl: {
        type: String, // A web link to your DPP PDF question sheet
        default: ''
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Lecture = mongoose.model('Lecture', lectureSchema);
export default Lecture;