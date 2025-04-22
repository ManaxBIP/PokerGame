import { JWT_SECRET } from '$env/static/private';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import type { PageServerLoad, Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { formSchema } from './schema';
import { prisma } from '$lib/prisma';

export const load: PageServerLoad = async () => {
	return {
		form: await superValidate(zod(formSchema)),
	};
};

export const actions: Actions = {
	signup: async (event) => {
		const form = await superValidate(event, zod(formSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const { email, password, fullName } = form.data;

		const existingUser = await prisma.user.findUnique({ where: { email } });

		if (existingUser) {
			return fail(400, {
				form,
				error: 'Un compte avec cet email existe déjà.',
			});
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		const user = await prisma.user.create({
			data: {
				email,
				password: hashedPassword,
				fullName,
			},
		});

		const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
			expiresIn: '7d',
		});

		event.cookies.set('jwt', token, {
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
			secure: process.env.NODE_ENV === 'production',
			maxAge: 60 * 60 * 24 * 7, // 7 jours
		});

		throw redirect(302, '/dashboard');
	},
};
