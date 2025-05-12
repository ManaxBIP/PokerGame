import type { Handle } from '@sveltejs/kit';
import { JWT_SECRET } from '$env/static/private';
import { prisma } from '$lib/prisma';
import jwt from 'jsonwebtoken';

export const handle: Handle = async ({ event, resolve }) => {
	const token = event.cookies.get('jwt');

	if (token) {
		try {
			const decoded = jwt.verify(token, JWT_SECRET) as { id: number };
			const user = await prisma.user.findUnique({ where: { id: decoded.id } });
			
			if (user) {
				event.locals.user = user;
			}
		} catch (err) {
			console.error('Invalid JWT:', err);
			event.cookies.delete('jwt', { path: '/' });
		}
	}
	if (event.url.pathname === '/.well-known/appspecific/com.chrome.devtools.json') {
		return new Response(null, { status: 204 });
	}

	return resolve(event);
};
