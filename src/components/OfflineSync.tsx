"use client";

import { useEffect } from "react";
import toast from "react-hot-toast";
import { api } from "~/trpc/react";

export type OfflineEggRecord = {
    id: string; // lokální ID
    countBrown: number;
    countWhite: number;
    date: string; // ISO string
};

export function OfflineSync() {
    const utils = api.useUtils();
    const saveEgg = api.egg.saveDaily.useMutation({
        onSuccess: () => {
            void utils.egg.getLatest.invalidate();
            void utils.egg.getAll.invalidate();
        },
    });

    useEffect(() => {
        const handleOnline = async () => {
            const stored = localStorage.getItem("offline_eggs");
            if (!stored) return;

            try {
                const eggs: OfflineEggRecord[] = JSON.parse(stored);
                if (eggs.length === 0) return;

                toast.loading(`Odesílám ${eggs.length} záznamů ze spárované chladničky...`, { id: "offline-sync" });

                // Posíláme postupně
                for (const egg of eggs) {
                    await saveEgg.mutateAsync({
                        countBrown: egg.countBrown,
                        countWhite: egg.countWhite,
                        date: new Date(egg.date),
                    });
                }

                // Vyčistit
                localStorage.removeItem("offline_eggs");
                toast.success("Všechny offline záznamy byly úspěšně dorovnány na server!", { id: "offline-sync" });
            } catch (err) {
                toast.error("Chyba při synchronizaci chladničky. Zkusíme později.", { id: "offline-sync" });
            }
        };

        window.addEventListener("online", handleOnline);

        // Můžeme se pokusit synchronizovat hned při startu aplikace, pokud je online
        if (navigator.onLine) {
            handleOnline();
        }

        return () => {
            window.removeEventListener("online", handleOnline);
        };
    }, [saveEgg]);

    return null;
}
