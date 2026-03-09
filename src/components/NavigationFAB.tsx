"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavigationFAB() {
    const [isOpen, setIsOpen] = useState(false);
    const [isRendered, setIsRendered] = useState(false);
    const pathname = usePathname();

    // Efekt pro plynulé zavírání – počkáme na konec animace, než element reálně odstraníme z DOMu
    useEffect(() => {
        if (isOpen) {
            setIsRendered(true);
        } else {
            const timeout = setTimeout(() => setIsRendered(false), 200);
            return () => clearTimeout(timeout);
        }
    }, [isOpen]);

    // Skryjeme na login stránce
    if (pathname === "/login") return null;

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            {/* Menu items */}
            {isRendered && (
                <div
                    className={`mb-4 right-0 flex flex-col gap-3 origin-bottom-right transition-all duration-200 ${isOpen ? "scale-100 opacity-100" : "scale-50 opacity-0 pointer-events-none"
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
                        href="/withdraw"
                        onClick={() => setIsOpen(false)}
                        className="bg-white text-slate-700 shadow-xl rounded-full p-4 flex items-center justify-center gap-3 font-bold hover:bg-slate-50 transition-colors border border-slate-100"
                    >
                        <span className="text-xl">📤</span>
                        <span>Vzít si</span>
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
            )}

            {/* Main FAB Toggle */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-16 h-16 bg-accent text-white rounded-full shadow-2xl flex items-center justify-center text-3xl  z-50 focus:outline-none transition-all duration-300 active:scale-95"
            >
                <span className={`transition-transform duration-300 transform ${isOpen ? "rotate-90" : "rotate-0"}`}>
                    {isOpen ? "✕" : "🧭"}
                </span>
            </button>

            {/* Backdrop pro kliknutí mimo */}
            {isRendered && (
                <div
                    className={`fixed inset-0 bg-slate-900/40 z-[-1] transition-opacity duration-200 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                        }`}
                    onClick={() => setIsOpen(false)}
                />
            )}
        </div>
    );
}
