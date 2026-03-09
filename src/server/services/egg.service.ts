import { TRPCError } from '@trpc/server';
import { db } from '~/server/db';
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
    },

    getProductionCost: async (days = 30) => {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        // 1. Získáme všechny záznamy o snůšce za období
        const eggRecords = await eggRepository.findAll({
            date: { gte: startDate }
        });

        const totalEggs = eggRecords.reduce((sum: number, r: any) => sum + r.countBrown + r.countWhite, 0);

        // 2. Získáme všechny výdaje za krmivo za stejné období
        const feedTransactions = await db.transaction.findMany({
            where: {
                type: 'FEED',
                date: { gte: startDate }
            }
        });

        const totalFeedCost = feedTransactions.reduce((sum: number, t: any) => sum + t.amount, 0);

        if (totalEggs === 0) return { costPerEgg: 0, totalEggs: 0, totalCost: totalFeedCost };

        return {
            costPerEgg: Number((totalFeedCost / totalEggs).toFixed(2)),
            totalEggs,
            totalCost: totalFeedCost,
            periodDays: days
        };
    }
};
