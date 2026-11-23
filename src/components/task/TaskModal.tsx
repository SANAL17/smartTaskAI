
"use client";

import API_URL from "@/lib/api";
import { useEffect, useState } from "react";

export type TaskFormData = {
    title: string;
    description: string;
    priority: "Low" | "Medium" | "High";
    status: "Pending" | "In Progress" | "Completed";
    dueDate: string;
    _id?: string;
};

type TaskModalProps = {
    isOpen: boolean;
    mode: "create" | "edit";
    initialData?: TaskFormData;
    onClose: () => void;
    onSave: () => void | Promise<void>;
};

const emptyForm: TaskFormData = {
    title: "",
    description: "",
    priority: "Medium",
    status: "Pending",
    dueDate: "",
};

export default function TaskModal({
    isOpen,
    mode,
    initialData,
    onClose,
    onSave,
}: TaskModalProps) {

    const [form, setForm] = useState<TaskFormData>(emptyForm);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [aiPrompt, setAiPrompt] = useState("");
    const [aiLoading, setAiLoading] = useState(false);
    const [aiError, setAiError] = useState("");
    const [subtasks, setSubtasks] = useState<string[]>([]);

    // Set form data when opening create or edit modal
    useEffect(() => {
        if (isOpen) {
            setForm(
                initialData
                    ? {
                        ...emptyForm,
                        ...initialData,
                        dueDate: initialData.dueDate
                            ? initialData.dueDate.slice(0, 10)
                            : "",
                    }
                    : emptyForm
            );
            setError("");
        }
    }, [isOpen, initialData]);

    if (!isOpen) return null;

    // Handle input changes
    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Create or update task
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        console.log("SUBMIT BUTTON CLICKED");
        console.log("Current mode:", mode);
        console.log("Task data:", form);

        if (!form.title.trim()) {
            setError("Task title is required.");
            return;
        }

        if (mode === "edit" && !initialData?._id) {
            setError("Task ID is missing. Cannot update task.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const endpoint =
                mode === "create"
                    ? `${API_URL}/api/tasks/create-task`
                    : `${API_URL}/api/tasks/update-task/${initialData!._id}`;

            const response = await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    title: form.title.trim(),
                    description: form.description,
                    priority: form.priority,
                    status: form.status,
                    dueDate: form.dueDate || null,
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.message || "Unable to save task."
                );
            }

            // Refresh task list in parent component
            await onSave();

            // Close modal after successful save
            onClose();

        } catch (err) {
            console.error("Task save error:", err);

            setError(
                err instanceof Error
                    ? err.message
                    : "Something went wrong."
            );

        } finally {
            setLoading(false);
        }
    };



    const handleGenerateAI = async () => {
        if (!aiPrompt.trim()) {
            setAiError("Please describe the task you want AI to generate.");
            return;
        }

        setAiLoading(true);
        setAiError("");
        setSubtasks([]);

        try {
            const response = await fetch(
                `${API_URL}/api/ai/generate-task`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify({
                        prompt: aiPrompt,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "AI task generation failed."
                );
            }

            const generated = data.result;

            if (!generated || typeof generated !== "object") {
                throw new Error("Invalid AI response.");
            }

            const validPriority = ["Low", "Medium", "High"];

            const subtaskList = Array.isArray(generated.subtasks)
                ? generated.subtasks
                : [];

            const formattedDescription = [
                generated.description || "",
                subtaskList.length > 0
                    ? "\n\nSubtasks:\n" +
                    subtaskList.map((task: string) => `• ${task}`).join("\n")
                    : "",
            ].join("");

            setForm((prev) => ({
                ...prev,
                title: generated.title || "",
                description: formattedDescription,
                priority: validPriority.includes(generated.priority)
                    ? generated.priority
                    : "Medium",
                dueDate: /^\d{4}-\d{2}-\d{2}$/.test(generated.dueDate || "")
                    ? generated.dueDate
                    : "",
            }));



        } catch (err) {
            console.error("AI generation error:", err);

            setAiError(
                err instanceof Error
                    ? err.message
                    : "Unable to generate task."
            );

        } finally {
            setAiLoading(false);
        }
    };


    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md p-4">

            <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl overflow-hidden">

                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-100 px-7 py-5">

                    <div>
                        <h2 className="text-xl font-bold text-gray-900">
                            {mode === "create"
                                ? "Create New Task"
                                : "Edit Task"}
                        </h2>

                        <p className="text-sm text-gray-500 mt-1">
                            {mode === "create"
                                ? "Add a new task to your workspace."
                                : "Update your task details below."}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-900 disabled:opacity-50"
                    >
                        ✕
                    </button>

                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="">
                    <div className="max-h-[70vh] overflow-y-auto scrollbar-none">

                    {mode === "create" && (
                        <div className="border-b border-gray-100 bg-purple-50/50 px-7 py-5">
                            <div className="mb-3">
                                <h3 className="font-semibold text-gray-900">
                                    ✨ Generate with AI
                                </h3>

                                <p className="mt-1 text-xs text-gray-500">
                                    Describe your task and let AI create it for you.
                                </p>
                            </div>

                            <textarea
                                value={aiPrompt}
                                onChange={(e) => setAiPrompt(e.target.value)}
                                placeholder="Example: Build a portfolio website with a deadline next week..."
                                rows={3}
                                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none focus:border-purple-400"
                            />

                            {aiError && (
                                <p className="mt-2 text-sm text-red-600">
                                    {aiError}
                                </p>
                            )}

                            <button
                                type="button"
                                onClick={handleGenerateAI}
                                disabled={aiLoading}
                                className="mt-3 rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-700 disabled:opacity-50"
                            >
                                {aiLoading ? "Generating..." : "✨ Generate Task"}
                            </button>

                            {subtasks.length > 0 && (
                                <div className="mt-4 rounded-xl border border-purple-100 bg-white p-4">
                                    <h4 className="mb-2 text-sm font-semibold text-gray-800">
                                        Generated Subtasks
                                    </h4>

                                    <ul className="space-y-2">
                                        {subtasks.map((task, index) => (
                                            <li
                                                key={index}
                                                className="flex gap-2 text-sm text-gray-600"
                                            >
                                                <span className="text-purple-500">✓</span>
                                                {task}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="space-y-5 px-7 py-6">

                        {/* Title */}
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-gray-700">
                                Task Title <span className="text-red-500">*</span>
                            </label>

                            <input
                                name="title"
                                value={form.title}
                                onChange={handleChange}
                                placeholder="Enter task title"
                                required
                                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-100"
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-gray-700">
                                Description
                            </label>

                            <textarea
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                placeholder="Describe your task..."
                                rows={4}
                                className="w-full  rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-100"
                            />
                        </div>

                        {/* Priority and Status */}
                        <div className="grid grid-cols-2 gap-4">

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-gray-700">
                                    Priority
                                </label>

                                <select
                                    name="priority"
                                    value={form.priority}
                                    onChange={handleChange}
                                    className="w-full rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm text-gray-800 outline-none focus:border-gray-500"
                                >
                                    <option value="Low">Low</option>
                                    <option value="Medium">Medium</option>
                                    <option value="High">High</option>
                                </select>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-gray-700">
                                    Status
                                </label>

                                <select
                                    name="status"
                                    value={form.status}
                                    onChange={handleChange}
                                    className="w-full rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm text-gray-800 outline-none focus:border-gray-500"
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Completed">Completed</option>
                                </select>
                            </div>

                        </div>

                        {/* Due Date */}
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-gray-700">
                                Due Date
                            </label>

                            <input
                                type="date"
                                name="dueDate"
                                value={form.dueDate}
                                onChange={handleChange}
                                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-800 outline-none focus:border-gray-500"
                            />
                        </div>

                        {/* Error message */}
                        {error && (
                            <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                                {error}
                            </p>
                        )}

                    </div>

                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-end gap-3 border-t border-gray-100 bg-gray-50 px-7 py-5">

                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 disabled:opacity-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="rounded-xl bg-[#22252D] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#383C47] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading
                                ? "Saving..."
                                : mode === "create"
                                    ? "Create Task"
                                    : "Save Changes"}
                        </button>

                    </div>

                </form>
            </div>
        </div>
    );
}
