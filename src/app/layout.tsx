
import type { Metadata } from "next";
import "./globals.css";
import AuthWrapper from "./AuthWrapper";
import { Toaster } from "sonner";

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
                <AuthWrapper>
                    {children}
                    <Toaster
                        position="top-center"
                        richColors
                        closeButton
                        duration={2000}
                    />
                </AuthWrapper>
            </body>
        </html>
    );
}
