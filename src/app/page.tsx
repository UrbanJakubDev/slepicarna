"use client";

import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { format, subDays, addDays } from "date-fns";
import { cs } from "date-fns/locale";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSaveEgg } from "~/hooks/useEggs";
import { api } from "~/trpc/react";
import Whisk from "../../public/images/Whisk_eed57d3d88da7899bd9466b9401b07c5eg.png";

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

  const handlePrevDay = () => {
    setSelectedDate(prev => {
      const d = new Date(prev);
      d.setMinutes(d.getMinutes() + d.getTimezoneOffset() * -1); // prevent UTC jumping issues
      return subDays(d, 1).toISOString().split('T')[0];
    });
  };

  const handleNextDay = () => {
    setSelectedDate(prev => {
      const d = new Date(prev);
      d.setMinutes(d.getMinutes() + d.getTimezoneOffset() * -1); // prevent UTC jumping issues
      return addDays(d, 1).toISOString().split('T')[0];
    });
  };

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
    <>
      {/* Background Image Parallax Layer */}
      <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
        <Image
          src={Whisk}
          alt="Farm background"
          fill
          quality={90}
          className="object-cover"
        />
        {/* Softening overlay so content remains readable */}
        <div className="absolute inset-0 bg-white/65 backdrop-blur-md" />
      </div>

      <main className="min-h-screen p-4 pb-20 font-sans max-w-md mx-auto relative z-10">
        <Toaster />
        <header className="mb-10 text-center pt-8 relative">
          <h1 className="text-4xl font-black text-slate-800 tracking-tightest mb-2">SLEPIČÁRNA</h1>
          <p className="text-xs font-bold text-slate-700 uppercase tracking-widest mb-6 italic">Moderní kurník v kapse 🧺</p>

          <div className="flex items-center justify-center gap-2 relative z-20">
            <button
              onClick={handlePrevDay}
              className="w-12 h-12 flex items-center justify-center bg-white/70 hover:bg-white text-slate-700 rounded-full border-2 border-white/60 shadow-sm transition-all active:scale-95"
              title="Předchozí den"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <div className="flex justify-center relative">
              <div className="bg-white/70 text-primary font-black px-6 py-2.5 rounded-full flex items-center justify-center gap-2 border-2 border-white/60 shadow-sm transition-all active:scale-95 min-w-[150px]">
                <span className="text-lg">📅</span> {displayDate}
              </div>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                max={todayStr}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>

            {!isToday ? (
              <button
                onClick={handleNextDay}
                className="w-12 h-12 flex items-center justify-center bg-white/70 hover:bg-white text-slate-700 rounded-full border-2 border-white/60 shadow-sm transition-all active:scale-95"
                title="Následující den"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            ) : (
              <div className="w-12 h-12 opacity-0 pointer-events-none" />
            )}
          </div>
        </header>

        {/* SEKCE HNĚDÁ (Taťka) */}
        <section className="mb-10 animate-in fade-in slide-in-from-bottom-4 duration-500 bg-white/70 p-5 rounded-[40px] border border-white shadow-sm">
          <div className="flex justify-between items-end mb-6 px-2">
            <h2 className="text-xl font-bold text-[#8B4513] tracking-tight">🟤 HNĚDÁ</h2>
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-bold text-[#8B4513]/60 uppercase tracking-widest mb-1">Dnes sebráno</span>
              <div className="flex items-center gap-3">
                <span className="text-6xl font-black text-[#8B4513] leading-none drop-shadow-sm">{brown ?? '0'}</span>
                {(brown ?? 0) > 0 && (
                  <button
                    onClick={() => setBrown(0)}
                    className="w-10 h-10 flex items-center justify-center bg-orange-100 text-[#8B4513] rounded-full hover:bg-orange-200 transition-colors shadow-inner"
                    title="Reset"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-2.5">
            {numbers.map((n) => (
              <button
                key={n}
                onClick={() => setBrown((prev) => (prev ?? 0) + n)}
                className="h-16 rounded-3xl text-xl font-black transition-all active:scale-90 bg-orange-50 text-[#8B4513] border-b-4 border-orange-200 hover:bg-orange-100 active:border-b-0 active:translate-y-1"
              >
                +{n}
              </button>
            ))}
          </div>
        </section>

        {/* SEKCE BÍLÁ (Filip) */}
        <section className="mb-12 animate-in fade-in slide-in-from-bottom-8 duration-700 bg-white/70 p-5 rounded-[40px] border border-white shadow-sm">
          <div className="flex justify-between items-end mb-6 px-2">
            <h2 className="text-xl font-bold text-slate-600 tracking-tight">⚪️ BÍLÁ</h2>
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-bold text-slate-700 uppercase tracking-widest mb-1">Dnes sebráno</span>
              <div className="flex items-center gap-3">
                <span className="text-6xl font-black text-slate-800 leading-none drop-shadow-sm">{white ?? '0'}</span>
                {(white ?? 0) > 0 && (
                  <button
                    onClick={() => setWhite(0)}
                    className="w-10 h-10 flex items-center justify-center bg-slate-100 text-slate-600 rounded-full hover:bg-slate-200 transition-colors shadow-inner"
                    title="Reset"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-2.5">
            {numbers.map((n) => (
              <button
                key={n}
                onClick={() => setWhite((prev) => (prev ?? 0) + n)}
                className="h-16 rounded-3xl text-xl font-black transition-all active:scale-90 bg-white text-slate-600 border-b-4 border-slate-200 shadow-sm hover:bg-slate-50 active:border-b-0 active:translate-y-1"
              >
                +{n}
              </button>
            ))}
          </div>
        </section>

        {/* HLAVNÍ AKCE */}
        <div className="mt-8 mb-4 flex justify-center">
          <button
            onClick={handleSave}
            disabled={(brown === null && white === null) || saveEgg.isPending}
            className={`w-full max-w-[280px] py-6 rounded-[32px] text-2xl font-black shadow-2xl transition-all active:translate-y-1 active:shadow-xl flex items-center justify-center gap-3 border-b-8 ${brown !== null && white !== null && !saveEgg.isPending
              ? "bg-primary text-white border-primary/20 hover:brightness-110 shadow-primary/30"
              : "bg-slate-200 text-slate-400 border-slate-300 cursor-not-allowed shadow-none"
              }`}
          >
            {saveEgg.isPending ? "UKLÁDÁM..." : "ULOŽIT SBĚR 🧺"}
          </button>
        </div>
      </main>
    </>
  );
}
