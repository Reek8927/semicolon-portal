import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Lecture from './models/Lecture.js';
import Quiz from './models/Quiz.js'; // Import our new Quiz blueprint

dotenv.config();

const sampleLectures = [
    {
        batchTag: "Class-12-CA",
        chapterName: "Chapter 1: HTML Forms",
        topicTitle: "Introduction to Form Tags & Input Elements",
        youtubeVideoId: "kJQP7kiw5Fk",
        notesUrl: "https://www.w3.org/WAI/tutorials/forms/custom-controls/resources/forms-tutorial.pdf"
    },
    {
        batchTag: "Class-12-CA",
        chapterName: "Chapter 1: HTML Forms",
        topicTitle: "Advanced Form Validations and Radio Buttons",
        youtubeVideoId: "916GWv2gcx8",
        notesUrl: "https://www.w3.org/WAI/tutorials/forms/custom-controls/resources/forms-tutorial.pdf"
    },
    {
        batchTag: "Class-12-CA",
        chapterName: "Chapter 2: Networking",
        topicTitle: "Introduction to LAN, MAN, and WAN Architectures",
        youtubeVideoId: "JFF2vJaN0Cw",
        notesUrl: "https://www.w3.org/WAI/tutorials/forms/custom-controls/resources/forms-tutorial.pdf"
    }
];

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to cloud database for population... 🔌");

        // 1. Flush out any old documents
        await Lecture.deleteMany();
        await Quiz.deleteMany();
        console.log("Old catalog flushed clean. 🧹");

        // 2. Insert the fresh lecture list records
        const createdLectures = await Lecture.insertMany(sampleLectures);
        console.log("Curriculum catalog populated successfully! 🎓");

        // 3. Find our target first HTML Forms lecture to anchor our quiz to
        const htmlFormLecture = createdLectures.find(lec => lec.topicTitle.includes("Introduction to Form Tags"));

        if (htmlFormLecture) {
            const htmlFormsQuiz = {
                batchTag: "Class-12-CA",
                lectureId: htmlFormLecture._id, // Linking it securely using our database reference
                quizTitle: "DPP 01: HTML Forms & Input Elements",
                questions: [
                    {
                        questionText: "Which HTML tag is used as the main container to create a user input form on a webpage?",
                        options: ["<input>", "<form>", "<fieldset>", "<action>"],
                        correctOptionIndex: 1, // <form> is index 1
                        explanation: "The <form> tag defines the boundaries of an interactive form and contains all input elements like text fields, checkboxes, and submit buttons."
                    },
                    {
                        questionText: "Which attribute of the form tag specifies the URL or backend endpoint where the form data should be submitted?",
                        options: ["method", "target", "name", "action"],
                        correctOptionIndex: 3, // action is index 3
                        explanation: "The action attribute holds the file path or URL endpoint of the server script that processes the submitted form data."
                    },
                    {
                        questionText: "To allow a student to type their full name in a single line, which 'type' attribute value should be used with the <input> tag?",
                        options: ["type=\"password\"", "type=\"text\"", "type=\"submit\"", "type=\"textarea\""],
                        correctOptionIndex: 1, // type="text" is index 1
                        explanation: "The text value creates a standard, single-line input field ideal for capturing strings like names, titles, or short answers."
                    },
                    {
                        questionText: "When a student needs to select exactly one option out of multiple choices (like selecting streams), which input control is best suited?",
                        options: ["type=\"checkbox\"", "type=\"button\"", "type=\"radio\"", "type=\"file\""],
                        correctOptionIndex: 2, // type="radio" is index 2
                        explanation: "Radio buttons are designed for mutually exclusive selections where picking one automatically deselects the others in the same group."
                    },
                    {
                        questionText: "Which form submission method appends the user's data directly to the URL address bar, making it visible and less secure?",
                        options: ["POST", "PUT", "GET", "RESET"],
                        correctOptionIndex: 2, // GET is index 2
                        explanation: "The GET method packages form data into key-value pairs directly inside the browser URL string, making it visible in history and bookmarks."
                    }
                ]
            };

            await Quiz.create(htmlFormsQuiz);
            console.log("Interactive DPP Quiz linked to HTML Lesson 1 successfully! 🎯🎉");
        }

        mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error("Failed to load data details:", error);
        process.exit(1);
    }
};

seedDatabase();