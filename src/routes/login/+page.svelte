<script>
	import { goto } from '$app/navigation';
	let email;
	let password;

	function login() {
		console.log('Logging in');
	}
	function cancel_login() {
		console.log('Canceling login');
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
<button on:click={login}>Log In</button>
<button on:click={cancel_login}>Cancel</button>
