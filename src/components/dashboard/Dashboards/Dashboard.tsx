"use client";

import { useEffect, useState } from "react";
import API_URL from "@/lib/api";
import TaskChart from "./TaskChart";
import TaskStatusChart from "./TaskStatusChart";
import ProductivityChart from "./ProductivityChart";
import TaskCompletionGauge from "./TaskCompletionGauge";
import RecentlyCompletedTasks from "./RecentlyCompletedTasks";
import AIAssistantCard from "./AIAssistantCard";
import DashboardSkeleton from "./DashboardSkeleton";

type DailyCompletion = {
  day: number;
  value: number;
};

type CompletedTask = {
  _id: string;
  title: string;
  priority: "Low" | "Medium" | "High";
  completedDate: string;
};

type DashboardData = {
  month: string;
  completedData: DailyCompletion[];
  totalTasks: number;
  pendingTasks: number;
  inProgress: number;
  completed: number;
  recentlyCompletedTasks: CompletedTask[];
};

type DashboardApiResponse = {
  success: boolean;
  message?: string;
  data?: DashboardData;
};

const months = Array.from({ length: 12 }, (_, index) => ({
  value: index + 1,
  label: new Date(Date.UTC(2025, index, 1)).toLocaleString("en-US", {
    month: "long",
    timeZone: "UTC",
  }),
}));

function Dashboard() {
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const fetchDashboardData = async () => {
      setLoading(true);
      setError("");

      try {
        const userData = localStorage.getItem("user");
        if (!userData) {
          throw new Error("User data is missing. Please sign in again.");
        }

        let storedUser: unknown;
        try {
          storedUser = JSON.parse(userData);
        } catch {
          throw new Error("Stored user data is invalid. Please sign in again.");
        }

        if (
          typeof storedUser !== "object" ||
          storedUser === null ||
          !("id" in storedUser) ||
          typeof storedUser.id !== "string" ||
          !storedUser.id
        ) {
          throw new Error("Stored user ID is missing. Please sign in again.");
        }

        const query = new URLSearchParams({
          userId: storedUser.id,
          year: String(selectedYear),
          month: String(selectedMonth),
        });
        const response = await fetch(`${API_URL}/api/dashboard?${query}`, {
          credentials: "include",
          signal: controller.signal,
        });
        const result = (await response.json()) as DashboardApiResponse;

        if (!response.ok || !result.success || !result.data) {
          throw new Error(result.message || "Unable to fetch dashboard data.");
        }

        setDashboardData(result.data);
      } catch (fetchError) {
        if (controller.signal.aborted) {
          return;
        }
        setError(
          fetchError instanceof Error
            ? fetchError.message
            : "Unable to fetch dashboard data."
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    void fetchDashboardData();
    return () => controller.abort();
  }, [selectedMonth, selectedYear]);

  const completedThisMonth =
    dashboardData?.completedData.reduce((total, item) => total + item.value, 0) ??
    0;

  const [userName, setUserName] = useState("there");
  const [greeting, setGreeting] = useState("Good morning");

  useEffect(() => {
    const updateGreeting = () => {
      const hour = new Date().getHours();

      if (hour >= 5 && hour < 12) {
        setGreeting("Good morning");
      } else if (hour >= 12 && hour < 17) {
        setGreeting("Good afternoon");
      } else if (hour >= 17 && hour < 21) {
        setGreeting("Good evening");
      } else {
        setGreeting("Good night");
      }
    };

    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setUserName(user.name || "there");
      } catch (error) {
        console.error("Unable to read user details:", error);
      }
    }

    updateGreeting();

    // Refresh greeting every minute
    const interval = setInterval(updateGreeting, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              {greeting},{" "}
              <span className="bg-gradient-to-r from-violet-300 via-purple-300 to-indigo-300 bg-clip-text text-transparent">
                {userName}
              </span>
              <span className="ml-2">👋</span>
            </h1>

            <p className="mt-2 text-sm text-gray-400">
              Every task completed is a step closer to your goals.
              Let's make today productive!
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <div>
            <label
              htmlFor="dashboard-month"
              className="mb-1 block text-xs font-medium text-gray-400"
            >
              Month
            </label>
            <select
              id="dashboard-month"
              value={selectedMonth}
              onChange={(event) => setSelectedMonth(Number(event.target.value))}
              className="rounded-lg border border-white/10 bg-[#171725] px-3 py-2 text-sm text-white outline-none focus:border-purple-400"
            >
              {months.map((month) => (
                <option key={month.value} value={month.value}>
                  {month.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="dashboard-year"
              className="mb-1 block text-xs font-medium text-gray-400"
            >
              Year
            </label>
            <select
              id="dashboard-year"
              value={selectedYear}
              onChange={(event) => setSelectedYear(Number(event.target.value))}
              className="rounded-lg border border-white/10 bg-[#171725] px-3 py-2 text-sm text-white outline-none focus:border-purple-400"
            >
              {Array.from({ length: 11 }, (_, index) => {
                const year = new Date().getFullYear() - index;
                return (
                  <option key={year} value={year}>
                    {year}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
      </div>

      {loading && (
        <DashboardSkeleton />
      )}
      {!loading && error && (
        <p role="alert" className="rounded-xl border border-red-400/20 bg-red-500/10 p-5 text-sm text-red-300">
          {error}
        </p>
      )}

      {!loading && !error && dashboardData && (
        <>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-6">
            <div className="lg:col-span-4">
              <ProductivityChart
                data={dashboardData.completedData}
                completed={completedThisMonth}
                month={dashboardData.month}
              />
            </div>
            <div className="lg:col-span-2">
              <AIAssistantCard onClick={() => setIsAIOpen(true)} />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <TaskChart
              data={dashboardData.completedData}
              month={dashboardData.month}
            />
            <TaskStatusChart
              pending={dashboardData.pendingTasks}
              inProgress={dashboardData.inProgress}
              completed={dashboardData.completed}
            />
            <TaskCompletionGauge
              completed={dashboardData.completed}
              total={dashboardData.totalTasks}
            />

            <RecentlyCompletedTasks
              tasks={dashboardData.recentlyCompletedTasks}
              completedCount={completedThisMonth}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;
