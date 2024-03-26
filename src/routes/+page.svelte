<script>
  import { goto } from '$app/navigation';
</script>

<h1>Sample Firebase-using Svelte App</h1>

<p>(This home page is publicly visible)</p>
<p>Currently implemented: email/password</p>

<p>Go to page that is publicly available.</p>
<button on:click={() => {goto('/public')}}>No Auth Required</button>

<p>Go to page that is available only to logged-in users (or Admin users).</p>
<button on:click={() => {goto('/onlyUser')}}>Auth Required</button>

<p>Go to page that is available only to logged-in SUPER users.</p>
<button on:click={() => {goto('/onlyAdmin')}}>Auth as Admin Required</button>


