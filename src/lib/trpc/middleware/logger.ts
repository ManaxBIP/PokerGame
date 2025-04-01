import { initTRPC } from '@trpc/server';

const t = initTRPC.create();

export const logger = t.middleware(async ({ path, type, next }) => {
  console.log(`[${type}] ${path}`);
  return next();
});