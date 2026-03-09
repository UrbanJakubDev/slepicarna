import { flockRepository } from '~/server/repositories/flock.repository';

export const flockService = {
    getLatest: async () => {
        return flockRepository.findLatest();
    },

    getAll: async () => {
        return flockRepository.findAll();
    },

    create: async (input: { count: number; date?: Date }) => {
        const date = input.date || new Date();
        return flockRepository.create({
            count: input.count,
            date,
        });
    },

    deleteById: async (id: string) => {
        return flockRepository.delete(id);
    }
};
