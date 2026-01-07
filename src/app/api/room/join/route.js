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

        const { roomId, password } = await req.json();

        if (!roomId) {
            return NextResponse.json({ error: "RoomId is required" }, { status: 400 });
        }

        await dbConnect();

        const room = await Room.findById(roomId);

        if (!room) {
            return NextResponse.json({ error: "Room not found" }, { status: 404 });
        }

        if (!room.isActive) {
            return NextResponse.json({ error: "Room is not active" }, { status: 400 });
        }

        if (room.currentParticipants.length >= room.maxParticipants) {
            return NextResponse.json({ error: "Room is full" }, { status: 400 });
        }

        if (room.roomType === "locked") {
            if (room.password !== password) {
                return NextResponse.json({ error: "Invalid room password" }, { status: 401 });
            }
        }

        // Check if user is already in the room
        if (room.currentParticipants.includes(user.userId)) {
            return NextResponse.json({ message: "Already in room", room }, { status: 200 });
        }

        room.currentParticipants.push(user.userId);
        await room.save();

        return NextResponse.json({ message: "Joined room successfully", room }, { status: 200 });
    } catch (error) {
        console.error("Room Join Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
