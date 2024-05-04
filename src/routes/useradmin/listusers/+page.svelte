<script>
	import { goto } from '$app/navigation';
	import { roles_from_user } from '$lib/roles_from_user';
	export let data;
</script>

<button on:click={() => goto("/useradmin")}>User Admin</button>

<div class="section">All Users</div>

{#if data && data.error}
	<div class="bad">{data.error}</div>
{/if}

<div class="users">
	<table>
		<tr>
			<th>App User Id</th>
			<th>Display Name</th>
			<th>Picture</th>
			<th>Phone</th>
			<th>Email</th>
			<th>Roles</th>
			<th>Disabled?</th>
		</tr>
		{#each data.users as u}
			<tr>
				<td
					>{#if u.customClaims?.application_userid}{u.customClaims.application_userid}{/if}</td
				>
				<td
					>{#if u.displayName}{u.displayName}{/if}</td
				>
				<td
					>{#if u.photoURL}<div class="smallpic">
							<img src={u.photoURL} alt="Picture of {u.displayName}" />
						</div>{/if}</td
				>
				<td
					>{#if u.phoneNumber}{u.phoneNumber}{/if}</td
				>
				<td
					>{#if u.email}{u.email}
						{#if u.emailVerified} &checkmark;{/if}{/if}</td
				>
				<td
					>{#if roles_from_user(u)}{#each roles_from_user(u) as r}{r}&nbsp;{/each}{/if}</td
				>
				<td
					>{#if u.disabled}disabled{/if}</td
				>
			</tr>
		{/each}
	</table>
</div>

<style>
	.section {
		margin: 1em 0;
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
</style>
