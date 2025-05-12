import { JWT_SECRET } from '$env/static/private';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import type { PageServerLoad, Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { formSchema } from './schema';
import { prisma } from '$lib/prisma';

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user) throw redirect(302, '/playground');

	return {
		form: await superValidate(zod(formSchema))
	};
};

export const actions: Actions = {
	login: async (event) => {
		const form = await superValidate(event, zod(formSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const { email, password } = form.data;
		const { cookies } = event;

		const user = await prisma.user.findUnique({ where: { email } });

		console.log(user);

		if (!user) {
			return fail(401, {
				form,
				error: 'Email ou mot de passe invalide.'
			});
		}

		const isPasswordValid = await bcrypt.compare(password, user.password);

		if (!isPasswordValid) {
			return fail(401, {
				form,
				error: 'Email ou mot de passe invalide.'
			});
		}

		const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
			expiresIn: '7d'
		});

		console.log(token);

		cookies.set('jwt', token, {
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
			secure: process.env.NODE_ENV === 'production',
			maxAge: 60 * 60 * 24 * 7 // 7 jours
		});


		throw redirect(302, '/playground');
	}
};