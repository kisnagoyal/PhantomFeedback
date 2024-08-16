// src/app/api/suggest-messages/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

// Ensure you have your API key set in the environment variables
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    console.error("API key is undefined");
    throw new Error("API key is undefined");
}

// Initialize the GoogleGenerativeAI instance
const genAI = new GoogleGenerativeAI(apiKey);

async function run(): Promise<string> {
    try {
        // Configure the model
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
        });

        // Set generation configuration
        const generationConfig = {
            temperature: 1,
            topP: 0.95,
            topK: 64,
            maxOutputTokens: 8192,
            responseMimeType: "text/plain",
        };

        // Start chat session
        const chatSession = await model.startChat({
            generationConfig,
            history: [],
        });

        // Send message to AI and get response
        const result = await chatSession.sendMessage(
            "Create a list of three open-ended and engaging questions formatted as a single string.These questions should not be repeated. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What's a hobby you've recently started?||If you could have dinner with any historical figure, who would it be?||What's a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment."
        );

        // Return the result as a string
        return result.response.text();
    } catch (error) {
        console.error("Error during model interaction:", error);
        throw new Error("Failed to fetch suggestions from AI.");
    }
}

// Handle POST requests
export async function POST(req: NextRequest) {
    try {
        // Fetch suggestions from the AI
        const suggestions = await run();
        // Return the suggestions as a JSON object
        return NextResponse.json({ suggestions });
    } catch (error) {
        console.error('Error generating suggestions:', error);
        // Return error message if something goes wrong
        return NextResponse.json({ message: 'Failed to fetch suggestions' }, { status: 500 });
    }
}
