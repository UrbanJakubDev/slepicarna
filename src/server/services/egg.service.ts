import { TRPCError } from '@trpc/server';
import { eggRepository } from '~/server/repositories/egg.repository';

export const eggService = {
    saveDaily: async (input: { countWhite: number; countBrown: number; date?: Date }) => {
        const date = input.date || new Date();
        const existing = await eggRepository.findByDate(new Date(date));

        if (existing) {
            return eggRepository.update(existing.id, {
                countWhite: input.countWhite,
                countBrown: input.countBrown,
            });
        }

        return eggRepository.create({
            countWhite: input.countWhite,
            countBrown: input.countBrown,
            date,
        });
    },

    getAll: async () => {
        return eggRepository.findAll();
    },

    getLatest: async () => {
        const all = await eggRepository.findAll();
        return all[0] || null;
    },

    deleteById: async (id: string) => {
        return eggRepository.delete(id);
    },

    updateById: async (id: string, input: { countWhite: number; countBrown: number }) => {
        return eggRepository.update(id, input);
    },
};
