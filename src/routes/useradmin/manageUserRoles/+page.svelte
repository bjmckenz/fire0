<script>
	export let form;
</script>

{#if form && form.message}
	<div class="message">{form.message}</div>
{/if}

{#if form && form.error}
	<div class="bad">{form.error}</div>
{/if}

<div class="section">Enter a user's email, then grant or revoke roles from them.</div>

<form action="?/execute" method="post">
	<label for="email">User Email:</label>
	<input type="email" name="email" value={form ? form.email ?? '' : ''} />

	<label for="check">Inquire</label>
	<input type="radio" name="action" id="check" value="check" />

	<div class="roleActions">
		<label for="role">Role to grant or revoke:</label>
		<input type="text" id="role" name="role" value={form ? form.role ?? '' : ''} />

		<div class="section">Action:</div>
		<br />
		<label for="grant">Bestow</label>
		<input type="radio" name="action" id="grant" value="grant" />
		<label for="revoke">Smite</label>
		<input type="radio" name="action" id="revoke" value="revoke" />
	</div>
	<button class="btn" type="submit">Execute</button>
</form>

<style>
	.section {
		margin: 1em 0;
	}

	form {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1em;
	}

	input[type='text'] {
		width: 100%;
	}

	input[type='radio'] {
		margin-right: 0.5em;
	}

	button {
		grid-column: 1 / -1;
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
