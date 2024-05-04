<script>
	import { goto } from '$app/navigation';
	export let form;
</script>

<button on:click={() => goto('/useradmin')}>User Admin</button>

{#if form?.message && !form?.error}
	<div class="message">{form.message}</div>
{/if}

{#if form?.error}
	<div class="bad">{form.error}</div>
{/if}

<div class="section">Enter a user's email, then grant or revoke roles from them.</div>

<form action="?/execute" method="post">
	<div>
		<label for="email">User Email:</label>
		<input required type="email" name="email" value={form?.email ?? ''} />
	</div>
	<div>
		<button class="btn" formaction="?/listRoles" type="submit">List Roles</button>
		<button class="btn" formaction="?/clearApplicationId" type="submit"
			>Remove their application_userid</button
		>
		<button class="btn" formaction="?/deleteFirebaseAccount" type="submit"
			>Delete their app account</button
		>
	</div>
	<div class="roleActions">
		<div>
			<label for="role">Role:</label>
			<input type="text" id="role" name="role" value={form?.role ?? ''} />
		</div>

		<div>
			<button class="btn" formaction="?/grantRole" type="submit"
				>Grant</button
			>
			<button class="btn" formaction="?/revokeRole" type="submit">Revoke</button>
		</div>
	</div>
</form>

<style>
	.section {
		margin: 1em 0;
	}

	form {
		display: grid;
		/* grid-template-columns: 1fr 1fr; */
		gap: 1em;
	}

	input[type='text'] {
		width: 100%;
	}

	button {
		font-size: larger;
		font-weight: bold;
	}
	.section {
		font-size: larger;
		font-weight: bold;
	}

	.bad {
		margin: 1em 0;
		padding: 1em;
		font-weight: bold;
		background-color: #f29d9d;
		border: 1px solid #ccc;
	}

	.roleActions {
		margin: 1em 0;
		padding: 1em;
		background-color: #d1eefb;
		border: 1px solid #eee;
	}

	.message {
		margin: 1em 0;
		padding: 1em;
		background-color: #a5f699;
		border: 1px solid #ccc;
	}
</style>
