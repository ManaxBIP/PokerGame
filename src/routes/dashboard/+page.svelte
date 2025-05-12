<script lang="ts">
	import '../../app.css';
	import HomeLayout from '$lib/layouts/home.svelte';

	export let data;
</script>

<HomeLayout user={data.user} />