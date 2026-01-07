import mongoose from 'mongoose';

const QuestionSchema = new mongoose.Schema({
    quizId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quiz',
        required: true,
    },
    questionText: {
        type: String,
        required: [true, 'Please provide question text'],
    },
    options: {
        type: [String],
        validate: [v => v.length === 4, 'There must be exactly 4 options'],
    },
    correctAnswer: {
        type: String,
        required: [true, 'Please provide correct answer'],
    },
}, { timestamps: true });

export default mongoose.models.Question || mongoose.model('Question', QuestionSchema);
