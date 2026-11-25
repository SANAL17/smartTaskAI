
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import API_URL from "@/lib/api";
import { log } from "console";

export default function LoginForm() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [LoginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginForm({
      ...LoginForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/api/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(LoginForm),
      });

      const data = await response.json();

      // console.log(response)

      if (response.ok) {
        const token = data.token;
        const user = data.user;

        // Store in localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        router.push("/dashboard");

      }

      if (!response.ok) {
        setError(data.message || "Login failed");
        return;
      }


    } catch (error) {
      setError("Unable to connect to the server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-12">

      {/* Background decoration */}
      {/* <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 top-20 h-96 w-96 rounded-full bg-emerald-100/60 blur-3xl" />
        <div className="absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-green-100/70 blur-3xl" />
      </div> */}

      {/* Large background branding
      <div className="pointer-events-none absolute left-0 right-0 top-[15%] select-none text-center">
        <h1 className="whitespace-nowrap text-[13vw] font-black leading-none tracking-[-0.09em] text-green-100/70 blur-xs">
          SMARTTASK
          <span className="text-[#10B981]/20"> AI</span>
        </h1>
      </div> */}

      {/* Login content */}
      <div className="relative z-10 w-full max-w-[440px]">

        {/* Brand heading */}
        <div className="mb-4 text-center">
          <h2 className="mt-1 text-3xl font-bold tracking-tight text-white capitalize">
            Welcome back
          </h2>

          <p className="mt-2 text-sm text-slate-500">
              Login to continue to your workspace.
          </p>
        </div>

        {/* Login card */}
        <div className="rounded-[28px] border border-white/30 bg-transparent p-7 shadow-[0_25px_80px_-20px_rgba(22,78,59,0.18)] backdrop-blur-xl sm:p-9">

          <form className="space-y-5" onSubmit={handleLogin}>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold text-white"
              >
                Email address
              </label>

              <input
                id="email"
                name="email"
                type="email"
                value={LoginForm.email}
                onChange={handleChange}
                placeholder="name@example.com"
                required
                className="h-12 w-full rounded-xl border border-[#DCE5DF] bg-[#FAFCFA] px-4 text-sm text-[#10231D] outline-none transition placeholder:text-slate-400 focus:border-[#10B981] focus:ring-4 focus:ring-emerald-50"
              />
            </div>

            {/* Password */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-sm  text-slate-300"
                >
                  Password
                </label>

                {/* <Link
                  href="/forgot-password"
                  className="text-xs font-semibold text-slate-300 hover:underline"
                >
                  Forgot password?
                </Link> */}
              </div>

              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={LoginForm.password}
                  onChange={handleChange}
                  required
                  className="h-12 w-full rounded-xl border border-[#DCE5DF] bg-[#FAFCFA] px-4 pr-16 text-sm text-[#10231D] outline-none transition placeholder:text-slate-400 focus:border-[#10B981] focus:ring-4 focus:ring-emerald-50"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-500 hover:text-[#164E3B]"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <div className="flex items-center gap-2">
              <input
                id="remember"
                name="remember"
                type="checkbox"
                className="h-4 w-4 cursor-pointer accent-[#164E3B]"
              />

              <label
                htmlFor="remember"
                className="cursor-pointer text-sm text-slate-600"
              >
                Remember me
              </label>
            </div>

            {/* Error message */}
            {error && (
              <p className="text-sm text-red-600">
                {error}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="h-12 w-full rounded-xl bg-[#215f4a] text-sm font-semibold text-white shadow-lg shadow-emerald-900/10 transition hover:-translate-y-0.5 hover:bg-[#103C2E] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Login..." : "Login to your account"}
            </button>

          </form>

          {/* Signup */}
          <div className="mt-7 border-t border-[#E8EEE9] pt-6 text-center">
            <p className="text-sm text-slate-500">
              Don't have an account?{" "}
              <Link
                href="/signup"
                className="font-bold text-[#16845D] hover:underline"
              >
                Create account
              </Link>
            </p>
          </div>

        </div>

        {/* Footer */}
        <p className="mt-7 text-center text-xs tracking-wide text-slate-400">
          © 2026 SmartTask AI. All rights reserved.
        </p>

      </div>
    </main>
  );
}
