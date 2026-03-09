import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';
import { flockService } from '~/server/services/flock.service';

export const flockRouter = createTRPCRouter({
    getLatest: publicProcedure.query(async () => {
        return flockService.getLatest();
    }),

    getAll: publicProcedure.query(async () => {
        return flockService.getAll();
    }),

    create: publicProcedure
        .input(z.object({
            count: z.number().min(0),
            date: z.coerce.date().optional(),
        }))
        .mutation(async ({ input }) => {
            return flockService.create(input);
        }),

    delete: publicProcedure
        .input(z.string())
        .mutation(async ({ input }) => {
            return flockService.deleteById(input);
        }),
});
