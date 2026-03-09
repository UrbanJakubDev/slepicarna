import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';
import { eggService } from '~/server/services/egg.service';

export const eggRouter = createTRPCRouter({
    saveDaily: publicProcedure
        .input(z.object({
            countWhite: z.number().min(0),
            countBrown: z.number().min(0),
            date: z.coerce.date().optional(),
        }))
        .mutation(async ({ input }) => {
            return eggService.saveDaily(input);
        }),

    getLatest: publicProcedure.query(async () => {
        return eggService.getLatest();
    }),

    getAll: publicProcedure.query(async () => {
        return eggService.getAll();
    }),

    delete: publicProcedure
        .input(z.string())
        .mutation(async ({ input }) => {
            return eggService.deleteById(input);
        }),

    update: publicProcedure
        .input(z.object({
            id: z.string(),
            countWhite: z.number().min(0),
            countBrown: z.number().min(0),
        }))
        .mutation(async ({ input }) => {
            return eggService.updateById(input.id, {
                countWhite: input.countWhite,
                countBrown: input.countBrown,
            });
        }),

    getInventory: publicProcedure.query(async () => {
        return eggService.getInventory();
    }),

    withdraw: publicProcedure
        .input(z.object({
            boxCount: z.number().min(1).max(10), // Limit 10 krabiček najednou
            name: z.string().optional(),
            thanks: z.string().default("Děkuji"),
        }))
        .mutation(async ({ input }) => {
            return eggService.withdraw(input);
        }),

    getAllWithdrawals: publicProcedure.query(async () => {
        return eggService.getAllWithdrawals();
    }),

    getProductionCost: publicProcedure
        .input(z.object({ days: z.number().default(30) }))
        .query(async ({ input }) => {
            return eggService.getProductionCost(input.days);
        }),
});
