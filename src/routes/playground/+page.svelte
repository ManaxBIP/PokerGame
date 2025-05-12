<script lang="ts">
	import '../../app.css';
	import { Button } from '$lib/components/ui/button/index.js';
	import HomeLayout from '@/layouts/home.svelte';
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
	let isPlayerWinner = false;
	let isDraw = false;
	let currentPhase = 0;
	let currentBet = 0;
	let minRaise = 50;

	let playerHandDesc: any = null;
	let ai1HandDesc: any = null;
	let ai2HandDesc: any = null;
	let playerCards: any[] = [];
	let ai1Cards: any[] = [];
	let ai2Cards: any[] = [];

	let flop: any[] = [];
	let turn: any = null;
	let river: any = null;

	let pot = 0;
	let smallBlind = 25;
	let bigBlind = 50;
	let dealerPosition = 0;

	let chips: any = {
		player: 500,
		ai1: 500,
		ai2: 500
	};

	let playerContribution = 0;
	let ai1Contribution = 0;
	let ai2Contribution = 0;

	const rotateDealer = () => {
		dealerPosition = (dealerPosition + 1) % 3;
	};

	const postBlinds = () => {
		const order = ['player', 'ai1', 'ai2'];
		const sb = order[(dealerPosition + 1) % 3];
		const bb = order[(dealerPosition + 2) % 3];

		chips[sb] -= smallBlind;
		chips[bb] -= bigBlind;

		pot = smallBlind + bigBlind;
		currentBet = bigBlind;

		if (sb === 'player') playerContribution = smallBlind;
		if (sb === 'ai1') ai1Contribution = smallBlind;
		if (sb === 'ai2') ai2Contribution = smallBlind;

		if (bb === 'player') playerContribution = bigBlind;
		if (bb === 'ai1') ai1Contribution = bigBlind;
		if (bb === 'ai2') ai2Contribution = bigBlind;
	};

	const placeBet = (player: string, amount: number) => {
		const bet = Math.min(chips[player], amount);
		chips[player] -= bet;
		pot += bet;
		if (player === 'player') playerContribution += bet;
		if (player === 'ai1') ai1Contribution += bet;
		if (player === 'ai2') ai2Contribution += bet;
		return bet;
	};

	const startGame = async () => {
		gameStatus = 'started';
		currentPhase = 0;
		ai1Status = 'playing';
		ai2Status = 'playing';
		playerStatus = 'playing';
		playerDecision = '';
		winner = '';
		revealAllHands = false;
		playerContribution = 0;
		ai1Contribution = 0;
		ai2Contribution = 0;

		rotateDealer();
		postBlinds();

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

	const determineAIBets = () => {
		const toCall = currentBet;
		if (ai1Status === 'playing' && ai1Contribution < toCall) {
			const action = Math.random();
			if (action < 0.6)
				placeBet('ai1', toCall - ai1Contribution); // call
			else ai1Status = 'fold';
		}
		if (ai2Status === 'playing' && ai2Contribution < toCall) {
			const action = Math.random();
			if (action < 0.6)
				placeBet('ai2', toCall - ai2Contribution); // call
			else ai2Status = 'fold';
		}
	};

	const checkIfGameOver = (board: any[]) => {
		const alivePlayers = [
			{ name: 'Toi', cards: playerStatus === 'playing' ? playerCards : [], status: playerStatus },
			{ name: 'IA 1', cards: ai1Status === 'playing' ? ai1Cards : [], status: ai1Status },
			{ name: 'IA 2', cards: ai2Status === 'playing' ? ai2Cards : [], status: ai2Status }
		].filter((p) => p.status !== 'fold');

		if (alivePlayers.length === 1) {
			winner = `${alivePlayers[0].name} gagne car tout le monde s'est couché !`;
			isPlayerWinner = alivePlayers[0].name === 'Toi';
			isDraw = false;
			gameStatus = '';
			revealAllHands = true;
			currentPhase = 3;
			chips[alivePlayers[0].name.toLowerCase().replace(' ', '')] += pot;
			pot = 0;
			return true;
		}
		return false;
	};

	const nextPhase = () => {
		hasActedThisPhase = false;
		playerDecision = '';
		currentPhase += 1;

		const board = [...flop, ...(turn ? [turn] : []), ...(river ? [river] : [])];

		determineAIBets();

		if (checkIfGameOver(board)) return;

		if (currentPhase === 1) {
			playerHandDesc = evaluateHand([...playerCards, ...flop]);
		} else if (currentPhase === 2) {
			const board = [...flop, turn];
			playerHandDesc = evaluateHand([...playerCards, ...board]);
		}

		autoAdvanceIfFold();

		if (currentPhase === 3) {
			const board = [...flop, turn, river];
			playerHandDesc = evaluateHand([...playerCards, ...board]);
			revealAllHands = true;

			const finalPlayer = playerStatus === 'playing' ? playerCards : [];
			const finalAi1 = ai1Status !== 'fold' ? ai1Cards : [];
			const finalAi2 = ai2Status !== 'fold' ? ai2Cards : [];

			const result = determineWinner(finalPlayer, finalAi1, finalAi2, board);
			isDraw = result.toLowerCase().includes('égalité');
			isPlayerWinner = !isDraw && result.includes('Toi');
			winner = result;

			if (isDraw) {
				chips.player += Math.floor(pot / 2);
				chips.ai1 += Math.floor(pot / 2);
			} else if (isPlayerWinner) {
				chips.player += pot;
			} else if (result.includes('IA 1')) {
				chips.ai1 += pot;
			} else if (result.includes('IA 2')) {
				chips.ai2 += pot;
			}
			pot = 0;
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

	const displayGame = () => {
		document.getElementById('playButton')?.classList.add('hidden');
		document.getElementById('game')?.classList.remove('hidden');
		startGame();
	};

	const canPlayerCall = () => chips.player >= currentBet - playerContribution;
	const canPlayerRaise = () => chips.player >= currentBet - playerContribution + minRaise;
	const playerCall = () => {
		if (!canPlayerCall()) return;
		placeBet('player', currentBet - playerContribution);
		hasActedThisPhase = true;
		nextPhase();
	};
	const playerRaise = () => {
		if (!canPlayerRaise()) return;
		const raiseAmount = minRaise;
		placeBet('player', currentBet - playerContribution + raiseAmount);
		currentBet += raiseAmount;
		hasActedThisPhase = true;
		nextPhase();
	};
	const playerFold = () => {
		playerStatus = 'fold';
		hasActedThisPhase = true;
		nextPhase();
	};
</script>

<HomeLayout>
	<div
		id="playButton"
		class="border-1 flex h-96 w-96 flex-col justify-between rounded-lg border-black bg-[url(https://medias.lequipe.fr/img-ilosport-jpg/poker-aces-pair/1500000000406175/0-1200-604-75/7f4b1.jpg)] bg-cover bg-center p-4 text-white"
	>
		<h1 class="text-2xl font-bold">Poker</h1>
		<button
			class="rounded bg-blue-500 px-4 py-2 font-bold text-white"
			on:click|preventDefault={displayGame}>Jouer</button
		>
	</div>

	<div
		id="game"
		class="flex hidden min-h-[96vh] flex-col items-center justify-between space-y-8 overflow-hidden rounded-lg bg-green-800 py-4 text-white"
	>
		<div class="flex w-full max-w-4xl justify-around text-lg font-semibold text-white">
			<div class="flex items-center gap-2">
				<svg class="h-6 w-6 fill-yellow-300" viewBox="0 0 100 100"
					><circle cx="50" cy="50" r="48" stroke="white" stroke-width="4" fill="#facc15" /></svg
				>
				Pot : {pot}
			</div>
			<div class="flex items-center gap-2">
				<svg class="h-6 w-6 fill-green-300" viewBox="0 0 100 100"
					><circle cx="50" cy="50" r="48" stroke="white" stroke-width="4" fill="#4ade80" /></svg
				>
				Toi : {chips.player}
			</div>
			<div class="flex items-center gap-2">
				<svg class="h-6 w-6 fill-blue-300" viewBox="0 0 100 100"
					><circle cx="50" cy="50" r="48" stroke="white" stroke-width="4" fill="#60a5fa" /></svg
				>
				IA 1 : {chips.ai1}
			</div>
			<div class="flex items-center gap-2">
				<svg class="h-6 w-6 fill-pink-400" viewBox="0 0 100 100"
					><circle cx="50" cy="50" r="48" stroke="white" stroke-width="4" fill="#f472b6" /></svg
				>
				IA 2 : {chips.ai2}
			</div>
		</div>

		<div class="flex gap-12">
			<div class="text-center">
				<p class="mb-1">IA 1 <span class="text-sm italic">({ai1Status})</span></p>
				<div class="flex gap-2">
					{#each ai1Cards as card}
						<img
							src={revealAllHands && ai1Status !== 'fold'
								? card.image
								: 'https://deckofcardsapi.com/static/img/back.png'}
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
							src={revealAllHands && ai2Status !== 'fold'
								? card.image
								: 'https://deckofcardsapi.com/static/img/back.png'}
							class="w-16 rounded opacity-100"
							style="opacity: {ai2Status === 'fold' ? 0.3 : 1}"
							alt="AI Card"
						/>
					{/each}
				</div>
			</div>
		</div>

		<div class="flex gap-2 border-b border-t py-4">
			{#if currentPhase >= 1}
				{#each flop as card}
					<img src={card.image} class="w-20 rounded shadow" alt="Flop Card" />
				{/each}
			{/if}
			{#if currentPhase >= 2}
				<img src={turn.image} class="w-20 rounded shadow" alt="Turn Card" />
			{/if}
			{#if currentPhase >= 3}
				<img src={river.image} class="w-20 rounded shadow" alt="River Card" />
			{/if}
		</div>

		<div class="text-center">
			<p class="mb-2">Toi</p>
			<div class="flex gap-2">
				{#each playerCards as card}
					<img
						src={card.image}
						class="w-20 rounded shadow"
						alt="Player Card"
						style="opacity: {playerStatus === 'fold' ? 0.3 : 1}"
					/>
				{/each}
			</div>
			{#if playerHandDesc}
				<p class="mt-1 text-sm italic text-gray-400">
					Main : {playerHandDesc.hand.replace(/_/g, ' ')}
				</p>
			{/if}
		</div>

		<div class="flex flex-col gap-4">
			{#if currentPhase < 3 && playerStatus === 'playing'}
				<div class="mt-6 flex justify-center gap-4">
					{#if chips.player >= currentBet - playerContribution}
						<Button
							class="{currentBet - playerContribution === 0
								? 'bg-green-500 hover:bg-green-600'
								: 'bg-yellow-500 hover:bg-yellow-600'} rounded-xl px-4 py-2 text-black"
							on:click={playerCall}
						>
							{currentBet - playerContribution === 0
								? 'Check'
								: `Call ${currentBet - playerContribution}`}
						</Button>
					{/if}
					{#if chips.player >= currentBet - playerContribution + minRaise}
						<Button
							class="rounded-xl bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
							on:click={playerRaise}
						>
							Raise
						</Button>
					{/if}
					<Button
						class="rounded-xl bg-red-600 px-4 py-2 text-white hover:bg-red-700"
						on:click={playerFold}
					>
						Fold
					</Button>
				</div>
			{/if}

			{#if winner}
				<div
					class="animate-fade-in mx-auto mt-6 max-w-md rounded-2xl border-4 px-6 py-4 text-center shadow-lg
					{isDraw
						? 'border-gray-300 bg-gray-500 text-white'
						: isPlayerWinner
							? 'border-white bg-lime-400 text-gray-900'
							: 'border-red-800 bg-red-600 text-white'}"
				>
					<h2 class="text-2xl font-extrabold tracking-wide">
						{#if isDraw}
							🤝 Égalité 🤝
						{:else if isPlayerWinner}
							🎉 Gagné 🎉
						{:else}
							💀 Perdu 💀
						{/if}
					</h2>
					<p class="mt-2 text-lg font-medium">{winner}</p>
				</div>
			{/if}

			<Button
				on:click={startGame}
				class="rounded bg-gray-800 px-4 py-2 hover:bg-gray-900 {gameStatus === 'started'
					? 'hidden'
					: ''}"
			>
				Nouvelle partie
			</Button>
		</div>
	</div>
</HomeLayout>
