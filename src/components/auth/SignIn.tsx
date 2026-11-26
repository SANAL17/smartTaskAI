
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import API_URL from "@/lib/api";

export default function SignUp() {
    const router = useRouter();

    const [showPassword, setShowPassword] = useState(false);
    const [showRePassword, setShowRePassword] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [CreateForm, setCreateForm] = useState({
        name: "",
        email: "",
        password: "",
        rePassword: "",
    });

    // Handle input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCreateForm({
            ...CreateForm,
            [e.target.name]: e.target.value,
        });
    };

    // Handle registration
    const handleRegister = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        // Check password match
        if (CreateForm.password !== CreateForm.rePassword) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);
        const body = {
            name: CreateForm.name,
            email: CreateForm.email,
            password: CreateForm.password,
        }

        try {
            const response = await fetch(
                `${API_URL}/api/users/register`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify(body),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || "Registration failed");
                return;
            }

            setSuccess("Account created successfully!");

            // Redirect to login page
            setTimeout(() => {
                router.push("/login");
            }, 1500);

        } catch (error) {
            setError(
                "Unable to connect to the server. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 ">

            {/* Background decoration */}


            {/* Background branding */}
            {/* <div className="pointer-events-none absolute left-0 right-0 top-[15%] select-none text-center">
                <h1 className="whitespace-nowrap text-[13vw] font-black leading-none tracking-[-0.09em] text-green-100/70 blur-xs">
                    SMARTTASK
                    <span className="text-[#10B981]/20"> AI</span>
                </h1>
            </div> */}

            {/* Registration content */}
            <div className="relative z-10 w-full max-w-[440px]">

                {/* Heading */}
                <div className="mb-4 text-center">
                    <h2 className="mt-1 text-3xl font-bold tracking-tight text-white capitalize">
                        Create your workspace
                    </h2>
                </div>

                {/* Registration card */}
                <div className="rounded-[28px] border border-white/30 bg-transparent p-7 shadow-[0_25px_80px_-20px_rgba(22,78,59,0.18)] backdrop-blur-xl sm:p-9">

                    <form
                        className="space-y-5"
                        onSubmit={handleRegister}
                    >

                        {/* Name */}
                        <div>
                            <label
                                htmlFor="name"
                                className="mb-2 block text-sm font-semibold text-white"
                            >
                                Full Name
                            </label>

                            <input
                                id="name"
                                name="name"
                                type="text"
                                value={CreateForm.name}
                                onChange={handleChange}
                                placeholder="Enter your full name"
                                required
                                className="h-12 w-full rounded-xl border border-[#DCE5DF] bg-[#FAFCFA] px-4 text-sm text-[#10231D] outline-none transition placeholder:text-slate-400 focus:border-[#10B981] focus:ring-4 focus:ring-emerald-50"
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label
                                htmlFor="email"
                                className="mb-2 block text-sm font-semibold text-white"
                            >
                                Email Address
                            </label>

                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={CreateForm.email}
                                onChange={handleChange}
                                placeholder="name@example.com"
                                required
                                className="h-12 w-full rounded-xl border border-[#DCE5DF] bg-[#FAFCFA] px-4 text-sm text-[#10231D] outline-none transition placeholder:text-slate-400 focus:border-[#10B981] focus:ring-4 focus:ring-emerald-50"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label
                                htmlFor="password"
                                className="mb-2 block text-sm font-semibold text-white"
                            >
                                Password
                            </label>

                            <div className="relative">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    value={CreateForm.password}
                                    onChange={handleChange}
                                    placeholder="Create a password"
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

                        {/* Confirm Password */}
                        <div>
                            <label
                                htmlFor="rePassword"
                                className="mb-2 block text-sm font-semibold text-white"
                            >
                                Confirm Password
                            </label>

                            <div className="relative">
                                <input
                                    id="rePassword"
                                    name="rePassword"
                                    type={showRePassword ? "text" : "password"}
                                    value={CreateForm.rePassword}
                                    onChange={handleChange}
                                    placeholder="Confirm your password"
                                    required
                                    className="h-12 w-full rounded-xl border border-[#DCE5DF] bg-[#FAFCFA] px-4 pr-16 text-sm text-[#10231D] outline-none transition placeholder:text-slate-400 focus:border-[#10B981] focus:ring-4 focus:ring-emerald-50"
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowRePassword(!showRePassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-500 hover:text-[#164E3B]"
                                >
                                    {showRePassword ? "Hide" : "Show"}
                                </button>
                            </div>
                        </div>

                        {/* Error message */}
                        {error && (
                            <p className="text-sm text-red-600">
                                {error}
                            </p>
                        )}

                        {/* Success message */}
                        {success && (
                            <p className="text-sm text-green-600">
                                {success}
                            </p>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="h-12 w-full rounded-xl bg-[#164E3B] text-sm font-semibold text-white shadow-lg shadow-emerald-900/10 transition hover:-translate-y-0.5 hover:bg-[#103C2E] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading
                                ? "Creating Account..."
                                : "Create Account"}
                        </button>

                    </form>

                    {/* Login link */}
                    <div className="mt-7 border-t border-[#E8EEE9] pt-6 text-center">
                        <p className="text-sm text-slate-500">
                            Already have an account?{" "}
                            <Link
                                href="/login"
                                className="font-bold text-[#16845D] hover:text-[#164E3B]"
                            >
                                Login Now
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
