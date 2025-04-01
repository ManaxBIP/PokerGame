<script lang="ts">
    import '../../app.css';
    import AuthLayout from "@/layouts/auth.svelte";
    import { Button } from "@/components/ui/button";
    import { Input } from "@/components/ui/input";
    import { Label } from "@/components/ui/label";
</script>

<AuthLayout>
    <div class="mx-auto grid w-[350px] gap-6">
        <div class="grid gap-2 text-center">
            <h1 class="text-3xl font-bold">Sign up</h1>
            <p class="text-muted-foreground text-balance">
                Enter your informations below to create an account
            </p>
        </div>
        <div class="grid gap-6">
            <div class="grid gap-2">
                <Label for="email">Email</Label>
                <Input id="email" type="email" placeholder="m@example.com" required />
                <Label for="confirm_email">Confirm email</Label>
                <Input id="confirm_email" type="email" placeholder="m@example.com" required />
            </div>
            <div class="grid gap-2">
                <Label for="password">Password</Label>
                <Input id="password" type="password" placeholder="•••••••" required />
                <Label for="confirm_password">Confirm password</Label>
                <Input id="confirm_password" type="password" placeholder="•••••••" required />
            </div>
            <Button type="submit" class="w-full">Sign up</Button>
            <Button variant="outline" class="w-full">Sign up with Google</Button>
        </div>
        <div class="mt-4 text-center text-sm">
            Already have an account?
            <a href="/login" class="underline"> Login </a>
        </div>
    </div>
</AuthLayout>