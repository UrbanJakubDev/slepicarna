import { api } from '~/trpc/react';
import toast from 'react-hot-toast';

export function useFlock() {
    return api.flock.getAll.useQuery();
}

export function useSaveFlock() {
    const utils = api.useUtils();
    return api.flock.create.useMutation({
        onSuccess: () => {
            void utils.flock.getAll.invalidate();
            void utils.flock.getLatest.invalidate();
        },
        onError: () => {
            toast.error("Chyba při ukládání na server.");
        }
    });
}

export function useDeleteFlock() {
    const utils = api.useUtils();
    return api.flock.delete.useMutation({
        onSuccess: () => {
            void utils.flock.getAll.invalidate();
            void utils.flock.getLatest.invalidate();
        },
        onError: () => {
            toast.error("Chyba při odebírání na serveru.");
        }
    });
}
