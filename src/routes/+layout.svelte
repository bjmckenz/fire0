<script>
	import PageHeader from '$lib/PageHeader.svelte';
	import PageFooter from '$lib/PageFooter.svelte';

	export let data = {};
</script>

<PageHeader data={data}/>
<slot />
<PageFooter />


