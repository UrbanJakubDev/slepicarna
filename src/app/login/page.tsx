'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import toast, { Toaster } from 'react-hot-toast';
import { loginWithPin } from '~/app/actions/auth';
import Whisk from '../../../public/images/Whisk_eed57d3d88da7899bd9466b9401b07c5eg.png';

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
        <main className="min-h-screen relative flex flex-col items-center justify-center p-4 font-sans overflow-hidden">
            {/* Background Image */}
            <Image
                src={Whisk}
                alt="Poultry farm background"
                fill
                priority
                className="z-0 object-cover"
                style={{ filter: "brightness(0.85)" }}
            />
            {/* Soft Overlay for readability */}
            <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/10 via-transparent to-black/30" />

            <Toaster />

            <div className="w-full max-w-sm relative z-20 bg-white/50 backdrop-blur-xl rounded-[40px] shadow-2xl p-10 space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 border border-white/40">
                <div className="text-center space-y-3">
                    <div className="text-7xl mb-6 inline-block drop-shadow-sm animate-bounce">🥚</div>
                    <h1 className="text-4xl font-black text-slate-800 tracking-tight leading-tight">Vstup povolen?</h1>
                    <p className="text-slate-600 font-bold leading-relaxed">
                        Zadejte tajný kód pro přístup <br />k datům o vajíčkách.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="space-y-2 text-center">
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
                            className="w-full text-center text-5xl font-black text-slate-800 bg-white/50 border-2 border-white/80 rounded-3xl py-6 focus:outline-none focus:border-primary focus:bg-white transition-all tracking-[0.5em] shadow-inner"
                            placeholder="••••"
                            autoFocus
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={pin.length !== 4 || isLoading}
                        className={`w-full py-5 rounded-3xl text-xl font-black shadow-xl transition-all active:translate-y-1 flex items-center justify-center border-b-4 ${pin.length === 4 && !isLoading
                            ? "bg-primary text-white border-primary/20 hover:brightness-110 active:shadow-md shadow-primary/20"
                            : "bg-slate-200 text-slate-400 border-slate-300 cursor-not-allowed shadow-none"
                            }`}
                    >
                        {isLoading ? (
                            <div className="flex items-center gap-2">
                                <span className="animate-spin text-2xl">🌾</span> OVĚŘUJI...
                            </div>
                        ) : (
                            "VSTOUPIT"
                        )}
                    </button>
                </form>
            </div>

            {/* Branding badge */}
            <div className="absolute bottom-10 z-20 px-4 py-2 bg-white/20 backdrop-blur-md rounded-full border border-white/30 text-white/80 font-bold text-[10px] tracking-widest uppercase">
                Slepičárna v0.1 • Modern Country Edition
            </div>
        </main>
    );
}
