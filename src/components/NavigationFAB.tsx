"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavigationFAB() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    // Skryjeme na login stránce
    if (pathname === "/login") return null;

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
            {/* Menu items */}
            <div
                className={`flex flex-col gap-3 transition-all duration-300 origin-bottom ${isOpen ? "scale-100 opacity-100" : "scale-0 opacity-0 pointer-events-none"
                    }`}
            >
                <Link
                    href="/finance"
                    onClick={() => setIsOpen(false)}
                    className="bg-white text-slate-700 shadow-xl rounded-full p-4 flex items-center justify-center gap-3 font-bold hover:bg-slate-50 transition-colors border border-slate-100"
                >
                    <span className="text-xl">💰</span>
                    <span>Finance</span>
                </Link>
                <Link
                    href="/stats"
                    onClick={() => setIsOpen(false)}
                    className="bg-white text-slate-700 shadow-xl rounded-full p-4 flex items-center justify-center gap-3 font-bold hover:bg-slate-50 transition-colors border border-slate-100"
                >
                    <span className="text-xl">📊</span>
                    <span>Statistiky</span>
                </Link>
                <Link
                    href="/"
                    onClick={() => setIsOpen(false)}
                    className="bg-white text-slate-700 shadow-xl rounded-full p-4 flex items-center justify-center gap-3 font-bold hover:bg-slate-50 transition-colors border border-slate-100"
                >
                    <span className="text-xl">🧺</span>
                    <span>Sběr</span>
                </Link>
            </div>

            {/* Main FAB Toggle */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-16 h-16 bg-slate-800 text-white rounded-full shadow-2xl flex items-center justify-center text-2xl hover:bg-slate-700 transition-all active:scale-95 z-50 focus:outline-none"
            >
                {isOpen ? "✕" : "🧭"}
            </button>

            {/* Backdrop pro kliknutí mimo */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/10 z-[-1] animate-in fade-in"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </div>
    );
}
