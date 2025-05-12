<script lang="ts">
	import '../../app.css';
	import HomeLayout from '@/layouts/home.svelte'
	import { onMount } from 'svelte';

	import { page } from '$app/stores';
	import { trpc } from '@/trpc/client';
	import { getRandomDecision, determineWinner, evaluateHand } from '$lib/utils/poker';

	let ai1Status = 'playing';
	let ai2Status = 'playing';	
	let playerStatus = 'playing';
	let playerDecision = '';
	let gameStatus = '';
	let winner = '';
	let deckId = '';
	let revealAllHands = false;
	let hasActedThisPhase = false;
	let playerHandDesc: any = null;
	let ai1HandDesc: any = null;
	let ai2HandDesc: any = null;
	let playerCards = [];
	let ai1Cards = [];
	let ai2Cards = [];

	let flop = [];
	let turn = null;
	let river = null;

	let currentPhase = 0;

	const startGame = async () => {
		gameStatus = 'started';
		currentPhase = 0;
		ai1Status = 'playing';
		ai2Status = 'playing';
		playerStatus = 'playing';
		playerDecision = '';
		winner = '';
		revealAllHands = false;
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

	const checkIfGameOver = (board: any[]) => {
		const alivePlayers = [
			{ name: 'Toi', cards: playerStatus === 'playing' ? playerCards : [], status: playerStatus },
			{ name: 'IA 1', cards: ai1Status === 'playing' ? ai1Cards : [], status: ai1Status },
			{ name: 'IA 2', cards: ai2Status === 'playing' ? ai2Cards : [], status: ai2Status },
		].filter(p => p.status !== 'fold');

		if (alivePlayers.length === 1) {
			winner = `${alivePlayers[0].name} gagne car tout le monde s'est couché !`;
			gameStatus = '';
			revealAllHands = true;
			currentPhase = 3;
			return true;
		}
		return false;
	};


	const nextPhase = () => {
		hasActedThisPhase = false;
		playerDecision = '';
		currentPhase += 1;

		const board = [...flop, ...(turn ? [turn] : []), ...(river ? [river] : [])];

		if (playerStatus === 'fold') {
			// au moins une IA doit rester
			const ai1Decision = getRandomDecision();
			const ai2Decision = ai1Decision === 'fold' ? 'check' : getRandomDecision();
			if (ai1Status !== 'fold') ai1Status = ai1Decision;
			if (ai2Status !== 'fold') ai2Status = ai2Decision;
		} else {
			if (ai1Status !== 'fold') ai1Status = getRandomDecision();
			if (ai2Status !== 'fold') ai2Status = getRandomDecision();
		}

		if (checkIfGameOver(board)) return;


		if (currentPhase === 1) {
			playerHandDesc = playerStatus === 'playing' ? evaluateHand([...playerCards, ...flop]) : null;
		} else if (currentPhase === 2) {
			const board = [...flop, turn];
			playerHandDesc = playerStatus === 'playing' ? evaluateHand([...playerCards, ...board]) : null;
		}
		autoAdvanceIfFold();
		if (currentPhase === 3) {
			const board = [...flop, turn, river];
			playerHandDesc = playerStatus === 'playing' ? evaluateHand([...playerCards, ...board]) : null;

			if (playerStatus === 'fold') revealAllHands = true;

			const finalPlayer = playerStatus === 'playing' ? playerCards : [];
			const finalAi1 = ai1Status != 'fold' ? ai1Cards : [];
			const finalAi2 = ai2Status != 'fold' ? ai2Cards : [];

			const alivePlayers = [
			{ name: 'Toi', cards: finalPlayer, status: playerStatus },
			{ name: 'IA 1', cards: finalAi1, status: ai1Status },
			{ name: 'IA 2', cards: finalAi2, status: ai2Status }
			].filter(p => p.status === 'playing' || p.status !== 'fold');

			if (alivePlayers.length === 1) {
			winner = `${alivePlayers[0].name} gagne car tout le monde c'est couché !`;
			} else {
			winner = determineWinner(finalPlayer, finalAi1, finalAi2, board);
			}
			gameStatus = '';
		}
	};

	const autoAdvanceIfFold = () => {
		if (playerStatus === 'fold' && currentPhase < 3) {
			setTimeout(() => {
				nextPhase();
			}, 1500);
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
			<p class="mb-1">IA 1 <span class="text-sm italic">({ai1Status})</span></p>
			<div class="flex gap-2">
				{#each ai1Cards as card}
				<img
					src={revealAllHands && ai1Status !== 'fold' ? card.image : "https://deckofcardsapi.com/static/img/back.png"}
					class="w-16 rounded opacity-100"
					style="opacity: {ai1Status === 'fold' ? 0.3 : 1}"
					alt="AI Card"
				/>
				{/each}
			</div>

			</div>
		
			<div class="text-center">
			<p class="mb-1">IA 2 <span class="text-sm italic">({ai2Status})</span></p>
			<div class="flex gap-2">
				{#each ai2Cards as card}
				<img
					src={revealAllHands && ai2Status !== 'fold' ? card.image : "https://deckofcardsapi.com/static/img/back.png"}
					class="w-16 rounded opacity-100"
					style="opacity: {ai2Status === 'fold' ? 0.3 : 1}"
					alt="AI Card"
				/>
				{/each}
			</div>

			</div>
		</div>
  
	  
		<div class="flex gap-2 border-t border-b py-4">
		  {#if currentPhase >= 1}
			{#each flop as card}
			  <img src={card.image} class="w-20 rounded shadow" alt="Flop Card"/>
			{/each}
		  {/if}
		  {#if currentPhase >= 2}
			<img src={turn.image} class="w-20 rounded shadow" alt="Turn Card"/>
		  {/if}
		  {#if currentPhase >= 3}
			<img src={river.image} class="w-20 rounded shadow" alt="River Card"/>
		  {/if}
		</div>
	  
		<div class="text-center">
		  <p class="mb-2">Toi</p>
		  <div class="flex gap-2">
			{#each playerCards as card}
			  <img src={card.image} class="w-20 rounded shadow" alt="Player Card" style="opacity: {playerStatus === 'fold' ? 0.3 : 1}"/>
			{/each}
		  </div>
		  {#if playerHandDesc}
				<p class="text-sm mt-1 text-gray-400 italic">
					Main : {playerHandDesc.hand.replace(/_/g, ' ')}
				</p>
			{/if}

		</div>
	  
		<div class="flex gap-4">
		  <button
			on:click={startGame}
			hidden={gameStatus === 'started'}
			class="bg-gray-800 hover:bg-gray-900 px-4 py-2 rounded"
		  >
			Nouvelle partie
		  </button>

		  {#if currentPhase < 3 && playerStatus === 'playing'}
			<div class="mt-6 flex gap-4 justify-center">
				<button
				class="bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700"
				on:click={() => {
					playerDecision = 'check';
					hasActedThisPhase = true;
					nextPhase();
				}}
				>
				Check
				</button>
				<button
				class="bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700"
				on:click={() => {
					playerDecision = 'fold';
					hasActedThisPhase = true;
					playerStatus = 'fold';
					nextPhase();
				}}
				>
				Fold
				</button>
			</div>
			{/if}

		  {#if winner}
			<p class="text-xl font-semibold mt-4">{winner}</p>
			{/if}
		</div>
	  </div>	  
</HomeLayout>