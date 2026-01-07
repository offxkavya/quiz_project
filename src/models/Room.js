import mongoose from 'mongoose';

const RoomSchema = new mongoose.Schema({
    quizId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quiz',
        required: true,
    },
    host: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    maxParticipants: {
        type: Number,
        required: true,
        default: 10,
    },
    currentParticipants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    roomType: {
        type: String,
        enum: ['open', 'locked'],
        default: 'open',
    },
    password: {
        type: String, // only for locked rooms
    },
    isActive: {
        type: Boolean,
        default: true,
    }
}, { timestamps: true });

export default mongoose.models.Room || mongoose.model('Room', RoomSchema);
