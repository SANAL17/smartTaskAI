
"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "@/components/dashboard/Navbar";

export default function AuthWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [checking, setChecking] = useState(true);

    // Public routes
    const publicRoutes = [
        "/login",
        "/signup",
        "/forgot-password",
    ];

    const isPublicPage = publicRoutes.includes(pathname);

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (token && isPublicPage) {
            // Logged-in users cannot access auth pages
            router.replace("/dashboard");
            return;
        }

        if (!token && !isPublicPage) {
            // Unauthenticated users cannot access protected pages
            router.replace("/login");
            return;
        }

        setIsAuthenticated(!!token);
        setChecking(false);

    }, [pathname, router, isPublicPage]);

    if (checking) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <p className="text-sm text-slate-500">
                    Checking authentication...
                </p>
            </div>
        );
    }

    if (!isPublicPage && !isAuthenticated) {
        return null;
    }

    return (
        <div className="min-h-screen">

            {!isPublicPage && <Navbar />}

            <main className="mx-auto min-h-screen max-w-7xl p-5 md:p-8">
                {children}
            </main>

        </div>
    );
}
