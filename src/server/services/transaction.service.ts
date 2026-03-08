import { transactionRepository } from '~/server/repositories/transaction.repository';

export const transactionService = {
    create: async (input: { type: string; amount: number; quantity?: number; description?: string; date?: Date }) => {
        return transactionRepository.create({
            type: input.type,
            amount: input.amount,
            quantity: input.quantity,
            description: input.description,
            date: input.date || new Date(),
        });
    },

    getAll: async () => {
        return transactionRepository.findAll();
    },

    deleteById: async (id: string) => {
        return transactionRepository.delete(id);
    },
};
