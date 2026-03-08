import { api } from '~/trpc/react';

export function useLatestEgg() {
  return api.egg.getLatest.useQuery();
}

export function useSaveEgg() {
  const utils = api.useUtils();
  return api.egg.saveDaily.useMutation({
    onSuccess: () => {
      void utils.egg.getLatest.invalidate();
      void utils.egg.getAll.invalidate();
    },
    onError: (err, variables) => {
      // Pokud je chyba síťová (fetch failed, failed to fetch, offline atd.)
      if (!navigator.onLine || err.message.toLowerCase().includes("fetch")) {
        const stored = localStorage.getItem("offline_eggs");
        const eggs = stored ? JSON.parse(stored) : [];

        eggs.push({
          id: crypto.randomUUID(),
          countBrown: variables.countBrown,
          countWhite: variables.countWhite,
          date: variables.date ? variables.date.toISOString() : new Date().toISOString()
        });

        localStorage.setItem("offline_eggs", JSON.stringify(eggs));
        alert("Bez připojení k síti 🌐\n\nZáznam byl uložen do 'offline chladničky' a odešle se na server automaticky, jakmile se připojení obnoví.");
      } else {
        alert("Chyba při ukládání na server.");
      }
    }
  });
}

export function useDeleteEgg() {
  const utils = api.useUtils();
  return api.egg.delete.useMutation({
    onSuccess: () => {
      void utils.egg.getLatest.invalidate();
      void utils.egg.getAll.invalidate();
    },
  });
}

export function useUpdateEgg() {
  const utils = api.useUtils();
  return api.egg.update.useMutation({
    onSuccess: () => {
      void utils.egg.getLatest.invalidate();
      void utils.egg.getAll.invalidate();
    },
  });
}

export function useInventory() {
  return api.egg.getInventory.useQuery();
}

export function useWithdrawEggs() {
  const utils = api.useUtils();
  return api.egg.withdraw.useMutation({
    onSuccess: () => {
      void utils.egg.getInventory.invalidate();
      void utils.egg.getAllWithdrawals.invalidate();
    },
  });
}

export function useWithdrawals() {
  return api.egg.getAllWithdrawals.useQuery();
}
