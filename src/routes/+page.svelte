<script>
  import { goto } from '$app/navigation';
</script>

<h1>Sample Firebase-using Svelte App</h1>

<p>(This home page is publicly visible)</p>
<p>Currently implemented: email/password</p>

<p>Go to page that is publicly available.</p>
<button on:click={() => {goto('/public')}}>/public</button>

<p>Go to page that is available only to logged-in users (or Admin users).</p>
<button on:click={() => {goto('/product')}}>/product</button>

<p>Go to user profile which is available only to logged-in users.</p>
<button on:click={() => {goto('/user/profile')}}>/user/profile</button>

<p>Go to page that is available only to useradmin users.</p>
<button on:click={() => {goto('/useradmin')}}>/useradmin</button>

<p>Go to page that is available only to logged-in SUPER users.</p>
<button on:click={() => {goto('/admin')}}>/admin</button>


