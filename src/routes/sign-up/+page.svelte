<script lang="ts">
    import '../../app.css';
    import AuthLayout from "@/layouts/auth.svelte";
    import SignUpForm from "./sign-up-form.svelte";
    import { page } from '$app/state';
</script>

<AuthLayout>
    <SignUpForm data={page.data.form} />
</AuthLayout>