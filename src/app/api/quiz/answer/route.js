import dbConnect from "@/lib/db";
import Answer from "@/models/Answer";
import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

export async function POST(req) {
    try {
        const user = verifyToken(req);
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { quizId, questionId, selectedOption } = await req.json();

        if (!quizId || !questionId || !selectedOption) {
            return NextResponse.json(
                { error: "QuizId, QuestionId, and SelectedOption are required" },
                { status: 400 }
            );
        }

        await dbConnect();

        // Use findOneAndUpdate with upsert to overwrite answers
        // Users can change answers multiple times, only the last one is kept.
        const answer = await Answer.findOneAndUpdate(
            { userId: user.userId, quizId, questionId },
            { selectedOption },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        return NextResponse.json(
            { message: "Answer submitted successfully", answer },
            { status: 200 }
        );
    } catch (error) {
        console.error("Answer Submission Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
