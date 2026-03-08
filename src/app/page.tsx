"use client";

import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { format } from "date-fns";
import { cs } from "date-fns/locale";
import { useSaveEgg } from "~/hooks/useEggs";
import { api } from "~/trpc/react";

export default function EggTrackerPage() {
  const [brown, setBrown] = useState<number | null>(null);
  const [white, setWhite] = useState<number | null>(null);

  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);

  const saveEgg = useSaveEgg();
  const { data: records } = api.egg.getAll.useQuery();

  // Prefill pokud už existuje záznam pro daný den
  useEffect(() => {
    if (records) {
      // records.date je dateTime string z databáze
      const recordForDate = records.find(r => new Date(r.date).toISOString().split('T')[0] === selectedDate);
      if (recordForDate) {
        setBrown(recordForDate.countBrown);
        setWhite(recordForDate.countWhite);
      } else {
        setBrown(null);
        setWhite(null);
      }
    }
  }, [selectedDate, records]);

  const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12];

  const handleSave = async () => {
    if (brown === null || white === null) {
      toast.error("Vyber počet pro oba druhy!");
      return;
    }

    try {
      await saveEgg.mutateAsync({
        countBrown: brown,
        countWhite: white,
        date: new Date(selectedDate),
      });
      toast.success(`Uloženo! Hnědá: ${brown}, Bílá: ${white}`, {
        duration: 4000,
        position: 'top-center',
        icon: '🧺',
      });
      // Necháme buttony svítit, ale kdybychom překlikli den, tak se to zresetuje (useEffect)
    } catch (error) {
      toast.error("Chyba při ukládání!");
    }
  };

  const isToday = selectedDate === todayStr;
  const displayDate = isToday ? "Dnes" : format(new Date(selectedDate), "d. MMMM yyyy", { locale: cs });

  return (
    <main className="min-h-screen bg-slate-50 p-4 pb-28 font-sans max-w-md mx-auto">
      <Toaster />
      <header className="mb-8 text-center pt-6 relative">
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">SLEPIČÁRNA 🥚</h1>
        <div className="mt-2 flex justify-center relative">
          <div className="bg-orange-100 text-orange-800 font-bold px-4 py-1.5 rounded-full flex items-center justify-center gap-2 pointer-events-none">
            📅 {displayDate} ▾
          </div>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            max={todayStr}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>
      </header>

      {/* SEKCE HNĚDÁ (Taťka) */}
      <section className="mb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex justify-between items-end mb-4 px-2">
          <h2 className="text-xl font-bold text-[#8B4513]">🟤 HNĚDÁ (Taťka)</h2>
          <div className="flex flex-col items-end">
            <span className="text-xs font-bold text-[#8B4513]/60 uppercase tracking-widest">Počet</span>
            <div className="flex items-center gap-3">
              <span className="text-5xl font-black text-[#8B4513] leading-none">{brown ?? '?'}</span>
              {(brown ?? 0) > 0 && (
                <button
                  onClick={() => setBrown(0)}
                  className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-md hover:bg-orange-200"
                >
                  Reset
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {numbers.map((n) => (
            <button
              key={n}
              onClick={() => setBrown((prev) => (prev ?? 0) + n)}
              className="h-16 rounded-2xl text-xl font-bold transition-all active:scale-95 bg-orange-100 text-[#8B4513] border-b-4 border-orange-200 hover:bg-orange-200"
            >
              +{n}
            </button>
          ))}
        </div>
      </section>

      {/* SEKCE BÍLÁ (Filip) */}
      <section className="mb-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="flex justify-between items-end mb-4 px-2">
          <h2 className="text-xl font-bold text-slate-600">⚪️ BÍLÁ (Filip)</h2>
          <div className="flex flex-col items-end">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Počet</span>
            <div className="flex items-center gap-3">
              <span className="text-5xl font-black text-slate-800 leading-none">{white ?? '?'}</span>
              {(white ?? 0) > 0 && (
                <button
                  onClick={() => setWhite(0)}
                  className="text-xs bg-slate-200 text-slate-600 px-2 py-1 rounded-md hover:bg-slate-300"
                >
                  Reset
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {numbers.map((n) => (
            <button
              key={n}
              onClick={() => setWhite((prev) => (prev ?? 0) + n)}
              className="h-16 rounded-2xl text-xl font-bold transition-all active:scale-95 bg-white text-slate-600 border-b-4 border-slate-200 shadow-sm hover:bg-slate-50"
            >
              +{n}
            </button>
          ))}
        </div>
      </section>

      {/* HLAVNÍ AKCE */}
      <div className="fixed bottom-6 left-4 right-4 max-w-md mx-auto">
        <button
          onClick={handleSave}
          disabled={brown === null || white === null || saveEgg.isPending}
          className={`w-3/4 py-6 rounded-[2rem] text-2xl font-black shadow-2xl transition-all active:translate-y-1 active:shadow-lg flex items-center justify-center gap-3 ${brown !== null && white !== null && !saveEgg.isPending
            ? "bg-green-500 text-white hover:bg-green-600"
            : "bg-slate-300 text-slate-400 cursor-not-allowed"
            }`}
        >
          {saveEgg.isPending ? "UKLÁDÁM..." : "ULOŽIT SBĚR 🧺"}
        </button>
      </div>
    </main>
  );
}
