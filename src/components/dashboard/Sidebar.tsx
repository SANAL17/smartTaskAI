
import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="w-64 min-h-screen bg-[#111827] text-white p-6">

      {/* Logo */}
      <h1 className="text-2xl font-bold mb-10">
        SmartTask <span className="text-purple-400">AI</span>
      </h1>

      {/* Navigation */}
      <nav className="space-y-3">

        <Link
          href="/dashboard"
          className="block rounded-lg px-4 py-3 hover:bg-gray-700"
        >
          🏠 Dashboard
        </Link>

        <Link
          href="/task/allTasks"
          className="block rounded-lg px-4 py-3 hover:bg-gray-700"
        >
          📋 All Tasks
        </Link>

        <Link
          href="/task/newTask"
          className="block rounded-lg px-4 py-3 hover:bg-gray-700"
        >
          ➕ New Task
        </Link>

        <Link
          href="/settings"
          className="block rounded-lg px-4 py-3 hover:bg-gray-700"
        >
          ⚙️ Settings
        </Link>

      </nav>

      {/* Profile */}
      <div className="mt-16 border-t border-gray-700 pt-5">
        <p className="font-semibold">My Account</p>
        <p className="text-sm text-gray-400">Manage your profile</p>
      </div>

    </aside>
  );
}
