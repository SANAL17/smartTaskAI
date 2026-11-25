
"use client";

import Link from "next/link";
import { useState } from "react";
import LogoutModal from "./LogoutModal";
import { ClipboardList, LayoutDashboard, Menu, Sparkles, X } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import AIAssistantDrawer from "./AIAssistantDrawer";
export default function Navbar() {
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isAIOpen, setIsAIOpen] = useState(false);
    const router = useRouter();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setShowLogoutModal(false);
        setMobileMenuOpen(false);
        router.replace("/login");
    };

    const closeMobileMenu = () => {
        setMobileMenuOpen(false);
    };
    const pathname = usePathname();

    const isActive = (path: string) => pathname === path;

    return (
        <>
            <header className="sticky top-3 z-50 mx-3 rounded-2xl border border-white/15 bg-[#151521]/80 text-white shadow-[0_8px_32px_rgba(0,0,0,0.25)] backdrop-blur-2xl sm:mx-4 sm:rounded-full">

                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 md:px-8">

                    {/* Logo */}
                    <Link
                        href="/dashboard"
                        onClick={closeMobileMenu}
                        className="shrink-0 text-xl font-bold tracking-tight sm:text-2xl"
                    >
                        SmartTask <span className="text-purple-400">AI</span>
                    </Link>

                    {/* Desktop Navigation */}

                    <nav className="hidden items-center gap-2 md:flex">

                        <Link
                            href="/dashboard"
                            className={`inline-flex items-center justify-center border-white/10 gap-2 rounded-full border px-5 py-2 text-sm transition-all duration-300 ${isActive("/dashboard")
                                ? "border-purple-400/50 bg-purple-500/15 text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.12)]"
                                : "border-transparent text-gray-300 hover:border-white/10 hover:bg-white/10 hover:text-white"
                                }`}
                        >
                            <LayoutDashboard size={15} /> Dashboard
                        </Link>

                        <Link
                            href="/task/allTasks"
                            className={`inline-flex items-center justify-center gap-2 border-white/10 rounded-full border px-5 py-2 text-sm transition-all duration-300 ${isActive("/task/allTasks")
                                ? "border-purple-400/50 bg-purple-500/15 text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.12)]"
                                : "border-transparent text-gray-300 hover:border-white/10 hover:bg-white/10 hover:text-white"
                                }`}
                        >
                            <ClipboardList size={15} />   All Tasks
                        </Link>

                        <button
                            type="button"
                            onClick={() => setIsAIOpen(true)}
                            className={`inline-flex items-center justify-center gap-2 border-white/10 rounded-full border px-5 py-2 text-sm transition-all duration-300 ${isActive("/task/newTask")
                                ? "border-purple-400/50 bg-purple-500/15 text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.12)]"
                                : "border-transparent text-gray-300 hover:border-white/10 hover:bg-white/10 hover:text-white"
                                }`}>
                            <Sparkles size={15} />AI

                        </button>

                    </nav>


                    {/* Desktop Logout */}
                    <button
                        onClick={() => setShowLogoutModal(true)}
                        className="hidden rounded-full border border-white/15 bg-white/5 px-5 py-2 text-sm font-medium text-gray-200 transition-all duration-300 hover:border-red-400/40 hover:bg-red-500/15 hover:text-red-300 md:block"
                    >
                        Log Out
                    </button>

                    {/* Mobile Menu Button */}
                    <button
                        type="button"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                        aria-expanded={mobileMenuOpen}
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-gray-200 transition hover:bg-white/10 md:hidden"
                    >
                        {mobileMenuOpen ? (
                            <X size={21} />
                        ) : (
                            <Menu size={21} />
                        )}
                    </button>

                </div>

                {/* Mobile Navigation */}
                {mobileMenuOpen && (
                    <div className="border-t border-white/10 px-4 pb-4 pt-3 md:hidden">

                        <nav className="flex flex-col gap-1">

                            <Link
                                href="/dashboard"
                                onClick={closeMobileMenu}
                                className="rounded-xl px-4 py-3 text-sm text-gray-300 transition hover:bg-white/10 hover:text-white"
                            >
                                Dashboard
                            </Link>

                            <Link
                                href="/task/allTasks"
                                onClick={closeMobileMenu}
                                className="rounded-xl px-4 py-3 text-sm text-gray-300 transition hover:bg-white/10 hover:text-white"
                            >
                                All Tasks
                            </Link>


                            <div className="my-2 border-t border-white/10" />

                            <button
                                type="button"
                                onClick={() => {
                                    setMobileMenuOpen(false);
                                    setShowLogoutModal(true);
                                }}
                                className="w-full rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-left text-sm font-medium text-red-300 transition hover:bg-red-500/20"
                            >
                                Log Out
                            </button>

                        </nav>
                    </div>
                )}

            </header>

            {/* Logout Modal */}
            <LogoutModal
                isOpen={showLogoutModal}
                onClose={() => setShowLogoutModal(false)}
                onConfirm={handleLogout}
            />

            <AIAssistantDrawer
                isOpen={isAIOpen}
                onClose={() => setIsAIOpen(false)}
            />
        </>
    );
}
