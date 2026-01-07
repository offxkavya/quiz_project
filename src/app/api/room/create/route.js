import dbConnect from "@/lib/db";
import Room from "@/models/Room";
import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

export async function POST(req) {
    try {
        const user = verifyToken(req);
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { quizId, maxParticipants, roomType, password } = await req.json();

        if (!quizId) {
            return NextResponse.json(
                { error: "QuizId is required" },
                { status: 400 }
            );
        }

        await dbConnect();

        const newRoom = await Room.create({
            quizId,
            host: user.userId,
            maxParticipants: maxParticipants || 10,
            roomType: roomType || "open",
            password: roomType === "locked" ? password : null,
            currentParticipants: [user.userId], // Host is the first participant
        });

        return NextResponse.json(
            { message: "Room created successfully", room: newRoom },
            { status: 201 }
        );
    } catch (error) {
        console.error("Room Creation Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
