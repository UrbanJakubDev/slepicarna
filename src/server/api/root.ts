import { createTRPCRouter } from '~/server/api/trpc';
import { eggRouter } from '~/server/api/routers/egg';
import { transactionRouter } from '~/server/api/routers/transaction';

export const appRouter = createTRPCRouter({
    egg: eggRouter,
    transaction: transactionRouter,
});

export type AppRouter = typeof appRouter;
