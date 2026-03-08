import { TRPCError } from '@trpc/server';
import { eggRepository } from '~/server/repositories/egg.repository';

export const eggService = {
    saveDaily: async (input: { countWhite: number; countBrown: number; date?: Date }) => {
        const date = input.date || new Date();
        const existing = await eggRepository.findByDate(new Date(date));

        if (existing) {
            return eggRepository.update(existing.id, {
                countWhite: input.countWhite,
                countBrown: input.countBrown,
            });
        }

        return eggRepository.create({
            countWhite: input.countWhite,
            countBrown: input.countBrown,
            date,
        });
    },

    getAll: async () => {
        return eggRepository.findAll();
    },

    getLatest: async () => {
        const all = await eggRepository.findAll();
        return all[0] || null;
    },

    deleteById: async (id: string) => {
        return eggRepository.delete(id);
    },

    updateById: async (id: string, input: { countWhite: number; countBrown: number }) => {
        return eggRepository.update(id, input);
    },

    getInventory: async () => {
        const totals = await eggRepository.getTotals();
        return {
            brown: totals.collectedBrown - totals.withdrawnBrown,
            white: totals.collectedWhite - totals.withdrawnWhite,
            total: (totals.collectedBrown + totals.collectedWhite) - (totals.withdrawnBrown + totals.withdrawnWhite)
        };
    },

    withdraw: async (input: { boxCount: number; name?: string; thanks: string }) => {
        const totalToWithdraw = input.boxCount * 10;
        const inventory = await eggService.getInventory();

        if (inventory.total < totalToWithdraw) {
            throw new TRPCError({
                code: 'BAD_REQUEST',
                message: `Nedostatek vajec na skladě. K dispozici pouze ${inventory.total} ks.`,
            });
        }

        // Poměrové rozdělení
        let withdrawnBrown = 0;
        let withdrawnWhite = 0;

        if (inventory.total > 0) {
            // Vypočítáme hnědá (zaokrouhleně)
            withdrawnBrown = Math.round((inventory.brown / inventory.total) * totalToWithdraw);
            // Zbytek jsou bílá (aby to vždy sedělo na totalToWithdraw)
            withdrawnWhite = totalToWithdraw - withdrawnBrown;

            // Kontrola, zda nejdeme do minusu u bílých (pokud by round hnědých byl moc velký)
            if (withdrawnWhite < 0) {
                withdrawnWhite = 0;
                withdrawnBrown = totalToWithdraw;
            }
            // A naopak pro hnědá
            if (withdrawnBrown < 0) {
                withdrawnBrown = 0;
                withdrawnWhite = totalToWithdraw;
            }

            // Finální sanity check proti reálnému skladu (pokud by poměr byl extrémní)
            if (withdrawnBrown > inventory.brown) {
                withdrawnBrown = inventory.brown;
                withdrawnWhite = totalToWithdraw - withdrawnBrown;
            }
            if (withdrawnWhite > inventory.white) {
                withdrawnWhite = inventory.white;
                withdrawnBrown = totalToWithdraw - withdrawnWhite;
            }
        }

        return eggRepository.createWithdrawal({
            boxCount: input.boxCount,
            totalEggs: totalToWithdraw,
            countBrown: withdrawnBrown,
            countWhite: withdrawnWhite,
            name: input.name,
            thanks: input.thanks,
        });
    },

    getAllWithdrawals: async () => {
        return eggRepository.findAllWithdrawals();
    }
};
