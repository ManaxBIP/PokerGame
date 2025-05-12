import { createContext } from '@/trpc/context';
import { router } from '@/trpc/router';
import type { Handle } from '@sveltejs/kit';
import { createTRPCHandle } from 'trpc-sveltekit';

const trpcHandle = createTRPCHandle({ router, createContext });

export const handle: Handle = async ({ event, resolve }) => {
	// Interception de la requête Chrome DevTools
	if (event.url.pathname === '/.well-known/appspecific/com.chrome.devtools.json') {
		return new Response(null, { status: 204 });
	}

	// Sinon, on passe d'abord par tRPC
	const trpcResponse = await trpcHandle({ event, resolve });
	if (trpcResponse) return trpcResponse;

	// Et on continue normalement
	return resolve(event);
};
