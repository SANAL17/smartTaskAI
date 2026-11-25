

import {
    RadialBarChart,
    RadialBar,
    ResponsiveContainer,
    PolarAngleAxis,
} from "recharts";

interface TaskCompletionGaugeProps {
    completed: number;
    total: number;
}

export default function TaskCompletionGauge({
    completed,
    total,
}: TaskCompletionGaugeProps) {

    const percentage = total > 0
        ? Math.round((completed / total) * 100)
        : 0;

    const data = [
        {
            name: "Completion",
            value: percentage,
            fill: "#8B5CF6",
        },
    ];

    return (
        <div className="rounded-2xl  border border-purple-400/20 bg-gradient-to-br from-[#11051d] via-[#1b0d2b] to-[#11051d]  p-5 shadow-lg shadow-black/10">

            <div className="mb-4">
                <h2 className="text-lg font-semibold text-white">
                    Task Completion
                </h2>
                <p className="mt-1 text-sm text-gray-400">
                    Overall task completion rate
                </p>
            </div>

            <div className="relative h-[190px] w-full">

                <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart
                        data={data}
                        cx="50%"
                        cy="85%"
                        innerRadius="72%"
                        outerRadius="100%"
                        startAngle={180}
                        endAngle={0}
                        barSize={20}
                    >
                        <PolarAngleAxis
                            type="number"
                            domain={[0, 100]}
                            tick={false}
                        />

                        <RadialBar
                            dataKey="value"
                            cornerRadius={12}
                            background={{
                                fill: "#343044",
                            }}
                        />
                    </RadialBarChart>
                </ResponsiveContainer>

                {/* Center Percentage */}
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-end pb-3">
                    <h3 className="text-4xl font-bold text-white">
                        {percentage}%
                    </h3>

                    <p className="mt-1 text-xs text-gray-400">
                        Completed
                    </p>
                </div>
            </div>

            {/* Footer */}
            <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4">
                <div>
                    <p className="text-xs text-gray-400">
                        Completed Tasks
                    </p>
                    <p className="mt-1 text-lg font-semibold text-emerald-400">
                        {completed}
                    </p>
                </div>

                <div className="text-right">
                    <p className="text-xs text-gray-400">
                        Total Tasks
                    </p>
                    <p className="mt-1 text-lg font-semibold text-white">
                        {total}
                    </p>
                </div>
            </div>

        </div>
    );
}
