<script lang="ts">
    import House from "lucide-svelte/icons/house";
    import ChartLine from "lucide-svelte/icons/chart-line";
    import Package2 from "lucide-svelte/icons/package-2";
    import PanelLeft from "lucide-svelte/icons/panel-left";
    import Gamepad2 from "lucide-svelte/icons/gamepad-2";
    import { Button } from "$lib/components/ui/button/index.js";
    import SideBarItem from "$lib/components/nav/side-bar-item.svelte";
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
    import * as Sheet from "$lib/components/ui/sheet/index.js";

    export let user: { fullName: string; email: string } | null = null;
</script>
<aside class="bg-background fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r sm:flex">
        <nav class="flex flex-col items-center gap-4 px-2 sm:py-5">
            <a
                    href="##"
                    class="bg-white border-1 border-black text-primary-foreground group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full text-lg font-semibold md:h-8 md:w-8 md:text-base"
            >
                <img src="favicon.svg" alt="Logo" class="h-5 w-5" />
            </a>
            <SideBarItem routeUrl="/" label="Home" icon={House}/>
            <SideBarItem routeUrl="/playground" label="Playground" icon={Gamepad2} />
        </nav>
        <nav class="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
            <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild let:builder>
                    <Button
                            builders={[builder]}
                            variant="outline"
                            size="icon"
                            class="overflow-hidden rounded-full"
                    >
                        {#if user}
                            <img
                                    src={`https://unavatar.io/${user.email}?fallback=https://avatar.vercel.sh/${user.fullName}?size=128`}
                                    width={36}
                                    height={36}
                                    alt="Avatar"
                                    class="overflow-hidden rounded-full"
                            />
                        {:else}
                        <span>CN</span>
                        {/if}
                    </Button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Content align="end" side="right">
                    <DropdownMenu.Label>My Account</DropdownMenu.Label>
                    <DropdownMenu.Separator />
                    <DropdownMenu.Item>Settings</DropdownMenu.Item>
                    <DropdownMenu.Item>Support</DropdownMenu.Item>
                    <DropdownMenu.Separator />
                    <form method="POST" action="/logout">
                        <DropdownMenu.Item asChild>
                            <button type="submit" class="w-full text-left">Logout</button>
                        </DropdownMenu.Item>
                    </form>

                </DropdownMenu.Content>
            </DropdownMenu.Root>
        </nav>
    </aside>
    <div class="flex flex-col sm:gap-4 sm:py-4 sm:pl-14 h-full">
        <header
                class="bg-background sticky top-0 z-30 flex h-14 items-center gap-4 border-b px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 justify-between"
        >
            <Sheet.Root>
                <Sheet.Trigger asChild let:builder>
                    <Button builders={[builder]} size="icon" variant="outline" class="sm:hidden">
                        <PanelLeft class="h-5 w-5" />
                        <span class="sr-only">Toggle Menu</span>
                    </Button>
                </Sheet.Trigger>
                <Sheet.Content side="left" class="sm:max-w-xs">
                    <nav class="grid gap-6 text-lg font-medium">
                        <a
                                href="##"
                                class="bg-primary text-primary-foreground group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full text-lg font-semibold md:text-base"
                        >
                            <Package2 class="h-5 w-5 transition-all group-hover:scale-110" />
                            <span class="sr-only">Acme Inc</span>
                        </a>
                        <SideBarItem routeUrl="/" label="Home" icon={House} mobile />
                        <SideBarItem routeUrl="/playground" label="Playground" icon={Gamepad2} mobile />
                    </nav>
                </Sheet.Content>
            </Sheet.Root>
            <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild let:builder>
                    <Button
                            builders={[builder]}
                            variant="outline"
                            size="icon"
                            class="overflow-hidden rounded-full sm:hidden"
                    >
                        <img
                                src="https://unavatar.io/nayanmallet@gmail.com?fallback=https://avatar.vercel.sh/NayanMallet?size=128"
                                width={36}
                                height={36}
                                alt="Avatar"
                                class="overflow-hidden rounded-full"
                        />
                    </Button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Content align="end">
                    <DropdownMenu.Label>My Account</DropdownMenu.Label>
                    <DropdownMenu.Separator />
                    <DropdownMenu.Item>Settings</DropdownMenu.Item>
                    <DropdownMenu.Item>Support</DropdownMenu.Item>
                    <DropdownMenu.Separator />
                    <form method="POST" action="/logout">
                        <DropdownMenu.Item asChild>
                            <button type="submit" class="w-full text-left">Logout</button>
                        </DropdownMenu.Item>
                    </form>
                </DropdownMenu.Content>
            </DropdownMenu.Root>
        </header>
        <slot></slot>
    </div>