import { z } from 'zod';

export const formSchema = z
	.object({
		fullName: z.string().min(1, 'Le nom complet est requis'),
		email: z.string().email(),
		password: z.string().min(8).max(50),
		confirm_password: z.string().min(8).max(50),
	})
	.refine((data) => data.password === data.confirm_password, {
		message: 'Les mots de passe ne correspondent pas',
		path: ['confirm_password'],
	});

export type FormSchema = typeof formSchema;
