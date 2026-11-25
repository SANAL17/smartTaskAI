

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

interface ProductivityChartProps {
    data: { day: number; value: number }[];
    completed: number;
    month: string;
}

export default function ProductivityChart({
    data,
    completed,
    month,
}: ProductivityChartProps) {

    const today = new Date();

    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    // Expected month format: "November 2026"
    const selectedDate = new Date(`${month} 1`);

    const selectedMonth = selectedDate.getMonth();
    const selectedYear = selectedDate.getFullYear();

    const lastVisibleDay =
        selectedYear === currentYear && selectedMonth === currentMonth
            ? today.getDate()
            : new Date(selectedYear, selectedMonth + 1, 0).getDate();

    const filteredData = data.filter(
        (item) => item.day <= lastVisibleDay
    );

    return (
        <div className="rounded-2xl border border-purple-400/20 bg-gradient-to-br from-[#11051d] via-[#1b0d2b] to-[#11051d]  p-5 shadow-lg shadow-black/10">

            <div className="mb-6">
                <h2 className="text-lg font-semibold text-white">
                    Productivity Trend
                </h2>
                <p className="mt-1 text-sm text-gray-400">
                    Daily task completion performance in {month}
                </p>
            </div>

            <div className="mb-5">
                <h3 className="text-3xl font-bold text-white">{completed}</h3>
                <p className="text-xs text-gray-400">
                    Tasks completed this month
                </p>
            </div>

            <div className="h-[260px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={filteredData}
                        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                        <defs>
                            <linearGradient
                                id="lineGradient"
                                x1="0"
                                y1="0"
                                x2="1"
                                y2="0"
                            >
                                <stop offset="0%" stopColor="#6366F1" />
                                <stop offset="100%" stopColor="#C084FC" />
                            </linearGradient>
                        </defs>

                        <CartesianGrid
                            stroke="#ffffff10"
                            vertical={false}
                        />

                        <XAxis
                            dataKey="day"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "#94A3B8", fontSize: 12 }}
                        />

                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            allowDecimals={false}
                            tick={{ fill: "#94A3B8", fontSize: 12 }}
                        />

                        <Tooltip
                            contentStyle={{
                                background: "#202033",
                                border: "1px solid #ffffff15",
                                borderRadius: "12px",
                                color: "#fff",
                            }}
                        />

                        <Line
                            type="monotone"
                            dataKey="value"
                            stroke="url(#lineGradient)"
                            strokeWidth={3}
                            dot={{
                                fill: "#A78BFA",
                                stroke: "#171725",
                                strokeWidth: 2,
                                r: 5,
                            }}
                            activeDot={{ r: 7, fill: "#C084FC" }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
