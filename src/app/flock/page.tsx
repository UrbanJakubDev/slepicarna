"use client";

import { useState } from "react";
import { format } from "date-fns";
import { cs } from "date-fns/locale";
import toast, { Toaster } from "react-hot-toast";
import { useFlock, useSaveFlock, useDeleteFlock } from "~/hooks/useFlock";
import { api } from "~/trpc/react";

export default function FlockPage() {
    const { data: flockHistory, isLoading } = useFlock();
    const saveFlock = useSaveFlock();
    const deleteFlock = useDeleteFlock();

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [count, setCount] = useState<string>("");

    const currentFlockSize = flockHistory?.[0]?.count ?? 0;

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!count) {
            toast.error("Zadejte počet slepic!");
            return;
        }

        try {
            await saveFlock.mutateAsync({
                count: Number(count),
                date: new Date(),
            });
            toast.success("Záznam uložen!");
            setCount("");
            setIsFormOpen(false);
        } catch {
            toast.error("Chyba při ukládání!");
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Opravdu chcete tento záznam smazat?")) return;
        try {
            await deleteFlock.mutateAsync(id);
            toast.success("Záznam smazán");
        } catch {
            toast.error("Chyba při mazání");
        }
    };

    return (
        <main className="min-h-screen bg-slate-50 p-4 pb-28 font-sans max-w-2xl mx-auto">
            <Toaster />
            <header className="mb-8 pt-6 relative border-b border-slate-200 pb-4">
                <h1 className="text-3xl font-black text-slate-800 tracking-tight text-center">HEJNO 🐔</h1>
            </header>

            {/* DASHBOARD KARTY */}
            <section className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-white p-6 rounded-3xl shadow-sm flex flex-col items-center border border-slate-100">
                    <span className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Aktuální počet slepic</span>
                    {isLoading ? (
                        <div className="h-14 w-24 bg-slate-200 rounded-lg animate-pulse my-1"></div>
                    ) : (
                        <span className="text-6xl font-black text-[#8B4513] drop-shadow-sm">{currentFlockSize}</span>
                    )}
                </div>
            </section>

            {/* TLAČÍTKO PRO NOVÝ ZÁZNAM */}
            {!isFormOpen ? (
                <button
                    onClick={() => setIsFormOpen(true)}
                    className="w-full py-4 mb-8 bg-slate-800 text-white rounded-[32px] font-black text-xl flex items-center justify-center gap-2 hover:bg-slate-700 active:scale-95 transition-all shadow-md"
                >
                    Aktualizovat stav hejna
                </button>
            ) : (
                /* FORMULÁŘ */
                <section className="bg-white p-6 rounded-3xl shadow-md mb-8 animate-in fade-in border border-slate-200">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-slate-800">Nový stav hejna</h2>
                        <button onClick={() => setIsFormOpen(false)} className="text-slate-400 hover:text-slate-600 text-xl">✕</button>
                    </div>

                    <form onSubmit={handleSave} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 pl-1">Počet slepic na dvoře</label>
                            <input
                                type="number"
                                value={count}
                                onChange={(e) => setCount(e.target.value)}
                                placeholder="např. 20"
                                className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl px-4 py-3 font-black text-2xl text-slate-800 focus:outline-none focus:border-[#8B4513] text-center"
                                min="0"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={saveFlock.isPending || !count}
                            className={`w-full py-4 mt-2 rounded-2xl font-black text-white shadow-lg transition-all active:translate-y-1 ${saveFlock.isPending || !count
                                ? "bg-slate-300 cursor-not-allowed"
                                : "bg-[#8B4513] hover:bg-[#A0522D]"
                                }`}
                        >
                            {saveFlock.isPending ? "UKLÁDÁM..." : "ULOŽIT ZÁZNAM"}
                        </button>
                    </form>
                </section>
            )}

            {/* HISTORIE */}
            <section className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
                <h2 className="text-xl font-bold text-slate-700 mb-4 px-2">
                    📝 Historie úprav
                </h2>

                <div className="space-y-3">
                    {isLoading ? (
                        Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="bg-white p-4 rounded-3xl shadow-sm flex items-center justify-between border border-slate-100">
                                <div className="h-4 w-32 bg-slate-100 rounded animate-pulse"></div>
                                <div className="h-6 w-16 bg-slate-100 rounded animate-pulse"></div>
                            </div>
                        ))
                    ) : (!flockHistory || flockHistory.length === 0) ? (
                        <div className="text-center text-slate-400 py-8 bg-white rounded-3xl">Zatím žádné záznamy</div>
                    ) : (
                        flockHistory.map((h) => (
                            <div key={h.id} className="bg-white p-4 rounded-3xl shadow-sm flex items-center justify-between border border-slate-100">
                                <div className="text-sm font-medium text-slate-500">
                                    {format(new Date(h.date), "d. MMMM yyyy", { locale: cs })}
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="font-black text-xl text-slate-800">
                                        {h.count} ks
                                    </div>
                                    <button
                                        onClick={() => handleDelete(h.id)}
                                        disabled={deleteFlock.isPending}
                                        className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                        title="Smazat záznam"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </section>
        </main>
    );
}
