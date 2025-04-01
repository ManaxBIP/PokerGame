<script lang="ts">
	import '../../app.css';
	import HomeLayout from '@/layouts/home.svelte'
	import { onMount } from 'svelte';

	import { page } from '$app/stores';
	import { trpc } from '@/trpc/client';

	interface DeckData {
		deck_id: string;
		remaining: number;
		shuffled: boolean;
		success: boolean;
	}

	interface Card {
		code: string;
		image: string;
		images: {
			svg: string;
			png: string;
		};
		value: string;
		suit: string;
	}

	interface CardData {
		success: boolean;
		deck_id: string;
		cards: Card[];
		remaining: number;
	}

	let greeting = 'press the button to load data';
	let loading = false;
	let deckData: DeckData | null = null;
	let cardData: CardData | null = null;

	const loadData = async () => {
		loading = true;
		deckData = await trpc($page).shuffleDeck.query();
		greeting = `Deck ID: ${deckData?.deck_id}`;
		loading = false;

	};

	const drawCard = async () => {
		if (!deckData) return;
		loading = true;
		cardData = await trpc($page).drawCard.query({ deckId: deckData.deck_id });
		loading = false;
	};

	onMount(() => {
		loadData();
	});
</script>

<HomeLayout>
	<a
		href="#draw"
		role="button"
		class="secondary"
		aria-busy={loading}
		on:click|preventDefault={drawCard}>Draw Card</a
	>
	<!--    <p>{greeting}</p>-->
	{#if cardData}
		<!--        <p>Card: {cardData.cards[0].value} of {cardData.cards[0].suit}</p>-->
		{#each cardData.cards as card}
			<img src={card.image} alt="card" class="h-[9rem]"/>
		{/each}

	{/if}
</HomeLayout>