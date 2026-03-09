"use client";

import { useState } from "react";
import { format, subDays, startOfDay } from "date-fns";
import { cs } from "date-fns/locale";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from "recharts";
import toast, { Toaster } from "react-hot-toast";
import { api } from "~/trpc/react";
import { useDeleteEgg, useUpdateEgg, useInventory, useWithdrawals } from "~/hooks/useEggs";

const COLORS = ["#8B4513", "#cbd5e1"]; // hnědá a světle šedá pro bílou

export default function StatsPage() {
    const { data: records, isLoading } = api.egg.getAll.useQuery();
    const deleteEgg = useDeleteEgg();
    const updateEgg = useUpdateEgg();
    const { data: inventory } = useInventory();
    const { data: withdrawals } = api.egg.getAllWithdrawals.useQuery();
    const { data: costData, isLoading: isCostLoading } = api.egg.getProductionCost.useQuery({ days: 30 });

    // Stavy pro inline editaci historie
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editBrown, setEditBrown] = useState<number>(0);
    const [editWhite, setEditWhite] = useState<number>(0);

    // Příprava dat
    const sortedRecords = [...(records || [])].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Data pro graf vývoje (posledních 14 dní)
    const fourteenDaysAgo = startOfDay(subDays(new Date(), 14));
    const recentRecords = sortedRecords
        .filter((r: any) => new Date(r.date) >= fourteenDaysAgo)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()); // pro graf rostoucí odleva doprava

    const chartData = recentRecords.map((r: any) => ({
        name: format(new Date(r.date), "d.M.", { locale: cs }),
        Hnědá: r.countBrown,
        Bílá: r.countWhite,
    }));

    // Celková vajíčka pro koláčový graf
    const totalBrown = sortedRecords.reduce((sum: number, r: any) => sum + r.countBrown, 0);
    const totalWhite = sortedRecords.reduce((sum: number, r: any) => sum + r.countWhite, 0);

    const pieData = [
        { name: "Hnědá (Taťka)", value: totalBrown },
        { name: "Bílá (Filip)", value: totalWhite },
    ];

    // Průměry z celku
    const totalDays = sortedRecords.length || 1;
    const avgTotal = ((totalBrown + totalWhite) / totalDays).toFixed(1);
    const avgBrown = (totalBrown / totalDays).toFixed(1);
    const avgWhite = (totalWhite / totalDays).toFixed(1);

    // Historie - mazání
    const handleDelete = async (id: string) => {
        if (!window.confirm("Opravdu chcete tento záznam smazat?")) return;
        try {
            await deleteEgg.mutateAsync(id);
            toast.success("Záznam smazán");
        } catch {
            toast.error("Chyba při mazání");
        }
    };

    // Historie - inline editace
    const handleEditStart = (r: any) => {
        setEditingId(r.id);
        setEditBrown(r.countBrown);
        setEditWhite(r.countWhite);
    };

    const handleEditSave = async (id: string) => {
        try {
            await updateEgg.mutateAsync({
                id,
                countBrown: editBrown,
                countWhite: editWhite,
            });
            toast.success("Záznam upraven");
            setEditingId(null);
        } catch {
            toast.error("Chyba při úpravě");
        }
    };

    return (
        <main className="min-h-screen bg-slate-50 p-4 pb-28 font-sans max-w-2xl mx-auto">
            <Toaster />
            <header className="mb-8 pt-6 relative border-b border-slate-200 pb-4 print:hidden">
                <h1 className="text-3xl font-black text-slate-800 tracking-tight text-center">STATISTIKY 📊</h1>
            </header>
            <div className="hidden print:block mb-8 text-center pt-6 border-b border-slate-200 pb-4">
                <h1 className="text-3xl font-black text-slate-800 tracking-tight">Slepičárna: Report (Dnes)</h1>
            </div>

            {/* Karty s průměry a ekonomikou */}
            <section className="grid grid-cols-2 gap-3 mb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-white p-4 rounded-3xl shadow-sm border-b-4 border-slate-200">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Průměr / den</div>
                    {isLoading ? (
                        <div className="h-9 w-12 bg-slate-100 rounded-lg animate-pulse mx-auto my-0.5"></div>
                    ) : (
                        <div className="text-3xl font-black text-slate-800">{avgTotal} <span className="text-sm font-bold text-slate-400">ks</span></div>
                    )}
                </div>

                <div className="bg-white p-4 rounded-3xl shadow-sm border-b-4 border-orange-200">
                    <div className="text-[10px] font-bold text-orange-400 uppercase tracking-widest mb-1">Cena za vejce</div>
                    {isCostLoading ? (
                        <div className="h-9 w-20 bg-orange-50 rounded-lg animate-pulse mx-auto my-0.5"></div>
                    ) : (
                        <div className="text-3xl font-black text-orange-600">{costData?.costPerEgg ?? 0} <span className="text-sm font-bold text-orange-400">Kč</span></div>
                    )}
                </div>

                <div className="bg-orange-50 p-4 rounded-3xl shadow-sm text-center border-b-4 border-orange-200">
                    <div className="text-[10px] font-bold text-[#8B4513]/60 uppercase tracking-widest mb-1">Hnědé (avg)</div>
                    {isLoading ? (
                        <div className="h-9 w-12 bg-orange-100/50 rounded-lg animate-pulse mx-auto my-0.5"></div>
                    ) : (
                        <div className="text-2xl font-black text-[#8B4513]">{avgBrown}</div>
                    )}
                </div>
                <div className="bg-slate-100 p-4 rounded-3xl shadow-sm text-center border-b-4 border-slate-300">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Bílé (avg)</div>
                    {isLoading ? (
                        <div className="h-9 w-12 bg-slate-200/50 rounded-lg animate-pulse mx-auto my-0.5"></div>
                    ) : (
                        <div className="text-2xl font-black text-slate-700">{avgWhite}</div>
                    )}
                </div>
            </section>

            {/* AKTUÁLNÍ SKLAD (ZÁSOBY) */}
            <section className="bg-slate-800 text-white p-6 rounded-3xl shadow-xl mb-10 flex flex-col md:flex-row justify-between items-center gap-6 animate-in fade-in duration-700">
                <div className="text-center md:text-left">
                    <h2 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Aktuální sklad (po odběrech)</h2>
                    <div className="flex items-baseline gap-2">
                        {isLoading ? (
                            <div className="h-12 w-20 bg-slate-700 rounded-xl animate-pulse my-1"></div>
                        ) : (
                            <span className="text-5xl font-black text-white">{inventory?.total ?? 0}</span>
                        )}
                        <span className="text-xl font-bold text-slate-400 uppercase tracking-tight">ks vajec</span>
                    </div>
                </div>
                <div className="flex gap-4">
                    <div className="bg-slate-700/50 px-6 py-4 rounded-2xl border border-slate-600/50 text-center min-w-[100px]">
                        <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Hnědá</span>
                        {isLoading ? (
                            <div className="h-8 w-10 bg-slate-600 rounded-lg animate-pulse mx-auto"></div>
                        ) : (
                            <span className="text-2xl font-black text-white">{inventory?.brown ?? 0}</span>
                        )}
                    </div>
                    <div className="bg-slate-700/50 px-6 py-4 rounded-2xl border border-slate-600/50 text-center min-w-[100px]">
                        <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Bílá</span>
                        {isLoading ? (
                            <div className="h-8 w-10 bg-slate-600 rounded-lg animate-pulse mx-auto"></div>
                        ) : (
                            <span className="text-2xl font-black text-white">{inventory?.white ?? 0}</span>
                        )}
                    </div>
                </div>
            </section>


            {/* Graf vývoje */}
            <section className="bg-white p-6 rounded-3xl shadow-sm mb-8 animate-in fade-in">
                <h2 className="text-xl font-bold text-slate-700 mb-6 flex items-center gap-2">
                    📈 Vývoj snůšky (14 dní)
                </h2>
                <div className="h-[250px] w-full">
                    {isLoading ? (
                        <div className="h-full w-full bg-slate-50 rounded-2xl animate-pulse flex items-end justify-around p-4">
                            <div className="w-4 bg-slate-200 rounded-t-full h-1/3"></div>
                            <div className="w-4 bg-slate-200 rounded-t-full h-1/2"></div>
                            <div className="w-4 bg-slate-200 rounded-t-full h-2/3"></div>
                            <div className="w-4 bg-slate-200 rounded-t-full h-1/2"></div>
                            <div className="w-4 bg-slate-200 rounded-t-full h-3/4"></div>
                            <div className="w-4 bg-slate-200 rounded-t-full h-1/2"></div>
                            <div className="w-4 bg-slate-200 rounded-t-full h-2/3"></div>
                        </div>
                    ) : chartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                                />
                                <Tooltip
                                    contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                    itemStyle={{ fontWeight: 'bold' }}
                                />
                                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                                <Line type="monotone" dataKey="Hnědá" stroke={COLORS[0]} strokeWidth={4} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                                <Line type="monotone" dataKey="Bílá" stroke={COLORS[1]} strokeWidth={4} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-full flex items-center justify-center text-slate-400">Málo dat pro graf</div>
                    )}
                </div>
            </section>

            {/* Koláčový graf srovnání */}
            <section className="bg-white p-6 rounded-3xl shadow-sm mb-12 animate-in fade-in">
                <h2 className="text-xl font-bold text-slate-700 mb-2 flex items-center gap-2">
                    ⚖️ Podíl produkce celkem
                </h2>
                <div className="h-[200px] w-full flex items-center justify-center relative">
                    {isLoading ? (
                        <div className="w-32 h-32 rounded-full border-8 border-slate-100 border-t-slate-200 animate-spin"></div>
                    ) : (totalBrown > 0 || totalWhite > 0) ? (
                        <>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                        itemStyle={{ fontWeight: 'bold', color: '#333' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                                <span className="text-3xl font-black text-slate-800">{totalBrown + totalWhite}</span>
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Vajec</span>
                            </div>
                        </>
                    ) : (
                        <div className="text-slate-400">Žádná data</div>
                    )}
                </div>
            </section>

            {/* Historie a Editace */}
            <section className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                <h2 className="text-xl font-bold text-slate-700 mb-4 px-2">
                    📝 Historie sběrů
                </h2>
                <div className="space-y-3">
                    {isLoading ? (
                        Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="bg-white p-4 rounded-3xl shadow-sm flex items-center justify-between border border-slate-100">
                                <div className="space-y-3 w-full">
                                    <div className="h-4 w-40 bg-slate-100 rounded animate-pulse"></div>
                                    <div className="flex gap-6">
                                        <div className="h-10 w-16 bg-slate-50 rounded-xl animate-pulse"></div>
                                        <div className="h-10 w-16 bg-slate-50 rounded-xl animate-pulse"></div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : sortedRecords.length === 0 ? (
                        <div className="text-center text-slate-400 py-8 bg-white rounded-3xl">Zatím žádné záznamy</div>
                    ) : (
                        sortedRecords.slice(0, 30).map((r) => {
                            const isEditing = editingId === r.id;

                            return (
                                <div key={r.id} className="bg-white p-4 rounded-3xl shadow-sm flex items-center justify-between border border-slate-100">
                                    <div className="flex-1">
                                        <div className="text-sm font-bold text-slate-500 mb-2">
                                            {format(new Date(r.date), "EEEE d. MMMM yyyy", { locale: cs })}
                                        </div>

                                        {isEditing ? (
                                            <div className="flex gap-4 items-center">
                                                <div className="flex items-center gap-2 bg-orange-50 px-3 py-2 rounded-xl">
                                                    <span className="text-lg">🟤</span>
                                                    <input
                                                        type="number"
                                                        value={editBrown}
                                                        onChange={(e) => setEditBrown(Number(e.target.value))}
                                                        className="w-16 text-xl font-black bg-transparent border-none text-center focus:outline-none text-[#8B4513]"
                                                        min="0"
                                                    />
                                                </div>
                                                <div className="flex items-center gap-2 bg-slate-100 px-3 py-2 rounded-xl">
                                                    <span className="text-lg">⚪️</span>
                                                    <input
                                                        type="number"
                                                        value={editWhite}
                                                        onChange={(e) => setEditWhite(Number(e.target.value))}
                                                        className="w-16 text-xl font-black bg-transparent border-none text-center focus:outline-none text-slate-700"
                                                        min="0"
                                                    />
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex gap-6 items-center">
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Hnědá</span>
                                                    <div className="text-2xl font-black text-[#8B4513]">{r.countBrown}</div>
                                                </div>
                                                <div className="w-px h-8 bg-slate-200"></div>
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Bílá</span>
                                                    <div className="text-2xl font-black text-slate-700">{r.countWhite}</div>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        {isEditing ? (
                                            <button
                                                onClick={() => handleEditSave(r.id)}
                                                disabled={updateEgg.isPending}
                                                className="p-3 bg-green-500 text-white rounded-xl shadow-sm hover:bg-green-600 transition-colors"
                                            >
                                                ✅
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => handleEditStart(r)}
                                                className="p-3 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-colors"
                                                title="Upravit záznam"
                                            >
                                                ✏️
                                            </button>
                                        )}

                                        <button
                                            onClick={() => !isEditing && handleDelete(r.id)}
                                            disabled={deleteEgg.isPending || isEditing}
                                            className={`p-3 rounded-xl transition-colors ${isEditing ? 'bg-slate-50 text-slate-300' : 'bg-red-50 text-red-500 hover:bg-red-100'}`}
                                            title="Smazat záznam"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </section>

            {/* Historie odběrů */}
            <section className="mt-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
                <h2 className="text-xl font-bold text-slate-700 mb-4 px-2 flex items-center gap-2">
                    📤 Historie odběrů
                </h2>
                <div className="space-y-3">
                    {isLoading ? (
                        Array.from({ length: 2 }).map((_, i) => (
                            <div key={i} className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 animate-pulse">
                                <div className="space-y-3">
                                    <div className="h-3 w-32 bg-slate-100 rounded"></div>
                                    <div className="h-6 w-48 bg-slate-100 rounded"></div>
                                    <div className="h-4 w-full bg-slate-50 rounded"></div>
                                </div>
                            </div>
                        ))
                    ) : !withdrawals || withdrawals.length === 0 ? (
                        <div className="text-center text-slate-400 py-8 bg-white rounded-3xl shadow-sm border border-slate-100">Zatím žádné odběry</div>
                    ) : (
                        withdrawals.map((w: any) => (
                            <div key={w.id} className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex flex-col gap-3">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">
                                            {format(new Date(w.date), "d. MMMM yyyy (HH:mm)", { locale: cs })}
                                        </div>
                                        <div className="text-lg font-black text-slate-800">
                                            {w.name || "Někdo"} si vzal {w.totalEggs} ks
                                        </div>
                                    </div>
                                    <div className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-black">
                                        {w.boxCount} {w.boxCount === 1 ? 'krabice' : w.boxCount < 5 ? 'krabice' : 'krabic'}
                                    </div>
                                </div>
                                <div className="flex gap-4 items-center pt-2 border-t border-slate-50">
                                    <div className="text-sm font-medium text-slate-500 italic">
                                        &quot;{w.thanks}&quot;
                                    </div>
                                    <div className="ml-auto flex gap-3 text-[11px] font-bold uppercase tracking-tight">
                                        <span className="text-[#8B4513]">H: {w.countBrown}</span>
                                        <span className="text-slate-400">B: {w.countWhite}</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </section>
        </main>
    );
}
