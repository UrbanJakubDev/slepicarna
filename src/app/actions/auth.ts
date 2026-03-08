'use server';

import { cookies } from 'next/headers';

export async function loginWithPin(pin: string) {
    const correctPin = process.env.APP_PIN || '1234';

    if (pin === correctPin) {
        const cookieStore = await cookies();
        // Set cookie for 30 days
        cookieStore.set('slepicarna_auth', 'authenticated', {
            maxAge: 30 * 24 * 60 * 60,
            path: '/',
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
        });
        return { success: true };
    }

    return { success: false, error: 'Nesprávný PIN' };
}
