

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

interface TaskChartProps {
    data: { day: number; value: number }[];
    month: string;
}

export default function TaskChart({ data, month }: TaskChartProps) {
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
        <div className="rounded-2xl border border-purple-400/20 bg-gradient-to-br from-[#11051d] via-[#1b0d2b] to-[#11051d] p-5">
            <h2 className="mb-5 text-lg font-semibold text-white">
                Daily Task Completion
            </h2>
            <p className="-mt-3 mb-5 text-sm text-gray-400">{month}</p>

            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={filteredData}>
                        <CartesianGrid
                            stroke="#ffffff10"
                            vertical={false}
                        />

                        <XAxis
                            dataKey="day"
                            stroke="#94A3B8"
                            tickLine={false}
                            axisLine={false}
                        />

                        <YAxis
                            stroke="#94A3B8"
                            tickLine={false}
                            axisLine={false}
                        />

                        <Tooltip
                            contentStyle={{
                                backgroundColor: "#171725",
                                border: "1px solid #ffffff20",
                                borderRadius: "12px",
                                color: "#fff",
                            }}
                        />

                        <Bar
                            dataKey="value"
                            fill="#8B5CF6"
                            radius={[6, 6, 0, 0]}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
