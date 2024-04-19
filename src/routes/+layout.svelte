<script>
	import PageHeader from '$lib/PageHeader.svelte';
	import PageFooter from '$lib/PageFooter.svelte';
	import { auth } from '$lib/auth';
	import {page} from '$app/stores'

	$: loginRequired = $page.url.pathname.startsWith('/onlyAdmin') || $page.url.pathname.startsWith('/onlyUser');
	$: shouldRender = !loginRequired || $auth;
</script>

<PageHeader/>
{#if shouldRender}
	<slot />
{:else}
	<p>Access Denied</p>
{/if}
<PageFooter />


