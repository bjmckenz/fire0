<script>
	import { invalidateAll } from '$app/navigation';

	// returned from the load() function
	export let data = {};
	// returned from the login action
	export let form;

	invalidateAll();

</script>

{#if form?.missing}<p class="error">Email and password are both required</p>{/if}
{#if form?.invalid}<p class="error">Invalid credentials!</p>{/if}

<form method="POST" class="flex flex-col gap-4 p-8 space-y-4 bg-white sm:w-10/12" action="?/login">
	<input
		type="email"
		placeholder="Email address"
		class="px-4 py-2 border border-gray-300 rounded-md"
		required
		name="email"
		value={form?.email ?? ''}
	/>
	<input
		type="password"
		placeholder="Password"
		class="px-4 py-2 border border-gray-300 rounded-md"
		required
		name="password"
	/>

	<br />
	<button class="default-action">Log In</button>
</form>
