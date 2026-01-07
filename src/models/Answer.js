import mongoose from 'mongoose';

const AnswerSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    quizId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quiz',
        required: true,
    },
    questionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
        required: true,
    },
    selectedOption: {
        type: String,
        required: true,
    },
}, { timestamps: true });

// Ensure unique index for (userId + quizId + questionId) to allow upserting/overwriting answers
AnswerSchema.index({ userId: 1, quizId: 1, questionId: 1 }, { unique: true });

export default mongoose.models.Answer || mongoose.model('Answer', AnswerSchema);
