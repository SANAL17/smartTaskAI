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
      model: "gemini-3.5-flash-lite",

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
          required: ["title", "description", "priority", "dueDate", "subtasks"],
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



const chatWithAI = async (req, res) => {
    try {
        const { prompt, history = [] } = req.body;

        if (!prompt || !prompt.trim()) {
            return res.status(400).json({
                message: "Please enter a message",
            });
        }

        // Initialize Groq
        const { default: Groq } = await import("groq-sdk");

        const groq = new Groq({
            apiKey: process.env.GROQ_API_KEY,
        });

        // Convert frontend history into Groq message format
        const conversationHistory = Array.isArray(history)
            ? history.slice(-20).map((item) => ({
                role: item.role === "model" ? "assistant" : "user",
                content: item.text,
            }))
            : [];

        const completion = await groq.chat.completions.create({
            model: "openai/gpt-oss-120b",

            messages: [
                {
                    role: "system",
                    content: `
                        You are SmartTask AI, a helpful productivity assistant.

                        Help users with:
                        - Task management
                        - Productivity tips
                        - Time management
                        - Planning daily activities
                        - Organizing tasks

                        Keep responses clear, friendly and helpful.
                    `,
                },
                ...conversationHistory,
                {
                    role: "user",
                    content: prompt.trim(),
                },
            ],
        });

        const result =
            completion.choices[0]?.message?.content || "Sorry, I couldn't generate a response.";

        return res.status(200).json({
            message: "AI response generated successfully",
            result,
        });

    } catch (error) {
        console.error("Groq AI Chat Error:", error);

        return res.status(error.status || 500).json({
            message: "Failed to generate AI response",
            error: error.message,
        });
    }
};
module.exports = { generateTask, chatWithAI };