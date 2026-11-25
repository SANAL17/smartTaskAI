
"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface LogoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export default function LogoutModal({
    isOpen,
    onClose,
    onConfirm,
}: LogoutModalProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Close modal with Escape key
    useEffect(() => {
        if (!isOpen) return;

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") onClose();
        };

        window.addEventListener("keydown", handleEscape);

        return () => {
            window.removeEventListener("keydown", handleEscape);
        };
    }, [isOpen, onClose]);

    if (!mounted || !isOpen) return null;

    return createPortal(
        <div
            className="fixed inset-0 z-[99999] flex items-center justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm sm:p-6"
            onMouseDown={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div className="relative my-auto w-full max-w-[calc(100%-8px)] rounded-2xl border border-white/10 bg-[#151521] p-5 shadow-2xl shadow-black/50 sm:max-w-sm sm:p-6 md:rounded-3xl">

                {/* Warning Icon */}
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-500/15 sm:h-14 sm:w-14">
                    <svg
                        className="h-6 w-6 text-red-400 sm:h-7 sm:w-7"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.8}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 9v3m0 4h.01M10.3 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.7 3.86a2 2 0 0 0-3.4 0Z"
                        />
                    </svg>
                </div>

                {/* Message */}
                <div className="text-center">
                    <h2 className="text-lg font-semibold text-white sm:text-xl">
                        Confirm Logout?
                    </h2>

                    <p className="mx-auto mt-2 max-w-[280px] text-xs leading-6 text-gray-400 sm:text-sm">
                        Are you sure you want to log out?
                        You will need to sign in again to access your account.
                    </p>
                </div>

                {/* Buttons */}
                <div className="mt-6 flex flex-col-reverse gap-2.5 sm:mt-7 sm:flex-row sm:gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="min-h-11 flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-gray-300 transition hover:bg-white/10 active:scale-[0.98]"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={onConfirm}
                        className="min-h-11 flex-1 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-red-500/20 transition hover:brightness-110 active:scale-[0.98]"
                    >
                        Yes, Logout
                    </button>
                </div>

            </div>
        </div>,
        document.body
    );
}
