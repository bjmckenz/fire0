<script>
	import { goto } from '$app/navigation';
	let email;
	let password;

	function create_account() {
		console.log('Registering');
	}
	function cancel_create() {
		console.log('Canceling registration');
		goto('/');
	}
</script>

<input
	bind:value={email}
	type="email"
	placeholder="Email address"
	class="px-4 py-2 border border-gray-300 rounded-md"
	required
/>
<input
	bind:value={password}
	type="password"
	placeholder="Password"
	class="px-4 py-2 border border-gray-300 rounded-md"
	required
/>

<br />
<button on:click={create_account}>Create Account</button>
<button on:click={cancel_create}>Cancel</button>
