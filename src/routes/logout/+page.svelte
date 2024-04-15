<script>
	import { goto } from '$app/navigation';

	function logout() {
		console.log('Logging out');
	}
	function cancel_logout() {
		console.log('Canceling logout');
		goto('/');
	}
</script>


<br />
<button on:click={logout}>Log Out</button>
<button on:click={cancel_logout}>Cancel Logout</button>
