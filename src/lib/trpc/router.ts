import { z } from 'zod';
import type { Context } from '$lib/trpc/context';
import { initTRPC } from '@trpc/server';
export const t = initTRPC.context<Context>().create();

export const router = t.router({
	greeting: t.procedure.query(async () => {
		return `Hello tRPC v10 @ ${new Date().toLocaleTimeString()}`;
	}),
	shuffleDeck: t.procedure.query(async () => {
		const response = await fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1');
		const data = await response.json();
		return data;
	}),
	drawCard: t.procedure
		.input(z.object({ deckId: z.string() }))
		.query(async ({ input }) => {
			const response = await fetch(`https://deckofcardsapi.com/api/deck/${input.deckId}/draw/?count=2`);
			const data = await response.json();
			return data;
		}),
		
	dealToPlayers: t.procedure
		.input(z.object({ deckId: z.string() }))
		.query(async ({ input }) => {
		  const response = await fetch(`https://deckofcardsapi.com/api/deck/${input.deckId}/draw/?count=6`);
		  const data = await response.json();
	  
		  const cards = data.cards;
	  
		  return {
			player: cards.slice(0, 2),
			ai1: cards.slice(2, 4),   
			ai2: cards.slice(4, 6),    
			remaining: data.remaining,
		  };
		}),	 
		
		dealCommunityCards: t.procedure
		.input(z.object({ deckId: z.string() }))
		.query(async ({ input }) => {
		  const response = await fetch(`https://deckofcardsapi.com/api/deck/${input.deckId}/draw/?count=5`);
		  const data = await response.json();
	  
		  return {
			flop: data.cards.slice(0, 3),
			turn: data.cards[3],
			river: data.cards[4],
		  };
		}),
	  
});

export const createCaller = t.createCallerFactory(router);

export type Router = typeof router;