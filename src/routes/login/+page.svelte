<script>
	import { goto } from '$app/navigation';
	import { signInWithEmailAndPassword } from 'firebase/auth';
	import { firebaseAuth } from '$lib/firebase';
	import { authUser } from '$lib/authStore';
	import { target } from '$lib/targetAfterLogin';

	let email;
	let password;
	let success;

	const login = () => {
		signInWithEmailAndPassword(firebaseAuth, email, password)
			.then((userCredentials) => {
				$authUser = {
					uid: userCredentials.user.uid,
					email: userCredentials.user.email || '',
					picture: userCredentials.user.photoURL || ''
				};

				const dest = $target || '/';
				$target = undefined;
				console.log('logged in', {userCredentials, $target, dest});
				goto(dest);
			})
			.catch((error) => {
				const errorCode = error.code;
				const errorMessage = error.message;
				console.log(errorCode, errorMessage);

				success = false;
			});
	};
</script>

<form
	class="flex flex-col gap-4 p-8 space-y-4 bg-white sm:w-10/12"
	on:submit|preventDefault={login}
>
	<input
		type="email"
		placeholder="Email"
		class="px-4 py-2 border border-gray-300 rounded-md"
		required
		bind:value={email}
	/>
	<input
		type="password"
		placeholder="Password"
		class="px-4 py-2 border border-gray-300 rounded-md"
		required
		bind:value={password}
	/>

	<br />
	<button type="submit" class="default-action">Log In</button>

	{#if !success && success !== undefined}
		<div class="p-8 text-red-500 bg-red-100">There was an error logging in. Please try again.</div>
	{/if}
</form>
