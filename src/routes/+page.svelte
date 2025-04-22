<script lang="ts">
    import '../app.css';
    import HomeLayout from "$lib/layouts/home.svelte";
	import { users } from '@/trpc/routes/authors';

    export let data;
    console.log('data', data);
    
</script>

<HomeLayout>
    <!-- <h1 class="text-2xl">Bienvenue {data.user.fullName} 👋</h1> -->
</HomeLayout>