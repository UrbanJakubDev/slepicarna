import { api } from '~/trpc/react';

export function useTransactions() {
    return api.transaction.getAll.useQuery();
}

export function useCreateTransaction() {
    const utils = api.useUtils();
    return api.transaction.create.useMutation({
        onSuccess: () => {
            void utils.transaction.getAll.invalidate();
        },
    });
}

export function useDeleteTransaction() {
    const utils = api.useUtils();
    return api.transaction.delete.useMutation({
        onSuccess: () => {
            void utils.transaction.getAll.invalidate();
        },
    });
}
