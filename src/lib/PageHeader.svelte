<script>
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { signOut } from 'firebase/auth';
	import { firebaseAuth } from '$lib/firebase';
	import { authUser } from '$lib/authStore';

	const handleLogout = () => {
		signOut(firebaseAuth)
			.then(() => {
				$authUser = undefined;
				goto('/');
			})
			.catch((error) => {
				console.log(error);
			});
	};
</script>

<header class="space-y-4">
	<nav class="flex gap-4">
		{#if $authUser}
			<span>User: {$authUser.email}</span>
			<button class="hover:underline" on:click={handleLogout}>Logout</button>
		{:else}
			<button
				class="hover:underline"
				on:click={() => {
					goto('/register');
				}}
				disabled={$page.url.pathname === '/register'}>Create Account</button
			>
			<button
				class="hover:underline"
				on:click={() => {
					console.log({page:$page});
					goto('/login');
				}}
				disabled={$page.url.pathname === '/login'}>Log In</button
			>
		{/if}
	</nav>
	<h1>Firebase for Fun and Profit</h1>
</header>

<style lang="postcss">
	h1 {
		color: darkred;
		background: #eee;
	}
</style>
