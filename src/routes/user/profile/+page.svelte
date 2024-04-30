<script>
	export let data;
</script>
<main>
  <h1>This page should only be viewable by logged-in users</h1>
<h2>Including users with the Admin role</h2>

If I were connected to a database, I would show the data about user {data.userid} because that's who is logged in.

</main>

<style>
  main {
    background-color: lightgreen;
  }
</style>
