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
                    class="bg-primary text-primary-foreground group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full text-lg font-semibold md:h-8 md:w-8 md:text-base"
            >

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 296.664 296.664"
                  xml:space="preserve"
                  class="h-4 w-4 transition-all group-hover:scale-110 fill-primary-foreground"
                >
                    <g>
                        <path d="M58.355,226.748V69.414c0-1.709,0.294-3.391,0.526-5.039L13.778,79.057C3.316,82.455-2.42,93.797,0.979,104.258
                        l48.639,149.633c2.738,8.428,10.639,13.816,19.075,13.816c2.035,0,4.109-0.315,6.143-0.975l12.796-4.211
                        C71.066,259.213,58.355,244.242,58.355,226.748z"/>
                        <polyline style="fill:none;stroke:#FFFFFF;stroke-width:0;stroke-linecap:round;stroke-linejoin:round;" points="122.688,28.957
                        122.688,29.207 122.7,29.207 	"/>
                        <path d="M91.098,203.275l48.617-149.602c0.491-1.512,1.078-3.342,1.746-4.342H94.688c-11,0-20.333,9.082-20.333,20.082v157.334
                        c0,11,9.333,20.584,20.333,20.584h15.969C94.061,239.332,85.361,220.932,91.098,203.275z"/>
                        <path d="M282.848,79.057L180.134,45.684c-2.034-0.662-4.102-0.975-6.138-0.975c-8.436,0-16.326,5.387-19.064,13.814
                        l-48.617,149.633c-3.399,10.463,2.379,21.803,12.841,25.203l102.713,33.373c2.034,0.66,4.102,0.975,6.138,0.975
                        c8.436,0,16.326-5.389,19.064-13.816l48.618-149.633C299.088,93.797,293.31,82.455,282.848,79.057z M186.839,196.049
                        c-48.438-58.818-20.22-88.049-2.361-87.969c15.049,0.072,21.176,10.863,23.789,21.967c8.049-8.84,19.938-12.586,32.156-3.801
                        C254.922,136.67,260.59,176.898,186.839,196.049z"/>
                    </g>
                </svg>
                <span class="sr-only">PokerGuys Icon</span>
            </a>
            <SideBarItem routeUrl="/" label="Home" icon={House} />
            <SideBarItem routeUrl="/playground" label="Playground" icon={Gamepad2} />
            <SideBarItem routeUrl="/analytics" label="Analytics" icon={ChartLine} />
        </nav>
    {#if user}
        <nav class="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
            <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild let:builder>
                    <Button
                            builders={[builder]}
                            variant="outline"
                            size="icon"
                            class="overflow-hidden rounded-full"
                    >
                        <img
                          src={`https://unavatar.io/${user.email}?fallback=https://avatar.vercel.sh/${user.fullName}?size=128`}
                                width={36}
                                height={36}
                                alt="Avatar"
                                class="overflow-hidden rounded-full"
                        />
                    </Button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Content align="end" side="right">
                    <DropdownMenu.Label>My Account</DropdownMenu.Label>
                    <DropdownMenu.Separator />
                    <DropdownMenu.Item>Settings</DropdownMenu.Item>
                    <DropdownMenu.Item>Support</DropdownMenu.Item>
                    <DropdownMenu.Separator />
                    <DropdownMenu.Item>Logout</DropdownMenu.Item>
                </DropdownMenu.Content>
            </DropdownMenu.Root>
        </nav>
    {:else}
    {/if}
    </aside>
    <div class="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
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
                        <SideBarItem routeUrl="/analytics" label="Analytics" icon={ChartLine} mobile />
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
                    <DropdownMenu.Item>Logout</DropdownMenu.Item>
                </DropdownMenu.Content>
            </DropdownMenu.Root>
        </header>
        <slot></slot>
    </div>