<script lang="ts">
    import '../../app.css';
    import AuthLayout from "@/layouts/auth.svelte";
    import LoginForm from "./login-form.svelte";
    import { page } from '$app/state';


</script>

<AuthLayout>
    <LoginForm data={page.data.form} />
</AuthLayout>