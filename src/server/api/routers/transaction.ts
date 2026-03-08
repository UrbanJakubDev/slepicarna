import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';
import { transactionService } from '~/server/services/transaction.service';

export const transactionRouter = createTRPCRouter({
    create: publicProcedure
        .input(z.object({
            type: z.enum(['SALE', 'EXPENSE']),
            amount: z.number().min(0),
            quantity: z.number().optional(),
            description: z.string().optional(),
            date: z.coerce.date().optional(),
        }))
        .mutation(async ({ input }) => {
            return transactionService.create(input);
        }),

    getAll: publicProcedure.query(async () => {
        return transactionService.getAll();
    }),

    delete: publicProcedure
        .input(z.string())
        .mutation(async ({ input }) => {
            return transactionService.deleteById(input);
        }),
});
