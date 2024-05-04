<script>
	import { goto } from '$app/navigation';
	export let form;
</script>

<button on:click={() => goto('/useradmin')}>User Admin</button>

{#if form && form.message && !form.error }
	<div class="message">{form.message}</div>
{/if}

{#if form && form.error}
	<div class="bad">{form.error}</div>
{/if}

<div class="section">Enter a user's email, then grant or revoke roles from them.</div>

<form action="?/execute" method="post">
	<div>
		<label for="email">User Email:</label>
		<input type="email" name="email" value={form ? form.email ?? '' : ''} />
	</div>
	<div class="roleActions">
		<div>
			<label for="role">Role (only for grant or revoke):</label>
			<input type="text" id="role" name="role" value={form ? form.role ?? '' : ''} />
		</div>

		<div class="section">Action:</div>
		<div>
			<input type="radio" name="action" id="check" value="check" />
			<label for="check">(List Roles)</label>
			<input type="radio" name="action" id="grant" value="grant" />
			<label for="grant">Grant</label>
			<input type="radio" name="action" id="revoke" value="revoke" />
			<label for="revoke">Revoke</label>
			<input type="radio" name="action" id="reset" value="reset" />
			<label for="revoke">(Remove their application_userid)</label>
			<input type="radio" name="action" id="delete" value="delete" />
			<label for="revoke">(Delete their app account)</label>
		</div>
	</div>
	<button class="btn" type="submit">Execute</button>
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

	input[type='radio'] {
		margin-right: 0.5em;
	}

	button {
		/* grid-column: 1 / -1; */
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
