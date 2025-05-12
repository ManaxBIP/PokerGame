<script lang="ts">
	import '../../app.css';
	import HomeLayout from '@/layouts/home.svelte'
	import { onMount } from 'svelte';

	import { page } from '$app/stores';
	import { trpc } from '@/trpc/client';
	import { determineWinner } from '$lib/utils/poker';

	let winner = '';
	let deckId = '';
	let playerCards = [];
	let ai1Cards = [];
	let ai2Cards = [];

	let flop = [];
	let turn = null;
	let river = null;

	let currentPhase = 0;

	const startGame = async () => {
		currentPhase = 0;
		winner = '';
		const deck = await trpc($page).shuffleDeck.query();
		deckId = deck.deck_id;

		const hands = await trpc($page).dealToPlayers.query({ deckId });
		playerCards = hands.player;
		ai1Cards = hands.ai1;
		ai2Cards = hands.ai2;

		const community = await trpc($page).dealCommunityCards.query({ deckId });
		flop = community.flop;
		turn = community.turn;
		river = community.river;
	};

	const nextPhase = () => {
		if (currentPhase < 3) {
			currentPhase += 1;
		}
		if (currentPhase === 3) {
			const board = [...flop, turn, river];
			winner = determineWinner(playerCards, ai1Cards, ai2Cards, board);
		}	
	};

	onMount(() => {
		startGame();
	});
</script>

<HomeLayout>
	<div class="min-h-screen bg-green-700 text-white flex flex-col items-center py-8 space-y-8">
		<div class="flex gap-12">
		  <div class="text-center">
			<p class="mb-2">IA 1</p>
			<div class="flex gap-2">
			  {#each ai1Cards as card}
				<img src="https://deckofcardsapi.com/static/img/back.png" class="w-16 rounded" />
			  {/each}
			</div>
		  </div>
		  <div class="text-center">
			<p class="mb-2">IA 2</p>
			<div class="flex gap-2">
			  {#each ai2Cards as card}
				<img src="https://deckofcardsapi.com/static/img/back.png" class="w-16 rounded" />
			  {/each}
			</div>
		  </div>
		</div>
	  
		<div class="flex gap-2 border-t border-b py-4">
		  {#if currentPhase >= 1}
			{#each flop as card}
			  <img src={card.image} class="w-20 rounded shadow" />
			{/each}
		  {/if}
		  {#if currentPhase >= 2}
			<img src={turn.image} class="w-20 rounded shadow" />
		  {/if}
		  {#if currentPhase >= 3}
			<img src={river.image} class="w-20 rounded shadow" />
		  {/if}
		</div>
	  
		<div class="text-center">
		  <p class="mb-2">Toi</p>
		  <div class="flex gap-2">
			{#each playerCards as card}
			  <img src={card.image} class="w-20 rounded shadow" />
			{/each}
		  </div>
		</div>
	  
		<div class="flex gap-4">
		  <button
			on:click={startGame}
			class="bg-gray-800 hover:bg-gray-900 px-4 py-2 rounded"
		  >
			Nouvelle partie
		  </button>
	  
		  {#if currentPhase < 3}
			<button
			  on:click={nextPhase}
			  class="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
			>
			  Suivant
			</button>
		  {/if}
		  {#if winner}
			<p class="text-xl font-semibold mt-4">{winner}</p>
			{/if}
		</div>
	  </div>	  
</HomeLayout>