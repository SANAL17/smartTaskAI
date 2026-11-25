

interface Task {
    _id: string;
    title: string;
    completedDate: string;
    priority: "Low" | "Medium" | "High";
}

interface RecentlyCompletedTasksProps {
    tasks: Task[];
    completedCount: number;
}

export default function RecentlyCompletedTasks({
    tasks,
    completedCount,
}: RecentlyCompletedTasksProps) {
    const completedTasks = [...tasks]
        .sort(
            (a, b) =>
                new Date(b.completedDate).getTime() -
                new Date(a.completedDate).getTime()
        )
        .slice(0, 5);

    const priorityColors = {
        Low: "text-emerald-400 bg-emerald-400/10",
        Medium: "text-amber-400 bg-amber-400/10",
        High: "text-red-400 bg-red-400/10",
    };

    return (
        <div className="rounded-2xl  border border-purple-400/20 bg-gradient-to-br from-[#11051d] via-[#1b0d2b] to-[#11051d]  p-5 shadow-lg">
            <div className="mb-5 flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-semibold text-white">
                        Recently Completed
                    </h2>
                    <p className="mt-1 text-sm text-gray-400">
                        Your latest finished tasks
                    </p>
                </div>

                <span className="rounded-lg bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
                    {completedCount} Done
                </span>
            </div>

            {completedTasks.length === 0 ? (
                <div className="py-8 text-center text-sm text-gray-500">
                    No completed tasks yet.
                </div>
            ) : (
                <div className="space-y-3">
                    {completedTasks.map((task) => (
                        <div
                            key={task._id}
                            className="flex items-center justify-between gap-3 rounded-xl border border-white/5 bg-white/[0.03] p-3 transition hover:border-purple-400/20 hover:bg-white/[0.05]"
                        >
                            <div className="flex min-w-0 items-center gap-3">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
                                    ✓
                                </div>

                                <div className="min-w-0">
                                    <h3 className="truncate text-sm font-medium text-white">
                                        {task.title}
                                    </h3>
                                    <p className="mt-1 text-xs text-gray-500">
                                        {new Date(task.completedDate).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>

                            <span
                                className={`shrink-0 rounded-md px-2 py-1 text-xs font-medium ${
                                    priorityColors[task.priority]
                                }`}
                            >
                                {task.priority}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
