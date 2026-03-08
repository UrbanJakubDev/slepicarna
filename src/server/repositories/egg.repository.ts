import { type Prisma } from '@prisma/client';
import { db } from '~/server/db';

export const eggRepository = {
    findAll: async (where?: Prisma.EggCollectionWhereInput) => {
        return db.eggCollection.findMany({
            where,
            orderBy: { date: 'desc' },
        });
    },

    findById: async (id: string) => {
        return db.eggCollection.findUnique({ where: { id } });
    },

    findByDate: async (date: Date) => {
        const start = new Date(date.setHours(0, 0, 0, 0));
        const end = new Date(date.setHours(23, 59, 59, 999));
        return db.eggCollection.findFirst({ where: { date: { gte: start, lte: end } } });
    },

    create: async (data: Prisma.EggCollectionCreateInput) => {
        return db.eggCollection.create({ data });
    },

    update: async (id: string, data: Prisma.EggCollectionUpdateInput) => {
        return db.eggCollection.update({ where: { id }, data });
    },

    delete: async (id: string) => {
        return db.eggCollection.delete({ where: { id } });
    },

    // Výběry (Withdrawals)
    createWithdrawal: async (data: Prisma.EggWithdrawalCreateInput) => {
        return db.eggWithdrawal.create({ data });
    },

    findAllWithdrawals: async () => {
        return db.eggWithdrawal.findMany({
            orderBy: { date: 'desc' },
        });
    },

    // Sumární statistiky pro sklad
    getTotals: async () => {
        const collections = await db.eggCollection.aggregate({
            _sum: {
                countBrown: true,
                countWhite: true,
            }
        });

        const withdrawals = await db.eggWithdrawal.aggregate({
            _sum: {
                countBrown: true,
                countWhite: true,
            }
        });

        return {
            collectedBrown: collections._sum.countBrown || 0,
            collectedWhite: collections._sum.countWhite || 0,
            withdrawnBrown: withdrawals._sum.countBrown || 0,
            withdrawnWhite: withdrawals._sum.countWhite || 0,
        };
    }
};
