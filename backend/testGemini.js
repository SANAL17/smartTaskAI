
require("dotenv").config();

async function testGemini() {
    try {
        const { GoogleGenAI } = await import("@google/genai");

        const ai = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY,
        });

        const response = await ai.models.generateContent({
            model: "gemini-3.8-flash",
            contents: "Reply with only the word OK.",
        });

        console.log("Gemini response:", response.text);

    } catch (error) {
        console.log("Gemini status:", error.status);
        console.log("Gemini error:", error.message);
    }
}

testGemini();
