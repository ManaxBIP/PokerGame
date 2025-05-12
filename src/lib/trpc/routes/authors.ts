import prisma from '@/trpc/prisma'
import { auth } from '@/trpc/middleware/auth'
import { logger } from '@/trpc/middleware/logger'
import { t } from '@/trpc/t'
import { z } from 'zod'
import type { User } from '@prisma/client'

type UserListItem = Pick<User, 'id' | 'fullName' | 'email' | 'updatedAt'>
type UserOption = Pick<User, 'id' | 'fullName'>

export const users = t.router({
	list: t.procedure
		.use(logger)
		.input(z.string().optional())
		.query(async ({ input }): Promise<UserListItem[]> => {
			return prisma.user.findMany({
				select: {
					id: true,
					fullName: true,
					email: true,
					updatedAt: true
				},
				orderBy: { updatedAt: 'desc' },
				where: input
					? {
						OR: [
							{ fullName: { contains: input, mode: 'insensitive' } },
							{ email: { contains: input, mode: 'insensitive' } }
						]
					}
					: undefined
			})
		}),

	loadOptions: t.procedure
		.use(logger)
		.query(async (): Promise<{ label: string; value: number }[]> => {
			const users: UserOption[] = await prisma.user.findMany({
				select: { id: true, fullName: true },
				orderBy: { fullName: 'asc' }
			})

			return users.map((user) => ({
				label: user.fullName,
				value: user.id
			}))
		}),

	load: t.procedure
		.use(logger)
		.use(auth)
		.input(z.number())
		.query(async ({ input }) => {
			return prisma.user.findUniqueOrThrow({
				select: {
					id: true,
					fullName: true,
					email: true,
					emailVerified: true,
					oauthId: true,
					createdAt: true,
					updatedAt: true
				},
				where: { id: input }
			})
		}),

	save: t.procedure
		.use(logger)
		.use(auth)
		.input(
			z.object({
				id: z.number().nullable(),
				fullName: z.string().min(3).max(100),
				email: z.string().email(),
				password: z.string().min(6).optional(),
				emailVerified: z.boolean().optional(),
				oauthId: z.string().nullable().optional()
			})
		)
		.mutation(async ({ input, ctx: { userId } }) => {
			const { id, password, ...rest } = input

			if (id) {
				await prisma.user.update({
					where: { id },
					data: {
						...rest,
						...(password ? { password } : {})
					}
				})
			} else {
				await prisma.user.create({
					data: {
						...rest,
						password: password ?? ''
					}
				})
			}
		}),

	delete: t.procedure
		.use(logger)
		.use(auth)
		.input(z.number())
		.mutation(async ({ input }) => {
			await prisma.user.delete({
				where: { id: input }
			})
		})
})