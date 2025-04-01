import prisma from '@/trpc/prisma';
import { md5 } from 'hash-wasm';
import { redirect } from '@sveltejs/kit';

export const actions = {
    signUp: async ({ request }) => {
        try {
            const data = await request.formData();
            const email = data.get('email') as string;
            const fullName = data.get('full_name') as string;
            const password = data.get('password') as string;

            const hashedPassword = await md5(password);

            console.log(hashedPassword);

            const user = await prisma.user.create({
                data: {
                    email,
                    fullName,
                    password: hashedPassword,
                    emailVerified: false,
                    oauthId: null,
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            });
        }
        catch (error) {
            if (error instanceof redirect) throw error;

            console.error('Error creating user:', error);
            return { success: false, error: 'Failed to create user' };
        }

        throw redirect(302, '/login');
    }
};