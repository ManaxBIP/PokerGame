<script lang="ts">
	import * as Tooltip from "$lib/components/ui/tooltip/index.js";
	import { page } from "$app/stores";
	import { derived } from "svelte/store";

	export let label: string;
	export let routeUrl: string;
	export let icon: typeof import("lucide-svelte").Icon;
	export let mobile: boolean = false; // mode menu mobile avec texte
	export let baseClass: string =
		"text-muted-foreground hover:text-foreground transition-colors";
	export let activeClass: string =
		"bg-accent text-accent-foreground";

	const isActive = derived(page, ($page) => $page.url.pathname === routeUrl);
</script>

{#if mobile}
	<a
		href={routeUrl}
		class={`flex items-center gap-4 px-2.5 ${$isActive ? activeClass : baseClass}`}
	>
		<svelte:component this={icon} class="h-5 w-5" />
		{label}
	</a>
{:else}
	<Tooltip.Root>
		<Tooltip.Trigger asChild let:builder>
			<a
				href={routeUrl}
				class={`flex h-9 w-9 md:h-8 md:w-8 items-center justify-center rounded-lg ${$isActive ? activeClass : baseClass}`}
				use:builder.action
				{...builder}
			>
				<svelte:component this={icon} class="h-5 w-5" />
				<span class="sr-only">{label}</span>
			</a>
		</Tooltip.Trigger>
		<Tooltip.Content side="right">{label}</Tooltip.Content>
	</Tooltip.Root>
{/if}
