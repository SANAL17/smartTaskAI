
"use client";

import API_URL from "@/lib/api";
import { useState } from "react";
import { Send, X, Sparkles, Bot, User } from "lucide-react";

type Message = {
    role: "user" | "model";
    text: string;
};

type Props = {
    isOpen: boolean;
    onClose: () => void;
};

export default function AIAssistantDrawer({
    isOpen,
    onClose,
}: Props) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [prompt, setPrompt] = useState("");
    const [loading, setLoading] = useState(false);

    const sendMessage = async () => {
        if (!prompt.trim() || loading) return;

        const userMessage: Message = {
            role: "user",
            text: prompt.trim(),
        };

        const updatedMessages = [...messages, userMessage];

        setMessages(updatedMessages);
        setPrompt("");
        setLoading(true);

        try {
            const response = await fetch(`${API_URL}/api/ai/chat`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    prompt: userMessage.text,
                    history: messages,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Something went wrong");
            }

            setMessages([
                ...updatedMessages,
                {
                    role: "model",
                    text: data.result,
                },
            ]);

        } catch (error) {
            console.error("AI Chat Error:", error);

            setMessages([
                ...updatedMessages,
                {
                    role: "model",
                    text: "Sorry, I couldn't generate a response. Please try again.",
                },
            ]);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50">
            <div
                onClick={onClose}
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />

            <div className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-violet-200/20 bg-[#11101a] shadow-2xl">

                {/* Header */}
                <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
                    <div className="flex items-center gap-3">
                        <div className="rounded-xl bg-violet-500/20 p-2">
                            <Sparkles className="h-5 w-5 text-violet-400" />
                        </div>

                        <div>
                            <h2 className="font-semibold text-white">
                                AI Assistant
                            </h2>
                            <p className="text-xs text-green-400">
                                Online
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="rounded-lg p-2 text-gray-400 transition hover:bg-white/10 hover:text-white"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Messages */}
                <div className="flex-1 space-y-5 overflow-y-auto p-5">

                    {messages.length === 0 && (
                        <div className="flex h-full flex-col items-center justify-center text-center">
                            <div className="mb-4 rounded-2xl bg-violet-500/15 p-4">
                                <Bot className="h-9 w-9 text-violet-400" />
                            </div>

                            <h3 className="text-lg font-semibold text-white">
                                How can I help you?
                            </h3>

                            <p className="mt-2 max-w-xs text-sm text-gray-400">
                                Ask me anything about productivity, task
                                management or planning your day.
                            </p>
                        </div>
                    )}

                    {messages.map((message, index) => (
                        <div
                            key={index}
                            className={`flex gap-3 ${
                                message.role === "user"
                                    ? "justify-end"
                                    : "justify-start"
                            }`}
                        >
                            {message.role === "model" && (
                                <div className="h-8 w-8 shrink-0 rounded-lg bg-violet-500/20 p-1.5">
                                    <Bot className="h-5 w-5 text-violet-400" />
                                </div>
                            )}

                            <div
                                className={`max-w-[80%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-6 ${
                                    message.role === "user"
                                        ? "bg-violet-600 text-white"
                                        : "bg-white/5 text-gray-200"
                                }`}
                            >
                                {message.text}
                            </div>

                            {message.role === "user" && (
                                <div className="h-8 w-8 shrink-0 rounded-lg bg-white/10 p-1.5">
                                    <User className="h-5 w-5 text-gray-300" />
                                </div>
                            )}
                        </div>
                    ))}

                    {loading && (
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-violet-500/20 p-2">
                                <Bot className="h-5 w-5 text-violet-400" />
                            </div>
                            <div className="rounded-xl bg-white/5 px-4 py-3 text-sm text-gray-400">
                                AI is thinking...
                            </div>
                        </div>
                    )}
                </div>

                {/* Input */}
                <div className="border-t border-white/10 p-4">
                    <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 p-2 focus-within:border-violet-500/50">
                        <input
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    sendMessage();
                                }
                            }}
                            placeholder="Ask your AI assistant..."
                            className="min-w-0 flex-1 bg-transparent px-2 py-2 text-sm text-white outline-none placeholder:text-gray-500"
                        />

                        <button
                            onClick={sendMessage}
                            disabled={!prompt.trim() || loading}
                            className="rounded-lg bg-violet-600 p-3 text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            <Send size={17} />
                        </button>
                    </div>

                   
                </div>
            </div>
        </div>
    );
}
