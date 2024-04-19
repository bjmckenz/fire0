// cribbed from https://www.captaincodeman.com/lazy-loading-firebase-with-sveltekit
import { readable } from 'svelte/store';
import { browser } from '$app/environment';

function createAuth() {
    let auth;

    const { subscribe } =
    readable(undefined,
		(set) => {
            let unsubscribe = () => {};

			async function init() {
                if (browser) {
                    const { firebaseApp } = await import('$lib/firebase-app');
                    const { getAuth, onAuthStateChanged } = await import('firebase/auth');

					auth = getAuth(firebaseApp);

					unsubscribe = onAuthStateChanged(auth, set);
				} else {
					// TODO: set auth on server from session (?)
				}
			}

			init();

			return unsubscribe;
		});

	async function sign_in() {
		const { signInWithRedirect, GoogleAuthProvider } = await import('firebase/auth');
		console.log('sign_in');
		await signInWithRedirect(auth, new GoogleAuthProvider());
	}

	async function sign_out() {
		const { signOut } = await import('firebase/auth');
		console.log('sign_out');
		await signOut(auth);
	}

	return {
		subscribe,
		sign_in,
		sign_out
	};
}

export const auth = createAuth();
