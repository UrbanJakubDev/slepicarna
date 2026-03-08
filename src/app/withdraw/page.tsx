"use client";

import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useInventory, useWithdrawEggs } from "~/hooks/useEggs";
import { useRouter } from "next/navigation";

export default function WithdrawPage() {
    const [boxCount, setBoxCount] = useState<number | null>(null);
    const [name, setName] = useState("");
    const [thanks, setThanks] = useState("Děkuji");
    const router = useRouter();

    const { data: inventory, isLoading: isInvLoading } = useInventory();
    const withdraw = useWithdrawEggs();

    const handleWithdraw = async () => {
        if (!boxCount) {
            toast.error("Vyber počet krabiček!");
            return;
        }

        try {
            await withdraw.mutateAsync({
                boxCount,
                name: name || undefined,
                thanks,
            });
            toast.success(`Uspěšně vybráno ${boxCount * 10} vajec!`, {
                duration: 5000,
                icon: '🧺',
            });
            // Po uložení přesměrujeme na hlavní stránku nebo stats
            setTimeout(() => router.push("/"), 1500);
        } catch (error: any) {
            toast.error(error.message || "Chyba při výběru vajíček");
        }
    };

    const inventoryTotal = inventory?.total ?? 0;

    return (
        <main className="min-h-screen bg-slate-50 p-4 pb-28 font-sans max-w-md mx-auto">
            <Toaster />

            <header className="mb-8 text-center pt-6">
                <h1 className="text-3xl font-black text-slate-800 tracking-tight">VZÍT SI VAJÍČKA 🧺</h1>
                <p className="text-slate-500 mt-2 font-medium">Každá krabička má 10 kusů.</p>
            </header>

            {/* Stav skladu */}
            <section className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 mb-8 flex justify-between items-center animate-in fade-in duration-500">
                <div>
                    <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Aktuální sklad</h2>
                    {isInvLoading ? (
                        <div className="h-10 w-24 bg-slate-100 rounded-xl animate-pulse my-1"></div>
                    ) : (
                        <p className="text-3xl font-black text-slate-800">{inventoryTotal} ks</p>
                    )}
                </div>
                <div className="flex gap-4 text-right">
                    <div>
                        <span className="text-[10px] font-bold text-[#8B4513]/60 uppercase">Hnědá</span>
                        {isInvLoading ? (
                            <div className="h-5 w-8 bg-orange-50 rounded animate-pulse ml-auto"></div>
                        ) : (
                            <p className="font-bold text-[#8B4513]">{inventory?.brown ?? 0}</p>
                        )}
                    </div>
                    <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Bílá</span>
                        {isInvLoading ? (
                            <div className="h-5 w-8 bg-slate-50 rounded animate-pulse ml-auto"></div>
                        ) : (
                            <p className="font-bold text-slate-600">{inventory?.white ?? 0}</p>
                        )}
                    </div>
                </div>
            </section>

            {/* Výběr krabiček */}
            <section className="mb-10">
                <h3 className="text-lg font-bold text-slate-700 mb-4 px-2">Kolik krabiček?</h3>
                <div className="grid grid-cols-5 gap-2">
                    {[1, 2, 3, 4, 5].map((num) => (
                        <button
                            key={num}
                            onClick={() => setBoxCount(num)}
                            className={`h-16 rounded-2xl text-xl font-bold transition-all active:scale-95 border-b-4 ${boxCount === num
                                ? "bg-orange-500 text-white border-orange-700"
                                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                                }`}
                        >
                            {num}
                        </button>
                    ))}
                </div>
                {boxCount && (
                    <p className="text-center mt-3 text-orange-600 font-bold animate-in zoom-in duration-300">
                        To je dohromady {boxCount * 10} vajíček.
                    </p>
                )}
            </section>

            {/* Detaily */}
            <section className="space-y-4 mb-10">
                <div>
                    <label className="block text-sm font-bold text-slate-500 mb-1 ml-2">TVÉ JMÉNO (VOLITELNÉ)</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Kdo si bere?"
                        className="w-full p-4 rounded-2xl bg-white border-2 border-slate-100 focus:border-orange-400 focus:outline-none font-bold"
                    />
                </div>
                <div>
                    <label className="block text-sm font-bold text-slate-500 mb-1 ml-2">VZKAZ / PODĚKOVÁNÍ</label>
                    <input
                        type="text"
                        value={thanks}
                        onChange={(e) => setThanks(e.target.value)}
                        placeholder="Děkuji"
                        className="w-full p-4 rounded-2xl bg-white border-2 border-slate-100 focus:border-orange-400 focus:outline-none font-bold"
                    />
                </div>
            </section>

            <div className="mt-8">
                <button
                    onClick={handleWithdraw}
                    disabled={!boxCount || withdraw.isPending || inventoryTotal < (boxCount * 10)}
                    className={`w-full py-6 rounded-3xl text-2xl font-black shadow-xl transition-all active:translate-y-1 active:shadow-lg flex items-center justify-center gap-3 ${boxCount && !withdraw.isPending && inventoryTotal >= (boxCount * 10)
                        ? "bg-orange-500 text-white hover:bg-orange-600 shadow-orange-200"
                        : "bg-slate-300 text-slate-400 cursor-not-allowed"
                        }`}
                >
                    {withdraw.isPending ? "VYBÍRÁM..." : "VZÍT SI VAJÍČKA 📤"}
                </button>
                {boxCount && inventoryTotal < (boxCount * 10) && (
                    <p className="text-red-500 text-center mt-2 text-sm font-bold">Bohužel nemáme tolik vajec na skladě.</p>
                )}
            </div>
        </main>
    );
}
