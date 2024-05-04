<script>
  import { goto } from '$app/navigation';
</script>
<main>

<h1>This page should only be viewable by users with useradmin role</h1>

<h1>(These are Firebase users, not users from the database)</h1>

<button on:click={() => goto("/useradmin/manageUserRoles")}>Manage User Roles</button>
<button on:click={() => goto("/useradmin/listusers")}>List Users</button>

</main>

<style>
  main {
    background-color: #f8fae6;
  }
</style>
