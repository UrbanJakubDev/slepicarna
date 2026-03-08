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
import { useDeleteEgg, useUpdateEgg } from "~/hooks/useEggs";

const COLORS = ["#8B4513", "#cbd5e1"]; // hnědá a světle šedá pro bílou

export default function StatsPage() {
    const { data: records, isLoading } = api.egg.getAll.useQuery();
    const deleteEgg = useDeleteEgg();
    const updateEgg = useUpdateEgg();

    // Stavy pro inline editaci historie
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editBrown, setEditBrown] = useState<number>(0);
    const [editWhite, setEditWhite] = useState<number>(0);

    if (isLoading) {
        return <div className="p-8 text-center text-slate-500 font-medium animate-pulse">Načítám statistiky...</div>;
    }

    // Příprava dat
    const sortedRecords = [...(records || [])].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Data pro graf vývoje (posledních 14 dní)
    const fourteenDaysAgo = startOfDay(subDays(new Date(), 14));
    const recentRecords = sortedRecords
        .filter(r => new Date(r.date) >= fourteenDaysAgo)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()); // pro graf rostoucí odleva doprava

    const chartData = recentRecords.map(r => ({
        name: format(new Date(r.date), "d.M.", { locale: cs }),
        Hnědá: r.countBrown,
        Bílá: r.countWhite,
    }));

    // Celková vajíčka pro koláčový graf
    const totalBrown = sortedRecords.reduce((sum, r) => sum + r.countBrown, 0);
    const totalWhite = sortedRecords.reduce((sum, r) => sum + r.countWhite, 0);

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
                <div className="absolute top-6 right-2">
                    <button
                        onClick={() => window.print()}
                        className="text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-full font-bold transition-all flex items-center gap-2"
                        title="Exportovat PDF"
                    >
                        📄 Export
                    </button>
                </div>
                <h1 className="text-3xl font-black text-slate-800 tracking-tight text-center">STATISTIKY 📊</h1>
            </header>
            <div className="hidden print:block mb-8 text-center pt-6 border-b border-slate-200 pb-4">
                <h1 className="text-3xl font-black text-slate-800 tracking-tight">Slepičárna: Report (Dnes)</h1>
            </div>

            {/* Karty s průměry */}
            <section className="grid grid-cols-3 gap-3 mb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-white p-4 rounded-3xl shadow-sm text-center border-b-4 border-slate-200">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Průměr / den</div>
                    <div className="text-3xl font-black text-slate-800">{avgTotal}</div>
                </div>
                <div className="bg-orange-50 p-4 rounded-3xl shadow-sm text-center border-b-4 border-orange-200">
                    <div className="text-xs font-bold text-[#8B4513]/60 uppercase tracking-widest mb-1">Hnědé</div>
                    <div className="text-3xl font-black text-[#8B4513]">{avgBrown}</div>
                </div>
                <div className="bg-slate-100 p-4 rounded-3xl shadow-sm text-center border-b-4 border-slate-300">
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Bílé</div>
                    <div className="text-3xl font-black text-slate-700">{avgWhite}</div>
                </div>
            </section>

            {/* Graf vývoje */}
            <section className="bg-white p-6 rounded-3xl shadow-sm mb-8 animate-in fade-in">
                <h2 className="text-xl font-bold text-slate-700 mb-6 flex items-center gap-2">
                    📈 Vývoj snůšky (14 dní)
                </h2>
                <div className="h-[250px] w-full">
                    {chartData.length > 0 ? (
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
                    {(totalBrown > 0 || totalWhite > 0) ? (
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
                    {sortedRecords.length === 0 ? (
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
        </main>
    );
}
