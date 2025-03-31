<script>
    import House from "lucide-svelte/icons/house";
    import ChartLine from "lucide-svelte/icons/chart-line";
    import Package2 from "lucide-svelte/icons/package-2";
    import PanelLeft from "lucide-svelte/icons/panel-left";
    import Gamepad2 from "lucide-svelte/icons/gamepad-2";
    import { Button } from "$lib/components/ui/button/index.js";
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
    import * as Sheet from "$lib/components/ui/sheet/index.js";
    import * as Tooltip from "$lib/components/ui/tooltip/index.js";
</script>
<aside class="bg-background fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r sm:flex">
        <nav class="flex flex-col items-center gap-4 px-2 sm:py-5">
            <a
                    href="##"
                    class="bg-primary text-primary-foreground group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full text-lg font-semibold md:h-8 md:w-8 md:text-base"
            >
                <Package2 class="h-4 w-4 transition-all group-hover:scale-110" />
                <span class="sr-only">Acme Inc</span>
            </a>
            <Tooltip.Root>
                <Tooltip.Trigger asChild let:builder>
                    <a
                            href="##"
                            class="text-muted-foreground hover:text-foreground flex h-9 w-9 items-center justify-center rounded-lg transition-colors md:h-8 md:w-8"
                            use:builder.action
                            {...builder}
                    >
                        <House class="h-5 w-5" />
                        <span class="sr-only">Home</span>
                    </a>
                </Tooltip.Trigger>
                <Tooltip.Content side="right">Home</Tooltip.Content>
            </Tooltip.Root>
            <Tooltip.Root>
                <Tooltip.Trigger asChild let:builder>
                    <a
                            href="##"
                            class="bg-accent text-accent-foreground hover:text-foreground flex h-9 w-9 items-center justify-center rounded-lg transition-colors md:h-8 md:w-8"
                            use:builder.action
                            {...builder}
                    >
                        <Gamepad2 class="h-5 w-5" />
                        <span class="sr-only">Playground</span>
                    </a>
                </Tooltip.Trigger>
                <Tooltip.Content side="right">Playground</Tooltip.Content>
            </Tooltip.Root>
            <Tooltip.Root>
                <Tooltip.Trigger asChild let:builder>
                    <a
                            href="##"
                            class="text-muted-foreground hover:text-foreground flex h-9 w-9 items-center justify-center rounded-lg transition-colors md:h-8 md:w-8"
                            use:builder.action
                            {...builder}
                    >
                        <ChartLine class="h-5 w-5" />
                        <span class="sr-only">Analytics</span>
                    </a>
                </Tooltip.Trigger>
                <Tooltip.Content side="right">Analytics</Tooltip.Content>
            </Tooltip.Root>
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
                        <img
                                src="https://unavatar.io/nayanmallet@gmail.com?fallback=https://avatar.vercel.sh/NayanMallet?size=128"
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
                        <a
                                href="##"
                                class="text-muted-foreground hover:text-foreground flex items-center gap-4 px-2.5"
                        >
                            <House class="h-5 w-5" />
                            Home
                        </a>
                        <a
                                href="##"
                                class="text-muted-foreground hover:text-foreground flex items-center gap-4 px-2.5"
                        >
                            <Gamepad2 class="h-5 w-5" />
                            Playground
                        </a>
                        <a
                                href="##"
                                class="text-muted-foreground hover:text-foreground flex items-center gap-4 px-2.5"
                        >
                            <ChartLine class="h-5 w-5" />
                            Analytics
                        </a>
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