import { TRPCError } from '@trpc/server';
import { db } from '~/server/db';
import { eggRepository } from '~/server/repositories/egg.repository';

export const eggService = {
    saveDaily: async (input: { count: number; date?: Date }) => {
        const date = input.date || new Date();
        const existing = await eggRepository.findByDate(new Date(date));

        if (existing) {
            return eggRepository.update(existing.id, {
                count: input.count,
            });
        }

        return eggRepository.create({
            count: input.count,
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

    updateById: async (id: string, input: { count: number }) => {
        return eggRepository.update(id, input);
    },

    getInventory: async () => {
        const totals = await eggRepository.getTotals();
        return {
            total: totals.collected - totals.withdrawn
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

        return eggRepository.createWithdrawal({
            boxCount: input.boxCount,
            totalEggs: totalToWithdraw,
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

        const totalEggs = eggRecords.reduce((sum: number, r: any) => sum + r.count, 0);

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
