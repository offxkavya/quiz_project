import dbConnect from "@/lib/db";
import Room from "@/models/Room";
import User from "@/models/User";
import Quiz from "@/models/Quiz";
import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const topic = searchParams.get("topic");

        await dbConnect();

        let query = { isActive: true };

        if (topic) {
            const quizzes = await Quiz.find({ topic: { $regex: topic, $options: "i" } }).select("_id");
            const quizIds = quizzes.map((q) => q._id);
            query.quizId = { $in: quizIds };
        }

        const rooms = await Room.find(query)
            .populate("quizId", "title topic difficulty")
            .populate("host", "username")
            .sort({ createdAt: -1 });

        return NextResponse.json({ rooms }, { status: 200 });
    } catch (error) {
        console.error("Room Search Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
