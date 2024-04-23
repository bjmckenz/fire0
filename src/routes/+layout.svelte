<script>
	import PageHeader from '$lib/PageHeader.svelte';
	import PageFooter from '$lib/PageFooter.svelte';

	export let data;
</script>

<PageHeader />
<pre>{JSON.stringify(data.auth_data,null,2)}</pre>
{#if data.grant_access}
	<slot />
{:else}
	<p>Access Denied</p>
{/if}

<PageFooter />
