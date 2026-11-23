
const generateTask = async (req, res) => {
    try {
        const { prompt } = req.body;

        if (!prompt || !prompt.trim()) {
            return res.status(400).json({
                message: "Please provide a task description",
            });
        }

        const { GoogleGenAI } = await import("@google/genai");

        const ai = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY,
        });

        const response = await ai.models.generateContent({
            model: "gemini-3.1-flash-lite",

            contents: `
                Generate a task based on this request: ${prompt}

                Return:
                - Task title
                - Description
                - Priority
                - Suggested due date
                - Subtasks

                If no due date is mentioned, return an empty string.
                Priority must be Low, Medium, or High.
            `,

            config: {
                responseMimeType: "application/json",

                responseSchema: {
                    type: "OBJECT",
                    properties: {
                        title: {
                            type: "STRING",
                        },
                        description: {
                            type: "STRING",
                        },
                        priority: {
                            type: "STRING",
                            enum: ["Low", "Medium", "High"],
                        },
                        dueDate: {
                            type: "STRING",
                        },
                        subtasks: {
                            type: "ARRAY",
                            items: {
                                type: "STRING",
                            },
                        },
                    },
                    required: [
                        "title",
                        "description",
                        "priority",
                        "dueDate",
                        "subtasks",
                    ],
                },
            },
        });

        const result = JSON.parse(response.text);

        return res.status(200).json({
            message: "AI task generated successfully",
            result,
        });

    } catch (error) {
        console.error("AI Error:", error);

        return res.status(500).json({
            message: "Failed to generate AI task",
            error: error.message,
        });
    }
};

module.exports = { generateTask };
