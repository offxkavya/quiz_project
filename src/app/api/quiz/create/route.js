import dbConnect from "@/lib/db";
import Quiz from "@/models/Quiz";
import Question from "@/models/Question";
import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

export async function POST(req) {
    try {
        const user = verifyToken(req);
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { title, topic, difficulty, duration, questions } = await req.json();
        console.log("Creating Quiz:", { title, topic, numQuestions: questions?.length });

        if (!title || !topic || !difficulty || !duration || !questions || !questions.length) {
            return NextResponse.json(
                { error: "All fields are required and questions must be provided" },
                { status: 400 }
            );
        }

        await dbConnect();

        // Create Quiz
        const newQuiz = await Quiz.create({
            title,
            topic,
            difficulty,
            duration,
            createdBy: user.userId,
        });

        // Create Questions linked to Quiz
        const questionData = questions.map((q) => ({
            ...q,
            quizId: newQuiz._id,
        }));

        await Question.insertMany(questionData);

        return NextResponse.json(
            { message: "Quiz created successfully", quizId: newQuiz._id },
            { status: 201 }
        );
    } catch (error) {
        console.error("Quiz Creation Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
