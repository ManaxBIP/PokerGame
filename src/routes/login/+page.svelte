<script lang="ts">
    import '../../app.css';
    import AuthLayout from "$lib/layouts/auth.svelte";
    import { Button } from "$lib/components/ui/button/index.js";
    import { Input } from "$lib/components/ui/input/index.js";
    import { Label } from "$lib/components/ui/label/index.js";
</script>

<AuthLayout>
    <div class="mx-auto grid w-[350px] gap-6">
        <div class="grid gap-2 text-center">
            <h1 class="text-3xl font-bold">Login</h1>
            <p class="text-muted-foreground text-balance">
                Enter your email below to login to your account
            </p>
        </div>
        <div class="grid gap-4">
            <div class="grid gap-2">
                <Label for="email">Email</Label>
                <Input id="email" type="email" placeholder="m@example.com" required />
            </div>
            <div class="grid gap-2">
                <div class="flex items-center">
                    <Label for="password">Password</Label>
                    <a href="##" class="ml-auto inline-block text-sm underline">
                        Forgot your password?
                    </a>
                </div>
                <Input id="password" type="password" placeholder="•••••••" required />
            </div>
            <Button type="submit" class="w-full">Login</Button>
            <Button variant="outline" class="w-full">Login with Google</Button>
        </div>
        <div class="mt-4 text-center text-sm">
            Don&apos;t have an account?
            <a href="/sign-up" class="underline"> Sign up </a>
        </div>
    </div>
</AuthLayout>