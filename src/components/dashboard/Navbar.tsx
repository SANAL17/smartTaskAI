
import Link from "next/link";

export default function Navbar() {
    return (
        <header className="sticky top-3 z-50 mx-4 rounded-full border border-white/15 bg-gray-950/70 text-white shadow-[0_8px_32px_rgba(0,0,0,0.25)] backdrop-blur-2xl">

            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 md:px-10">

                {/* Logo */}
                <Link
                    href="/dashboard"
                    className="text-2xl font-bold tracking-tight"
                >
                    SmartTask <span className="text-purple-400">AI</span>
                </Link>

                {/* Navigation */}
                <nav className="hidden items-center gap-2 md:flex">

                    <Link
                        href="/dashboard"
                        className="rounded-full px-5 py-2 text-sm text-gray-300 transition-all duration-300 hover:bg-white/10 hover:text-white"
                    >
                        Dashboard
                    </Link>

                    <Link
                        href="/task/allTasks"
                        className="rounded-full px-5 py-2 text-sm text-gray-300 transition-all duration-300 hover:bg-white/10 hover:text-white"
                    >
                        All Tasks
                    </Link>

                    <Link
                        href="/task/newTask"
                        className="rounded-full px-5 py-2 text-sm text-gray-300 transition-all duration-300 hover:bg-purple-500/20 hover:text-purple-300"
                    >
                        + New Task
                    </Link>

                </nav>

                {/* Logout */}
                <button className="rounded-full border border-white/15 bg-white/5 px-5 py-2 text-sm font-medium text-gray-200 transition-all duration-300 hover:border-red-400/40 hover:bg-red-500/15 hover:text-red-300">
                    Log Out
                </button>

            </div>
        </header>
    );
}
