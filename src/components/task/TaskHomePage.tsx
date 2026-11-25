

"use client";

import React, { useEffect, useState } from "react";
import TaskModal from "./TaskModal";
import API_URL from "@/lib/api";

type Status = "Pending" | "In Progress" | "Completed";
type Priority = "Low" | "Medium" | "High";

type Task = {
    id: string;
    _id?: string;
    title: string;
    description: string;
    status: Status;
    priority: Priority;
    dueDate: string;
};

const columns: Status[] = [
    "Pending",
    "In Progress",
    "Completed",
];

const emptyForm = {
    title: "",
    description: "",
    status: "Pending" as Status,
    priority: "Medium" as Priority,
    dueDate: "",
};

export default function TaskHomePage() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [view, setView] = useState<"kanban" | "list">("kanban");
    const [search, setSearch] = useState("");

    const [showForm, setShowForm] = useState(false);
    const [showDetails, setShowDetails] = useState(false);

    const [editingTask, setEditingTask] = useState<Task | null>(null);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const [modalMode, setModalMode] = useState<"create" | "edit">("create");

    const [selectedTask, setSelectedTask] = useState<any | undefined>(
        undefined
    );
    const [form, setForm] = useState(emptyForm);
    const handleCreateTask = () => {
        setSelectedTask(undefined);
        setModalMode("create");
        setIsModalOpen(true);
    };

    const handleEditTask = (task: any) => {
        setSelectedTask({
            ...task,
            _id: task._id || task.id,
        });
        setModalMode("edit");
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedTask(undefined);
    };
    const filteredTasks = tasks.filter((task) =>
        task.title.toLowerCase().includes(search.toLowerCase())
    );

    const openCreate = () => {
        handleCreateTask();
    };

    const openEdit = (task: Task) => {
        handleEditTask(task);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!form.title.trim()) return;

        if (editingTask) {
            setTasks((prev) =>
                prev.map((task) =>
                    task.id === editingTask.id
                        ? { ...task, ...form }
                        : task
                )
            );
        } else {
            const newTask: Task = {
                id: String(Date.now()),
                ...form,
            };

            setTasks((prev) => [newTask, ...prev]);
        }

        setShowForm(false);
        setForm(emptyForm);
        setEditingTask(null);
    };

    const deleteTask = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this task?")) {
            return;
        }

        try {
            const response = await fetch(`${API_URL}/api/tasks/delete/${id}`, {
                method: "POST",
                credentials: "include",
            });

            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || "Failed to delete task");
            }

            setTasks((prev) => prev.filter((task) => task.id !== id));
            setShowDetails(false);
        } catch (error) {
            console.error("Delete task error:", error);
            window.alert(error instanceof Error ? error.message : "Failed to delete task");
        }
    };

    const openDetails = (task: Task) => {
        setSelectedTask(task);
        setShowDetails(true);
    };

    const priorityStyle = (priority: Priority) => {
        switch (priority) {
            case "High":
                return "bg-red-50 text-red-600";
            case "Medium":
                return "bg-amber-50 text-amber-600";
            default:
                return "bg-emerald-50 text-emerald-600";
        }
    };

    const statusStyle = (status: Status) => {
        switch (status) {
            case "Pending":
                return "bg-slate-100 text-slate-600";
            case "In Progress":
                return "bg-blue-50 text-blue-600";
            default:
                return "bg-emerald-50 text-emerald-600";
        }
    };

    const completedCount = tasks.filter(
        (task) => task.status === "Completed"
    ).length;





    const fetchTasks = async () => {
        try {
            const response = await fetch(
                `${API_URL}/api/tasks/getAllTasks`,
                {
                    method: "POST",
                    credentials: "include",
                }
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Failed to fetch tasks");
            }

            const apiTasks = (result.tasks || []).map((task: any) => ({
                ...task,
                id: task._id,
                dueDate: task.dueDate ? task.dueDate.slice(0, 10) : "",
            }));

            setTasks(apiTasks);

        } catch (error) {
            console.error("Fetch tasks error:", error);
        }
    };

    useEffect(() => {
        void fetchTasks();
    }, []);


    return (
        <div className="min-h-screen  ">

            {/* HEADER */}
            <div className="mb-4 flex flex-col justify-between gap-5 md:flex-row md:items-center">

                <div>


                    <h1 className="text-3xl font-bold tracking-tight ">
                        My Tasks
                    </h1>

                    <p className="mt-2 text-sm text-slate-500">
                        Manage your work, track progress and stay productive.
                    </p>
                </div>
                <button
                    onClick={openCreate}
                    className="rounded-2xl border border-purple-400/20 bg-gradient-to-br from-purple-500/20 via-[#1b0d2b] to-[#11051d] p-2 shadow-lg shadow-purple-950/20 transition duration-300 hover:-translate-y-1 hover:border-purple-400/40"
                >
                    <span className="mr-2 text-purple-200">+</span>
                    New Task
                </button>
                <TaskModal
                    isOpen={isModalOpen}
                    mode={modalMode}
                    initialData={selectedTask}
                    onClose={handleCloseModal}
                    onSave={fetchTasks}
                />
            </div>

            {/* STATS */}

            <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

                {/* Total Tasks */}
                <div className="rounded-2xl border border-purple-400/20 bg-gradient-to-br from-purple-500/20 via-[#1b0d2b] to-[#11051d] p-5 shadow-lg shadow-purple-950/20 transition duration-300 hover:-translate-y-1 hover:border-purple-400/40">
                    <p className="text-sm font-medium text-purple-200">Total Tasks</p>
                    <h2 className="mt-3 text-3xl font-bold text-white">
                        {tasks.length}
                    </h2>
                    <p className="mt-2 text-xs text-purple-300/70">
                        All your tasks
                    </p>
                </div>

                {/* In Progress */}
                <div className="rounded-2xl border border-blue-400/20 bg-gradient-to-br from-blue-500/20 via-[#11152d] to-[#10091e] p-5 shadow-lg shadow-blue-950/20 transition duration-300 hover:-translate-y-1 hover:border-blue-400/40">
                    <p className="text-sm font-medium text-blue-200">In Progress</p>
                    <h2 className="mt-3 text-3xl font-bold text-white">
                        {tasks.filter((t) => t.status === "In Progress").length}
                    </h2>
                    <p className="mt-2 text-xs text-blue-300/70">
                        Tasks currently active
                    </p>
                </div>

                {/* Pending */}
                <div className="rounded-2xl border border-orange-400/20 bg-gradient-to-br from-orange-500/20 via-[#271426] to-[#16091d] p-5 shadow-lg shadow-orange-950/20 transition duration-300 hover:-translate-y-1 hover:border-orange-400/40">
                    <p className="text-sm font-medium text-orange-200">Pending</p>
                    <h2 className="mt-3 text-3xl font-bold text-white">
                        {tasks.filter((t) => t.status === "Pending").length}
                    </h2>
                    <p className="mt-2 text-xs text-orange-300/70">
                        Tasks waiting to start
                    </p>
                </div>

                {/* Completed */}
                <div className="rounded-2xl border border-emerald-400/20 bg-gradient-to-br from-emerald-500/20 via-[#10231f] to-[#0d151b] p-5 shadow-lg shadow-emerald-950/20 transition duration-300 hover:-translate-y-1 hover:border-emerald-400/40">
                    <p className="text-sm font-medium text-emerald-200">Completed</p>
                    <h2 className="mt-3 text-3xl font-bold text-white">
                        {completedCount}
                    </h2>
                    <p className="mt-2 text-xs text-emerald-300/70">
                        Successfully completed
                    </p>
                </div>

            </div>



            {/* TOOLBAR */}
            <div className="mb-5 flex flex-col justify-between gap-4 rounded-2xl border border-purple-400/15 bg-gradient-to-r from-[#171027] via-[#110d20] to-[#19102c] p-4 shadow-lg shadow-purple-950/20 md:flex-row md:items-center">

                <div className="relative w-full md:max-w-sm">
                    <input
                        type="text"
                        placeholder="Search tasks..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full rounded-xl border border-purple-300/20 bg-[#0d0919] px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none transition-all focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20"
                    />
                </div>

                <div className="flex w-fit rounded-xl border border-purple-300/10 bg-[#0b0815] p-1">

                    <button
                        onClick={() => setView("kanban")}
                        className={`rounded-lg px-5 py-2.5 text-sm font-semibold transition-all duration-300 ${view === "kanban"
                            ? "bg-gradient-to-r from-[#2c204e] to-[#211154] text-white shadow-lg shadow-purple-900/40"
                            : "text-slate-400 hover:bg-white/5 hover:text-white"
                            }`}
                    >
                        ▦ Board
                    </button>

                    <button
                        onClick={() => setView("list")}
                        className={`rounded-lg px-5 py-2.5 text-sm font-semibold transition-all duration-300 ${view === "list"
                            ? "bg-gradient-to-r from-purple-600 to-violet-500 text-white shadow-lg shadow-purple-900/40"
                            : "text-slate-400 hover:bg-white/5 hover:text-white"
                            }`}
                    >
                        ☰ List
                    </button>

                </div>
            </div>



            {/* KANBAN VIEW */}
            {view === "kanban" && (
                <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">

                    {columns.map((column) => {
                        const columnTasks = filteredTasks.filter(
                            (task) => task.status === column
                        );

                        return (
                            <div
                                key={column}
                                className="min-w-0 rounded-2xl border border-purple-400/15 bg-gradient-to-br from-[#1b1530] via-[#151025] to-[#0e0b1b] p-4 shadow-xl shadow-black/20"
                            >

                                {/* COLUMN HEADER */}
                                <div className="mb-5 flex items-center justify-between">

                                    <div className="flex items-center gap-3">

                                        <span className={`h-2.5 w-2.5 rounded-full ${column === "Pending"
                                            ? "bg-amber-400 shadow-2"
                                            : column === "In Progress"
                                                ? "bg-blue-400 shadow-2"
                                                : "bg-emerald-400 shadow-2"
                                            }`} />

                                        <h3 className="font-bold text-white">
                                            {column}
                                        </h3>

                                        <span className="rounded-full border border-purple-300/15 bg-white/5 px-2.5 py-0.5 text-xs font-medium text-purple-200">
                                            {columnTasks.length}
                                        </span>

                                    </div>

                                </div>

                                {/* TASK CARDS */}
                                <div className="space-y-4">

                                    {columnTasks.map((task) => (

                                        <div
                                            key={task.id}
                                            className="group rounded-xl border border-white/10 bg-gradient-to-br from-[#27203c] via-[#1e1931] to-[#171225] p-4 shadow-lg shadow-black/20 transition-all duration-300 hover:-translate-y-1 hover:border-purple-400/40 hover:shadow-xl hover:shadow-purple-950/30"
                                        >

                                            {/* PRIORITY */}
                                            <div className="mb-4 flex items-center justify-between">

                                                <span className={`rounded-md px-2.5 py-1 text-xs font-semibold ${priorityStyle(task.priority)}`}>
                                                    {task.priority} Priority
                                                </span>

                                                <button
                                                    onClick={() => openEdit(task)}
                                                    className="rounded-lg px-2 py-1 text-lg text-slate-400 transition hover:bg-purple-500/10 hover:text-purple-300"
                                                    title="Edit task"
                                                >
                                                    ⋯
                                                </button>

                                            </div>

                                            {/* TITLE */}
                                            <h4 className="mb-2 font-semibold text-white transition group-hover:text-purple-300">
                                                {task.title}
                                            </h4>

                                            {/* DESCRIPTION */}
                                            <p className="mb-5 line-clamp-2 whitespace-pre-line text-sm leading-6 text-slate-400">
                                                {task.description || "No description provided."}
                                            </p>

                                            {/* DUE DATE */}
                                            <div className="mb-4 flex items-center justify-between border-t border-white/10 pt-3">

                                                <span className="text-xs text-slate-500">
                                                    Due date
                                                </span>

                                                <span className="text-xs font-medium text-slate-300">
                                                    {task.dueDate || "Not set"}
                                                </span>

                                            </div>

                                            {/* ACTION BUTTONS */}
                                            <div className="flex items-center gap-2">

                                                <button
                                                    onClick={() => openDetails(task)}
                                                    className="flex-1 rounded-lg border border-purple-400/15 bg-purple-500/10 px-3 py-2 text-xs font-semibold text-purple-300 transition hover:bg-purple-500/25 hover:text-white"
                                                >
                                                    View
                                                </button>

                                                <button
                                                    onClick={() => openEdit(task)}
                                                    className="flex-1 rounded-lg border border-blue-400/15 bg-blue-500/10 px-3 py-2 text-xs font-semibold text-blue-300 transition hover:bg-blue-500/25 hover:text-white"
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    onClick={() => deleteTask(task.id)}
                                                    className="rounded-lg border border-red-400/15 bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-400 transition hover:bg-red-500/25 hover:text-white"
                                                >
                                                    Delete
                                                </button>

                                            </div>

                                        </div>

                                    ))}

                                    {/* EMPTY STATE */}
                                    {columnTasks.length === 0 && (
                                        <div className="rounded-xl border border-dashed border-purple-300/20 bg-white/[0.02] p-8 text-center">

                                            <p className="mb-2 text-2xl text-purple-400/50">
                                                ◇
                                            </p>

                                            <p className="text-sm font-medium text-slate-400">
                                                No tasks here
                                            </p>

                                            <p className="mt-1 text-xs text-slate-600">
                                                Your tasks will appear here
                                            </p>

                                        </div>
                                    )}

                                </div>

                            </div>
                        );
                    })}

                </div>
            )}


            {/* LIST VIEW */}

            {/* LIST VIEW */}
            {view === "list" && (
                <div className="overflow-hidden rounded-2xl border border-purple-400/15 bg-gradient-to-br from-[#19132c] via-[#120e20] to-[#0d0a18] shadow-xl shadow-black/20">

                    <div className="overflow-x-auto">

                        <table className="w-full min-w-[750px] text-left">

                            {/* TABLE HEADER */}
                            <thead className="border-b border-purple-300/15 bg-white/[0.03]">

                                <tr>

                                    <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-purple-300">
                                        Task
                                    </th>

                                    <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-purple-300">
                                        Status
                                    </th>

                                    <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-purple-300">
                                        Priority
                                    </th>

                                    <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-purple-300">
                                        Due Date
                                    </th>

                                    <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-purple-300">
                                        Actions
                                    </th>

                                </tr>

                            </thead>

                            {/* TABLE BODY */}
                            <tbody>

                                {filteredTasks.map((task) => (

                                    <tr
                                        key={task.id}
                                        className="border-b border-white/[0.06] transition-all duration-200 hover:bg-purple-500/[0.07]"
                                    >

                                        {/* TASK */}
                                        <td className="px-6 py-5">

                                            <p className="font-semibold text-white">
                                                {task.title}
                                            </p>

                                            <p className="mt-1 line-clamp-1 whitespace-pre-line text-xs text-slate-400">
                                                {task.description || "No description provided."}
                                            </p>

                                        </td>

                                        {/* STATUS */}
                                        <td className="px-6 py-5">

                                            <span className={`rounded-full px-3 py-1.5 text-xs font-semibold ${statusStyle(task.status)}`}>
                                                {task.status}
                                            </span>

                                        </td>

                                        {/* PRIORITY */}
                                        <td className="px-6 py-5">

                                            <span className={`rounded-full px-3 py-1.5 text-xs font-semibold ${priorityStyle(task.priority)}`}>
                                                {task.priority}
                                            </span>

                                        </td>

                                        {/* DUE DATE */}
                                        <td className="px-6 py-5 text-sm font-medium text-slate-300">

                                            {task.dueDate || "Not set"}

                                        </td>

                                        {/* ACTIONS */}
                                        <td className="px-6 py-5">

                                            <div className="flex items-center gap-3 text-sm font-semibold">

                                                <button
                                                    onClick={() => openDetails(task)}
                                                    className="text-purple-400 transition hover:text-purple-200"
                                                >
                                                    View
                                                </button>

                                                <button
                                                    onClick={() => openEdit(task)}
                                                    className="text-blue-400 transition hover:text-blue-200"
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    onClick={() => deleteTask(task.id)}
                                                    className="text-red-400 transition hover:text-red-300"
                                                >
                                                    Delete
                                                </button>

                                            </div>

                                        </td>

                                    </tr>

                                ))}

                                {/* EMPTY STATE */}
                                {filteredTasks.length === 0 && (

                                    <tr>
                                        <td
                                            colSpan={5}
                                            className="p-12 text-center text-sm text-slate-400"
                                        >
                                            No tasks found.
                                        </td>
                                    </tr>

                                )}

                            </tbody>

                        </table>

                    </div>

                </div>
            )}


            {/* CREATE / EDIT MODAL */}
            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">

                    <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">

                        <div className="mb-6 flex items-center justify-between">

                            <div>
                                <h2 className="text-xl font-bold text-slate-900">
                                    {editingTask ? "Edit Task" : "Create New Task"}
                                </h2>
                                <p className="mt-1 text-sm text-slate-500">
                                    Add your task details below.
                                </p>
                            </div>

                            <button
                                onClick={() => setShowForm(false)}
                                className="text-2xl text-slate-400 hover:text-slate-800"
                            >
                                ×
                            </button>

                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">

                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    Task Title
                                </label>
                                <input
                                    required
                                    value={form.title}
                                    onChange={(e) =>
                                        setForm({ ...form, title: e.target.value })
                                    }
                                    placeholder="Enter task title"
                                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-purple-500"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    Description
                                </label>
                                <textarea
                                    value={form.description}
                                    onChange={(e) =>
                                        setForm({ ...form, description: e.target.value })
                                    }
                                    placeholder="Describe your task..."
                                    rows={3}
                                    className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-purple-500"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        Status
                                    </label>
                                    <select
                                        value={form.status}
                                        onChange={(e) =>
                                            setForm({ ...form, status: e.target.value as Status })
                                        }
                                        className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-purple-500"
                                    >
                                        <option>Pending</option>
                                        <option>In Progress</option>
                                        <option>Completed</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        Priority
                                    </label>
                                    <select
                                        value={form.priority}
                                        onChange={(e) =>
                                            setForm({ ...form, priority: e.target.value as Priority })
                                        }
                                        className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-purple-500"
                                    >
                                        <option>Low</option>
                                        <option>Medium</option>
                                        <option>High</option>
                                    </select>
                                </div>

                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    Due Date
                                </label>
                                <input
                                    type="date"
                                    value={form.dueDate}
                                    onChange={(e) =>
                                        setForm({ ...form, dueDate: e.target.value })
                                    }
                                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-purple-500"
                                />
                            </div>

                            <div className="flex gap-3 pt-3">

                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="flex-1 rounded-xl bg-purple-600 py-3 text-sm font-semibold text-white transition hover:bg-purple-700"
                                >
                                    {editingTask ? "Save Changes" : "Create Task"}
                                </button>

                            </div>

                        </form>

                    </div>
                </div>
            )}

            {/* VIEW TASK MODAL */}
            {showDetails && selectedTask && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">

                    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">

                        <div className="mb-5 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-slate-900">
                                Task Details
                            </h2>
                            <button
                                onClick={() => setShowDetails(false)}
                                className="text-2xl text-slate-400 hover:text-slate-800"
                            >
                                ×
                            </button>
                        </div>

                        <h3 className="mb-2 text-lg font-semibold text-slate-800">
                            {selectedTask.title}
                        </h3>

                        <p className="mb-6 text-sm leading-6 text-slate-500 whitespace-pre-line">
                            {selectedTask.description || "No description provided."}
                        </p>

                        <div className="space-y-4 rounded-xl bg-slate-50 p-4">

                            <div className="flex justify-between">
                                <span className="text-sm text-slate-500">Status</span>
                                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyle(selectedTask.status)}`}>
                                    {selectedTask.status}
                                </span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-sm text-slate-500">Priority</span>
                                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${priorityStyle(selectedTask.priority)}`}>
                                    {selectedTask.priority}
                                </span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-sm text-slate-500">Due Date</span>
                                <span className="text-sm font-medium text-slate-700">
                                    {selectedTask.dueDate || "Not set"}
                                </span>
                            </div>

                        </div>

                        <div className="mt-6 flex gap-3">

                            <button
                                onClick={() => {
                                    setShowDetails(false);
                                    openEdit(selectedTask);
                                }}
                                className="flex-1 rounded-xl bg-purple-600 py-3 text-sm font-semibold text-white hover:bg-purple-700"
                            >
                                Edit Task
                            </button>

                            <button
                                onClick={() => deleteTask(selectedTask.id)}
                                className="flex-1 rounded-xl border border-red-200 py-3 text-sm font-semibold text-red-500 hover:bg-red-50"
                            >
                                Delete
                            </button>

                        </div>

                    </div>
                </div>
            )}

        </div>
    );
}
