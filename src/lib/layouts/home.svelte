<script lang="ts">
    import SideBar from "@/components/nav/side-bar.svelte";
</script>

<div class="bg-muted/40 flex w-svw h-svh flex-col">
    <SideBar>
        <main class="grid h-full flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
            <slot></slot>
        </main>
    </SideBar>
</div>
