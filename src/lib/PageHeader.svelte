<script>
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	export let data = {};

</script>

<header class="space-y-4">
	<nav class="flex gap-4">
		{#if data.session}
			<span>User: {data.email}</span>
			<form action="/logout" method="post">
				<button class="hover:underline" type="submit">Logout</button>
			</form>
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
					console.log({ page: $page });
					goto('/login');
				}}
				disabled={$page.url.pathname === '/login'}>Log In</button
			>
		{/if}
		{data.session} --
		{data.uid} --
		{data.email}
	</nav>
	<h1>Firebase for Fun and Profit</h1>
</header>

<style lang="postcss">
	h1 {
		color: darkred;
		background: #eee;
	}
</style>
