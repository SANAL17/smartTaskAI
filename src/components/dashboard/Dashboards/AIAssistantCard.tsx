
"use client";

import { useState } from "react";
import Image from "next/image";
import {
    Sparkles,
    ArrowUpRight,
    Zap,
} from "lucide-react";

import AIAssistantDrawer from "../AIAssistantDrawer";

interface AIAssistantCardProps {
    onClick?: () => void;
}

export default function AIAssistantCard({
    onClick,
}: AIAssistantCardProps) {
    const [isAIOpen, setIsAIOpen] = useState(false);

    const openAssistant = () => {
        setIsAIOpen(true);
        onClick?.();
    };

    return (
        <>
            <div className="group relative flex h-full min-h-[430px] flex-col overflow-hidden rounded-2xl border border-violet-400/20 bg-[#151222] shadow-[0_12px_40px_rgba(0,0,0,0.25)] transition-all duration-500 hover:-translate-y-1 ">

                {/* Background lighting */}
                <div className="pointer-events-none absolute -right-20 -top-20 z-0 h-64 w-64 rounded-full bg-violet-600/20 blur-[100px]" />

                {/* Image section */}
                <div className="relative min-h-0 flex-1 overflow-hidden">

                    <Image
                        src="/images/AI Boat.png"
                        alt="SmartTask AI Assistant"
                        fill
                        priority
                        sizes="(max-width: 768px) 100vw, 35vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                    />

                    {/* Cinematic image overlays */}
                    <div className="absolute inset-0 bg-gradient-to-b from-[#10091f]/30 via-transparent to-[#151222]" />

                    <div className="absolute inset-0 bg-gradient-to-r from-violet-950/20 via-transparent to-indigo-950/20" />

                    {/* Floating badge */}
                    <div className="absolute left-5 top-5 z-10 flex items-center gap-2 rounded-full border border-white/15 bg-[#171027]/65 px-3.5 py-2 shadow-lg shadow-black/20 backdrop-blur-xl">
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-violet-500/20">
                            <Sparkles size={11} className="text-violet-300" />
                        </div>

                        <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-violet-100">
                            SmartTask AI
                        </span>

                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                    </div>

                    {/* Image heading */}
                    <div className="absolute bottom-0 left-0 right-0 z-10 p-5">
                        <div className="mb-2 flex items-center gap-1.5 text-violet-300">
                            <Zap size={13} />
                            <span className="text-[9px] font-semibold uppercase tracking-[0.2em]">
                                Your productivity partner
                            </span>
                        </div>

                        <h3 className="max-w-sm text-2xl font-bold leading-tight tracking-tight text-white drop-shadow-lg sm:text-[26px]">
                            Plan Smarter.
                            <span className="block bg-gradient-to-r from-violet-300 via-purple-300 to-indigo-300 bg-clip-text text-transparent">
                                Get More Done.
                            </span>
                        </h3>
                    </div>
                </div>

                {/* Content section */}
                <div className="relative z-10 shrink-0 border-t border-white/[0.06] bg-gradient-to-br from-[#11051d] via-[#1b0d2b] to-[#11051d] px-5 pb-5 pt-4">

                    <p className="text-xs leading-5 text-gray-400">
                        Organize your tasks, prioritize your goals,
                        break down complex work and stay productive
                        with your AI companion.
                    </p>

                    {/* CTA */}
                    <button
                        type="button"
                        onClick={openAssistant}
                        className="group/button mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-violet-400/20 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 px-5 py-3 text-sm font-semibold text-white  transition-all duration-300 hover:border-violet-300/40 hover:brightness-110  active:scale-[0.98]"
                    >
                        <Sparkles size={14} />
                        Start a conversation
                        <ArrowUpRight
                            size={15}
                            className="transition-transform duration-300"
                        />
                    </button>
                </div>

                {/* Bottom accent */}
                <div className="absolute bottom-0 left-0 h-[2px] w-full bg-gradient-to-r from-transparent via-violet-500/80 to-transparent opacity-60 transition-opacity group-hover:opacity-100" />
            </div>

            <AIAssistantDrawer
                isOpen={isAIOpen}
                onClose={() => setIsAIOpen(false)}
            />
        </>
    );
}
