import { createContext } from '@/trpc/context';
import { router } from '@/trpc/router';
import type { Handle } from '@sveltejs/kit';
import { createTRPCHandle } from 'trpc-sveltekit';

const trpcHandle = createTRPCHandle({ router, createContext });

export const handle: Handle = async ({ event, resolve }) => {
  // Répond aux requêtes pré-vol (OPTIONS)
  if (event.request.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }

  // Appelle tRPC handler ou SvelteKit handler
  const response = await trpcHandle({ event, resolve });

  // Ajoute les en-têtes CORS à toutes les réponses
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  return response;
};
