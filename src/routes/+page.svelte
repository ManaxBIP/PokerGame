<script lang="ts">
    import '../app.css';
    import HomeLayout from "$lib/layouts/home.svelte";

    import { page } from '$app/stores';
    import { trpc } from '$lib/trpc/client';

    let greeting = 'press the button to load data';
    let loading = false;

    const loadData = async () => {
        loading = true;
        greeting = await trpc($page).greeting.query();
        loading = false;
    };
</script>

<HomeLayout>
    <playing-card suit=Hearts rank=10 class="w-20 h-20"></playing-card>
    <a
      href="#load"
      role="button"
      class="secondary"
      aria-busy={loading}
      on:click|preventDefault={loadData}>Load</a
    >
    <p>{greeting}</p>
</HomeLayout>