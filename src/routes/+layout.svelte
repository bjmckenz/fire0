<script>
	import Forbidden from '$lib/Forbidden.svelte';
	import PageHeader from '$lib/PageHeader.svelte';
	import PageFooter from '$lib/PageFooter.svelte';

	export let data;
</script>

<PageHeader />

{#if data.grant_access}
	<slot />
{:else}
	<Forbidden />
{/if}

<PageFooter />
<pre> {JSON.stringify(data,null,2)} </pre>
