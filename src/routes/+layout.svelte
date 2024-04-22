<script>
	import { page } from '$app/stores';
	import { auth } from '$lib/auth';
	import PageHeader from '$lib/PageHeader.svelte';
	import PageFooter from '$lib/PageFooter.svelte';

	export let data;

	const page_to_role = {
		'/onlyAdmin': 'admin',
		'/onlyUser': 'user'
	};

	$: loginRequired = $page.url.pathname in page_to_role;
	$: claims = data.claims;
//	$: claims = !$auth || !$auth.claims ? {} : $auth.claims;
// 	auth().currentUser.getIdTokenResult()
//   .then((idTokenResult) => {
//      // Confirm the user is an Admin.
//      if (!!idTokenResult.claims.admin) {


	$: shouldRender = !loginRequired || page_to_role[$page.url.pathname] in claims;
</script>

<PageHeader />
<div class="container">
	<!-- <pre>{JSON.stringify(
			{
				data,
				page_to_role,
				loginRequired,
				claims,
				shouldRender,
				auth: $auth,
				//idtoken: auth().currentUser.getIdTokenResult(),
				page: $page.url.pathname,
				roleReq: page_to_role[$page.url.pathname]
			},
			null,
			2
		)}</pre> -->
</div>
{#if shouldRender}
	<slot />
{:else}
	<p>Access Denied</p>
{/if}
<PageFooter />
