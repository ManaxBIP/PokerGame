import { JWT_SECRET } from '$env/static/private';
import prisma from '@/trpc/prisma';
import { fail } from '@sveltejs/kit';
import jwt from 'jsonwebtoken';
import type { Actions } from './$types';
import { redirect } from '@sveltejs/kit';

export const actions: Actions = {
    login: async ({ request, cookies }) => {
        try {
            const data = await request.formData();
            const emailInput = data.get('email') as string
            const password = data.get('password') as string;

            const { id, email } = await prisma.user.findFirstOrThrow({
                where: { email: emailInput, password },
                select: { id: true, email: true }
            });
            
            cookies.set('jwt', jwt.sign({ id, email }, JWT_SECRET), { path: '/' });
            
            // 👆 or, if we're using HTTP headers based auth, we could return the token,
            // and let the client set the header on subsequent requests
        } catch {
            return fail(401, { error: 'Authentication failed' });
        }

        throw redirect(302, '/');
    }
};