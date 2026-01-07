import dbConnect from "@/lib/db";
import Answer from "@/models/Answer";
import Question from "@/models/Question";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const quizId = searchParams.get("quizId");

        if (!quizId) {
            return NextResponse.json({ error: "QuizId is required" }, { status: 400 });
        }

        await dbConnect();

        // Get all questions for this quiz to know correct answers
        const questions = await Question.find({ quizId });
        const correctAnswersMap = {};
        questions.forEach((q) => {
            correctAnswersMap[q._id.toString()] = q.correctAnswer;
        });

        // Get all answers for this quiz
        const answers = await Answer.find({ quizId }).populate("userId", "username");

        // Calculate scores
        const userScores = {};

        answers.forEach((ans) => {
            const uId = ans.userId._id.toString();
            const uName = ans.userId.username;

            if (!userScores[uId]) {
                userScores[uId] = { username: uName, score: 0 };
            }

            if (ans.selectedOption === correctAnswersMap[ans.questionId.toString()]) {
                userScores[uId].score += 1;
            }
        });

        // Convert to array and sort
        const leaderboard = Object.values(userScores).sort((a, b) => b.score - a.score);

        return NextResponse.json({ leaderboard }, { status: 200 });
    } catch (error) {
        console.error("Leaderboard Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
