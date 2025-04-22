import { JWT_SECRET } from '$env/static/private';
import jwt from 'jsonwebtoken';
import type { RequestEvent } from '@sveltejs/kit';

export const userInfos = async ({ event, resolve }: { event: RequestEvent; resolve: Function })=> {
	const token = event.cookies.get('jwt');

	if (token) {
		try {
			const decoded = jwt.verify(token, JWT_SECRET) as { id: string, email: string };
			event.locals.userId = parseInt(decoded.id);
			event.locals.userEmail = decoded.email;
		} catch (err) {
			console.error('Invalid JWT');
		}
	}

	return resolve(event);
};