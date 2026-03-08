'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import { loginWithPin } from '~/app/actions/auth';

export default function LoginPage() {
    const [pin, setPin] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (pin.length !== 4) {
            toast.error('PIN musí mít 4 číslice');
            return;
        }

        setIsLoading(true);

        try {
            const result = await loginWithPin(pin);

            if (result.success) {
                toast.success('Přihlášení úspěšné!', { duration: 2000 });
                router.push('/');
            } else {
                toast.error(result.error || 'Nesprávný PIN');
                setPin(''); // Reset PIN on error
            }
        } catch (error) {
            toast.error('Chyba při přihlašování');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 font-sans">
            <Toaster />

            <div className="w-full max-w-sm bg-white rounded-3xl shadow-xl p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="text-center space-y-2">
                    <div className="text-6xl mb-4">🥚</div>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight">Vstup povolen?</h1>
                    <p className="text-slate-500 font-medium">Zadejte tajný kód pro přístup k datům o vajíčkách.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2 text-center">
                        {/* Native number input, pattern matches exact 4 digits to show number keyboard on ios/android */}
                        <input
                            type="password"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            maxLength={4}
                            value={pin}
                            onChange={(e) => {
                                const val = e.target.value.replace(/[^0-9]/g, '');
                                if (val.length <= 4) setPin(val);
                            }}
                            disabled={isLoading}
                            className="w-full text-center text-5xl font-black text-slate-800 bg-slate-100 border-2 border-slate-200 rounded-2xl py-4 focus:outline-none focus:border-orange-400 focus:bg-white transition-all tracking-[0.5em]"
                            placeholder="••••"
                            autoFocus
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={pin.length !== 4 || isLoading}
                        className={`w-full py-4 rounded-2xl text-xl font-black shadow-lg transition-all active:translate-y-1 flex items-center justify-center ${pin.length === 4 && !isLoading
                                ? "bg-orange-500 text-white hover:bg-orange-600 active:shadow-md"
                                : "bg-slate-200 text-slate-400 cursor-not-allowed"
                            }`}
                    >
                        {isLoading ? "OVĚŘUJI..." : "VSTOUPIT 🚀"}
                    </button>
                </form>
            </div>
        </main>
    );
}
