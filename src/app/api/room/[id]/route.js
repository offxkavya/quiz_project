import dbConnect from "@/lib/db";
import Room from "@/models/Room";
import Quiz from "@/models/Quiz";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
    try {
        const { id } = params;
        await dbConnect();

        const room = await Room.findById(id)
            .populate("quizId")
            .populate("host", "username");

        if (!room) {
            return NextResponse.json({ error: "Room not found" }, { status: 404 });
        }

        return NextResponse.json({ room }, { status: 200 });
    } catch (error) {
        console.error("Fetch Room Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
