
export default function DashboardSkeleton() {
    return (
        <div className="space-y-6 animate-pulse">


            {/* Charts and AI card */}
            <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-[2fr_1fr]">

                {/* Productivity chart skeleton */}
                <div className="flex min-h-[430px] flex-col rounded-2xl border border-white/[0.08] bg-[#171725] p-5 shadow-lg shadow-black/10">

                    <div className="h-5 w-40 rounded-md bg-white/10" />
                    <div className="mt-3 h-3 w-64 max-w-full rounded-full bg-white/[0.06]" />

                    <div className="mt-8 h-9 w-16 rounded-lg bg-violet-500/10" />
                    <div className="mt-2 h-3 w-36 rounded-full bg-white/[0.06]" />

                    {/* Chart grid */}
                    <div className="mt-8 flex flex-1 flex-col justify-between">
                        {Array.from({ length: 5 }).map((_, index) => (
                            <div
                                key={index}
                                className="h-px w-full bg-white/[0.07]"
                            />
                        ))}

                        <div className="flex items-end justify-between gap-2 pt-3">
                            {Array.from({ length: 12 }).map((_, index) => (
                                <div
                                    key={index}
                                    className="w-full rounded-t-md bg-violet-500/[0.10]"
                                    style={{
                                        height: `${20 + ((index * 17) % 65)}px`,
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* AI card skeleton */}
                <div className="flex min-h-[430px] flex-col overflow-hidden rounded-2xl border border-violet-400/10 bg-gradient-to-br from-[#211638] via-[#19152b] to-[#11101f] shadow-lg">

                    {/* Image placeholder */}
                    <div className="relative flex-1 overflow-hidden bg-gradient-to-br from-violet-500/[0.08] via-purple-500/[0.05] to-indigo-500/[0.08]">
                        <div className="absolute inset-0 bg-gradient-to-t from-[#19152b] to-transparent" />

                        <div className="absolute left-5 top-5 h-8 w-36 rounded-full bg-white/[0.08]" />

                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="h-36 w-36 rounded-full bg-violet-500/[0.10] blur-2xl" />
                            <div className="absolute h-28 w-28 rounded-3xl border border-violet-300/[0.08] bg-violet-400/[0.05]" />
                        </div>
                    </div>

                    {/* AI content placeholder */}
                    <div className="space-y-4 border-t border-white/[0.06] bg-[#19152b] px-5 pb-5 pt-4">

                        <div className="h-6 w-48 max-w-full rounded-md bg-white/10" />

                        <div className="space-y-2">
                            <div className="h-3 w-full rounded-full bg-white/[0.06]" />
                            <div className="h-3 w-4/5 rounded-full bg-white/[0.06]" />
                        </div>

                        <div className="h-12 w-full rounded-xl border border-violet-400/10 bg-violet-500/10" />
                    </div>
                </div>
            </div>

            {/* Bottom section skeleton */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {Array.from({ length: 2 }).map((_, index) => (
                    <div
                        key={index}
                        className="min-h-[250px] rounded-2xl border border-white/[0.08] bg-[#171725] p-5"
                    >
                        <div className="h-5 w-40 rounded-md bg-white/10" />

                        <div className="mt-6 space-y-5">
                            {Array.from({ length: 3 }).map((_, row) => (
                                <div key={row} className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-xl bg-violet-500/10" />
                                    <div className="flex-1 space-y-2">
                                        <div className="h-3 w-2/3 rounded-full bg-white/10" />
                                        <div className="h-2 w-1/3 rounded-full bg-white/[0.06]" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
}
