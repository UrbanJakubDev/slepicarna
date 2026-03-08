"use client";

import { useState } from "react";
import { format } from "date-fns";
import { cs } from "date-fns/locale";
import toast, { Toaster } from "react-hot-toast";
import { api } from "~/trpc/react";
import { useCreateTransaction, useDeleteTransaction, useTransactions } from "~/hooks/useTransactions";

export default function FinancePage() {
    const { data: records, isLoading: isEggsLoading } = api.egg.getAll.useQuery();
    const { data: transactions, isLoading: isTransactionsLoading } = useTransactions();
    const createTransaction = useCreateTransaction();
    const deleteTransaction = useDeleteTransaction();

    const [type, setType] = useState<"SALE" | "EXPENSE">("SALE");
    const [amount, setAmount] = useState<string>("");
    const [quantity, setQuantity] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [isFormOpen, setIsFormOpen] = useState(false);

    const isLoading = isEggsLoading || isTransactionsLoading;

    // --- Výpočty skladu ---
    const totalLaid = (records || []).reduce((sum, r) => sum + r.countBrown + r.countWhite, 0);
    const totalSold = (transactions || []).filter(t => t.type === "SALE").reduce((sum, t) => sum + (t.quantity || 0), 0);

    // Tohle je jen prostý rozdíl – "zbytek" co leží v lednici nebo se už snědl rodinou
    const remainingEggs = totalLaid - totalSold;

    // --- Výpočty ROI ---
    const totalIncome = (transactions || []).filter(t => t.type === "SALE").reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = (transactions || []).filter(t => t.type === "EXPENSE").reduce((sum, t) => sum + t.amount, 0);
    const roi = totalIncome - totalExpense;

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!amount) {
            toast.error("Zadejte částku!");
            return;
        }

        try {
            await createTransaction.mutateAsync({
                type,
                amount: Number(amount),
                quantity: quantity ? Number(quantity) : undefined,
                description: description || undefined,
            });
            toast.success("Transakce uložena!");
            setAmount("");
            setQuantity("");
            setDescription("");
            setIsFormOpen(false);
        } catch {
            toast.error("Chyba při ukládání!");
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Opravdu chcete tento záznam smazat?")) return;
        try {
            await deleteTransaction.mutateAsync(id);
            toast.success("Záznam smazán");
        } catch {
            toast.error("Chyba při mazání");
        }
    };

    const getTransactionIcon = (tType: string) => tType === "SALE" ? "📈" : "📉";
    const getTransactionColor = (tType: string) => tType === "SALE" ? "text-green-600" : "text-red-500";
    const getTransactionBg = (tType: string) => tType === "SALE" ? "bg-green-50" : "bg-red-50";

    return (
        <main className="min-h-screen bg-slate-50 p-4 pb-28 font-sans max-w-2xl mx-auto">
            <Toaster />
            <header className="mb-8 pt-6 relative border-b border-slate-200 pb-4">
                <h1 className="text-3xl font-black text-slate-800 tracking-tight text-center">FINANCE 💰</h1>
            </header>

            {/* DASHBOARD KARTY */}
            <section className="grid grid-cols-2 gap-4 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-white p-5 rounded-3xl shadow-sm flex flex-col items-center border border-slate-100">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Virtuální Sklad</span>
                    {isLoading ? (
                        <div className="h-10 w-16 bg-slate-200 rounded-lg animate-pulse my-1"></div>
                    ) : (
                        <span className="text-4xl font-black text-slate-800">{remainingEggs}</span>
                    )}
                    <span className="text-xs text-slate-400 mt-1 text-center">vajec v lednici (nebo snězeno)</span>
                </div>

                <div className={`p-5 rounded-3xl shadow-sm flex flex-col items-center border ${isLoading ? 'bg-slate-50 border-slate-100' : roi >= 0 ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'}`}>
                    <span className={`text-xs font-bold uppercase tracking-widest mb-1 ${isLoading ? 'text-slate-400' : roi >= 0 ? 'text-green-600/60' : 'text-red-500/60'}`}>Zisk / Ztráta</span>
                    {isLoading ? (
                        <div className="h-10 w-24 bg-slate-200 rounded-lg animate-pulse my-1"></div>
                    ) : (
                        <span className={`text-4xl font-black ${roi >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                            {roi > 0 ? '+' : ''}{roi} Kč
                        </span>
                    )}
                    <div className="flex gap-2 text-xs mt-1 w-full justify-center">
                        {isLoading ? (
                            <div className="h-4 w-28 bg-slate-200 rounded animate-pulse"></div>
                        ) : (
                            <>
                                <span className="text-green-600">+{totalIncome}</span>
                                <span className="text-slate-300">|</span>
                                <span className="text-red-500">-{totalExpense}</span>
                            </>
                        )}
                    </div>
                </div>
            </section>

            {/* TLAČÍTKO PRO NOVOU TRANSAKCI */}
            {!isFormOpen ? (
                <button
                    onClick={() => setIsFormOpen(true)}
                    className="w-full py-4 mb-8 bg-slate-800 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-700 active:scale-95 transition-all shadow-md"
                >
                    <span>➕</span> Přidat transakci
                </button>
            ) : (
                /* FORMULÁŘ TRANSAKCE */
                <section className="bg-white p-6 rounded-3xl shadow-md mb-8 animate-in fade-in border border-slate-200">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-slate-800">Nová transakce</h2>
                        <button onClick={() => setIsFormOpen(false)} className="text-slate-400 hover:text-slate-600 text-xl">✕</button>
                    </div>

                    <form onSubmit={handleSave} className="space-y-4">
                        <div className="flex bg-slate-100 p-1 rounded-2xl">
                            <button
                                type="button"
                                onClick={() => setType("SALE")}
                                className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${type === "SALE" ? "bg-white text-green-600 shadow-sm" : "text-slate-500"}`}
                            >
                                Prodej vajec
                            </button>
                            <button
                                type="button"
                                onClick={() => setType("EXPENSE")}
                                className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${type === "EXPENSE" ? "bg-white text-red-500 shadow-sm" : "text-slate-500"}`}
                            >
                                Náklad (krmivo atd.)
                            </button>
                        </div>

                        {type === "SALE" && (
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 pl-1">Počet prodaných vajec</label>
                                <input
                                    type="number"
                                    value={quantity}
                                    onChange={(e) => setQuantity(e.target.value)}
                                    placeholder="např. 30"
                                    className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl px-4 py-3 font-bold text-slate-800 focus:outline-none focus:border-slate-400"
                                />
                            </div>
                        )}

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 pl-1">Částka (Kč)</label>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="např. 150"
                                className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl px-4 py-3 font-bold text-slate-800 focus:outline-none focus:border-slate-400"
                                min="0"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 pl-1">Poznámka (nepovinné)</label>
                            <input
                                type="text"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder={type === "SALE" ? "Soused Novák" : "Pšenice 50kg"}
                                className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl px-4 py-3 font-medium text-slate-800 focus:outline-none focus:border-slate-400"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={createTransaction.isPending || !amount}
                            className={`w-full py-4 mt-2 rounded-2xl font-black text-white shadow-lg transition-all active:translate-y-1 ${createTransaction.isPending || !amount
                                ? "bg-slate-300 cursor-not-allowed"
                                : type === "SALE" ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"
                                }`}
                        >
                            {createTransaction.isPending ? "UKLÁDÁM..." : "ULOŽIT ZÁZNAM"}
                        </button>
                    </form>
                </section>
            )}

            {/* HISTORIE TRANSAKCÍ */}
            <section className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
                <h2 className="text-xl font-bold text-slate-700 mb-4 px-2">
                    📝 Poslední záznamy
                </h2>

                <div className="space-y-3">
                    {isLoading ? (
                        Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="bg-white p-4 rounded-3xl shadow-sm flex items-center justify-between border border-slate-100">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-slate-100 animate-pulse"></div>
                                    <div className="space-y-2">
                                        <div className="h-4 w-20 bg-slate-100 rounded animate-pulse"></div>
                                        <div className="h-3 w-28 bg-slate-50 rounded animate-pulse"></div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="h-6 w-16 bg-slate-100 rounded animate-pulse"></div>
                                    <div className="w-8 h-8 rounded-xl bg-slate-50 animate-pulse"></div>
                                </div>
                            </div>
                        ))
                    ) : (!transactions || transactions.length === 0) ? (
                        <div className="text-center text-slate-400 py-8 bg-white rounded-3xl">Zatím žádné transakce</div>
                    ) : (
                        transactions.slice(0, 30).map((t) => (
                            <div key={t.id} className="bg-white p-4 rounded-3xl shadow-sm flex items-center justify-between border border-slate-100">
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl ${getTransactionBg(t.type)}`}>
                                        {getTransactionIcon(t.type)}
                                    </div>
                                    <div>
                                        <div className="font-bold text-slate-800">
                                            {t.type === "SALE" ? "Prodej" : "Náklad"}
                                            {t.quantity && t.type === "SALE" && <span className="text-slate-500 font-normal ml-1">({t.quantity} ks)</span>}
                                        </div>
                                        <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                                            <span>{format(new Date(t.date), "d. MMMM yyyy", { locale: cs })}</span>
                                            {t.description && (
                                                <>
                                                    <span>•</span>
                                                    <span className="truncate max-w-[120px]">{t.description}</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className={`font-black text-lg ${getTransactionColor(t.type)}`}>
                                        {t.type === "SALE" ? "+" : "-"}{t.amount} Kč
                                    </div>
                                    <button
                                        onClick={() => handleDelete(t.id)}
                                        disabled={deleteTransaction.isPending}
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
