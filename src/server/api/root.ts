import { createTRPCRouter } from '~/server/api/trpc';
import { eggRouter } from '~/server/api/routers/egg';
import { transactionRouter } from '~/server/api/routers/transaction';
import { flockRouter } from '~/server/api/routers/flock';

export const appRouter = createTRPCRouter({
    egg: eggRouter,
    transaction: transactionRouter,
    flock: flockRouter,
});

export type AppRouter = typeof appRouter;
