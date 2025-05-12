<script lang="ts">
	import * as Form from "$lib/components/ui/form";
	import * as Alert from "$lib/components/ui/alert";
	import { Input } from "$lib/components/ui/input";
	import { formSchema, type FormSchema } from "./schema";
	import CircleAlert from "lucide-svelte/icons/circle-alert";
	import {
		type SuperValidated,
		type Infer,
		superForm,
	} from "sveltekit-superforms";
	import { zodClient } from "sveltekit-superforms/adapters";
	import { goto } from "$app/navigation";
	import { page } from "$app/state";

	type Props = {
		data: SuperValidated<Infer<FormSchema>>;
	};

	let { data }: Props = $props();

	let errorMessage = $derived(page.form?.error);

	const form = superForm(data, {
		validators: zodClient(formSchema),
		validationMethod: 'oninput',
		customValidity: true,
		onResult: ({ result }) => {
			if (result.type === 'success') {
				goto("/dashboard");
			}
		}
	});

	const { form: formData, enhance } = form;
</script>

<form
	class="flex h-full w-full items-center justify-center"
	action="?/signup"
	method="POST"
	use:enhance
>
	<div class="mx-auto grid w-[350px] gap-6">
		<div class="grid gap-2 text-center">
			<h1 class="text-3xl font-bold">Sign Up</h1>
			<p class="text-muted-foreground text-balance">
				Enter your informations below to create an account
			</p>
		</div>

		{#if errorMessage}
			<Alert.Root variant="destructive">
				<CircleAlert class="h-4 w-4" />
				<Alert.Title>Erreur</Alert.Title>
				<Alert.Description>{errorMessage}</Alert.Description>
			</Alert.Root>
		{/if}

		<div class="grid gap-4">
			<div>
				<Form.Field {form} name="fullName">
					<Form.Control let:attrs>
						<Form.Label>Full Name</Form.Label>
						<Input {...attrs} bind:value={$formData.fullName} placeholder="John Doe" />
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>

				<Form.Field {form} name="email">
					<Form.Control let:attrs>
						<Form.Label>Email</Form.Label>
						<Input {...attrs} bind:value={$formData.email} placeholder="m@example.com" />
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>

				<Form.Field {form} name="password">
					<Form.Control let:attrs>
						<Form.Label>Password</Form.Label>
						<Input {...attrs} type="password" bind:value={$formData.password} placeholder="•••••••" />
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>

				<Form.Field {form} name="confirm_password">
					<Form.Control let:attrs>
						<Form.Label>Confirm Password</Form.Label>
						<Input {...attrs} type="password" bind:value={$formData.confirm_password} placeholder="•••••••" />
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
			</div>

			<div class="grid gap-2">
				<Form.Button type="submit" class="w-full">Sign-up</Form.Button>
				<Form.Button variant="outline" class="w-full">Sign-up with Google</Form.Button>
			</div>

			<a class="mt-4 text-center text-sm group" href="/login">
				Already have an account?
				<span class="group-hover:underline group-hover:cursor-pointer">Login</span>
			</a>
		</div>
		</div>
</form>