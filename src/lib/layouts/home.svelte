<script lang="ts">
    import SideBar from "@/components/nav/side-bar.svelte";
    export let user: { fullName: string; email: string } | null = null;
</script>

<div class="bg-muted/40 flex w-svw h-svh flex-col">
    <SideBar {user}>
        <main class="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
            <slot></slot>
        </main>
    </SideBar>
</div>

