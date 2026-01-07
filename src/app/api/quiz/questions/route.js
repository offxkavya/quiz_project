import dbConnect from "@/lib/db";
import Question from "@/models/Question";
import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const quizId = searchParams.get("quizId");

        if (!quizId) {
            return NextResponse.json({ error: "QuizId is required" }, { status: 400 });
        }

        await dbConnect();

        const questions = await Question.find({ quizId });

        return NextResponse.json({ questions }, { status: 200 });
    } catch (error) {
        console.error("Fetch Questions Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
