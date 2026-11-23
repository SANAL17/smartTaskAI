
import type { Metadata } from "next";
import Navbar from "@/components/dashboard/Navbar";
import "./globals.css";

export const metadata: Metadata = {
    title: "SmartTask AI",
    description: "Smart Task Management Application",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body>
                <div className="min-h-screen">
                    <Navbar />

                    <main className="mx-auto min-h-screen max-w-7xl p-5 md:p-8">
                        {children}
                    </main>
                </div>
            </body>
        </html>
    );
}
