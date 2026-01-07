import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

const GROQ_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";

export async function POST(req) {
    try {
        const user = verifyToken(req);
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { topic, difficulty, numQuestions } = await req.json();

        if (!topic || !difficulty || !numQuestions) {
            return NextResponse.json(
                { error: "Topic, difficulty, and number of questions are required" },
                { status: 400 }
            );
        }

        const prompt = `Generate ${numQuestions} multiple-choice questions about "${topic}" at a ${difficulty} difficulty level.
        Return a JSON object with a key "questions" containing an array of objects.
        Each question object must have:
        - "questionText": The question string
        - "options": An array of exactly 4 strings
        - "correctAnswer": The string from the options array that is correct.

        Example format:
        {
          "questions": [
            {
              "questionText": "What is the capital of France?",
              "options": ["London", "Berlin", "Paris", "Madrid"],
              "correctAnswer": "Paris"
            }
          ]
        }`;

        console.log(`Generating ${numQuestions} ${difficulty} questions using Groq for topic: ${topic}`);

        const response = await fetch(GROQ_ENDPOINT, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [
                    {
                        role: "system",
                        content: "You are a quiz generation assistant that returns ONLY a valid JSON object. The object must contain a 'questions' key with an array of question objects."
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                response_format: { type: "json_object" },
                temperature: 0.7,
                max_tokens: 3000 // Ensure enough space for 10+ questions
            })
        });

        if (!response.ok) {
            const errorData = await response.text();
            console.error("Groq API Error:", errorData);
            throw new Error(`Groq API returned an error: ${response.statusText}`);
        }

        const data = await response.json();
        const content = data.choices[0].message.content;

        console.log("Raw Groq Response:", content);

        try {
            const parsed = JSON.parse(content);
            const questions = parsed.questions || (Array.isArray(parsed) ? parsed : []);

            if (!Array.isArray(questions) || questions.length === 0) {
                throw new Error("Invalid format: Expected a non-empty array of questions");
            }

            return NextResponse.json({ questions }, { status: 200 });
        } catch (parseError) {
            console.error("JSON Parse Error:", parseError, "Content:", content);
            return NextResponse.json(
                { error: "AI returned invalid format. Please try again." },
                { status: 500 }
            );
        }
    } catch (error) {
        console.error("AI Generation Error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to generate questions. Please try again." },
            { status: 500 }
        );
    }
}
