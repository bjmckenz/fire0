<script>
	import { page } from '$app/stores';
	import { auth } from '$lib/auth';
	import PageHeader from '$lib/PageHeader.svelte';
	import PageFooter from '$lib/PageFooter.svelte';

	const page_to_role = {
		'/onlyAdmin': 'admin',
		'/onlyUser': 'user'
	};

	$: loginRequired = $page.url.pathname in page_to_role;
	$: claims = !$auth ? {} : $auth.claims;
	$: shouldRender = !loginRequired || page_to_role[$page.url.pathname] in claims;
</script>

<PageHeader />
<!-- <div class="container">
	<pre>{JSON.stringify(
			{
				page_to_role,
				loginRequired,
				claims,
				shouldRender,
				auth: $auth,
				page: $page.url.pathname,
				roleReq: page_to_role[$page.url.pathname]
			},
			null,
			2
		)}</pre>
</div> -->
{#if shouldRender}
	<slot />
{:else}
	<p>Access Denied</p>
{/if}
<PageFooter />
