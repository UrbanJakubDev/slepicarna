import { type Prisma } from '@prisma/client';
import { db } from '~/server/db';

export const flockRepository = {
    findLatest: async () => {
        return db.flockHistory.findFirst({
            orderBy: { date: 'desc' },
        });
    },

    findAll: async () => {
        return db.flockHistory.findMany({
            orderBy: { date: 'desc' },
        });
    },

    create: async (data: Prisma.FlockHistoryCreateInput) => {
        return db.flockHistory.create({ data });
    },

    delete: async (id: string) => {
        return db.flockHistory.delete({ where: { id } });
    }
};
