import { type Prisma } from '@prisma/client';
import { db } from '~/server/db';

export const transactionRepository = {
    findAll: async (where?: Prisma.TransactionWhereInput) => {
        return db.transaction.findMany({
            where,
            orderBy: { date: 'desc' },
        });
    },

    create: async (data: Prisma.TransactionCreateInput) => {
        return db.transaction.create({ data });
    },

    delete: async (id: string) => {
        return db.transaction.delete({ where: { id } });
    },
};
