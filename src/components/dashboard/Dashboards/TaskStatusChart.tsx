

import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

interface TaskStatusChartProps {
    completed: number;
    inProgress: number;
    pending: number;
}

export default function TaskStatusChart({
    completed,
    inProgress,
    pending,
}: TaskStatusChartProps) {
    const data = [
        { name: "Completed", value: completed, color: "#34D399" },
        { name: "In Progress", value: inProgress, color: "#A78BFA" },
        { name: "Pending", value: pending, color: "#FBBF24" },
    ];
    const total = data.reduce((sum, item) => sum + item.value, 0);

    return (
        <div className="rounded-2xl  border border-purple-400/20 bg-gradient-to-br from-[#11051d] via-[#1b0d2b] to-[#11051d]  p-5 shadow-lg shadow-black/10">

            <div className="mb-5">
                <h2 className="text-lg font-semibold text-white">
                    Task Status
                </h2>
                <p className="mt-1 text-sm text-gray-400">
                    Distribution of your tasks
                </p>
            </div>

            <div className="relative h-[230px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            innerRadius={65}
                            outerRadius={90}
                            paddingAngle={5}
                            stroke="none"
                        >
                            {data.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={entry.color}
                                />
                            ))}
                        </Pie>

                        <Tooltip
                            contentStyle={{
                                background: "#202033",
                                border: "1px solid #ffffff15",
                                borderRadius: "12px",
                                color: "#fff",
                            }}
                        />
                    </PieChart>
                </ResponsiveContainer>

                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                    <h3 className="text-3xl font-bold text-white">
                        {total}
                    </h3>
                    <p className="text-xs text-gray-400">
                        Total Tasks
                    </p>
                </div>
            </div>

            <div className="mt-4 space-y-3">
                {data.map((item) => (
                    <div
                        key={item.name}
                        className="flex items-center justify-between"
                    >
                        <div className="flex items-center gap-2">
                            <span
                                className="h-2.5 w-2.5 rounded-full"
                                style={{ backgroundColor: item.color }}
                            />
                            <span className="text-sm text-gray-400">
                                {item.name}
                            </span>
                        </div>

                        <span className="text-sm font-semibold text-white">
                            {item.value}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
