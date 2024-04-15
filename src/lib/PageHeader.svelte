<script>
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
</script>

<header class="space-y-4">
	<nav class="flex gap-4">
		<button
			class="hover:underline"
			on:click={() => {
				goto('/login');
			}}
			disabled={$page.url.pathname === '/login'}>Log in</button
		>
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
				goto('/logout');
			}}
			disabled={$page.url.pathname === '/logout'}>Log Out</button
		>
	</nav>
	<h1>Firebase for Fun and Profit</h1>
</header>

<style lang="postcss">
	h1 {
		color: darkred;
		background: #eee;
	}
</style>
