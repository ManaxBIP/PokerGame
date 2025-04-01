import { t } from '@/trpc/t';

import { TRPCError } from '@trpc/server';

export const logger = t.middleware(async ({ next, ctx }) => {
	if (!ctx.userId) throw new TRPCError({ code: 'UNAUTHORIZED' });
	return next();
});