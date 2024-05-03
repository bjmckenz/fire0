// cribbed from https://www.captaincodeman.com/lazy-loading-firebase-with-sveltekit
import { invalidateAll } from '$app/navigation';
import { readable } from 'svelte/store';
import { browser } from '$app/environment';

import {
	PUBLIC_FIREBASE_API_KEY,
	PUBLIC_FIREBASE_AUTH_DOMAIN,
	PUBLIC_FIREBASE_PROJECT_ID,
	PUBLIC_FIREBASE_STORAGE_BUCKET,
	PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
	PUBLIC_FIREBASE_APP_ID
} from '$env/static/public';

const firebaseConfig = {
	apiKey: PUBLIC_FIREBASE_API_KEY,
	authDomain: PUBLIC_FIREBASE_AUTH_DOMAIN,
	projectId: PUBLIC_FIREBASE_PROJECT_ID,
	storageBucket: PUBLIC_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
	appId: PUBLIC_FIREBASE_APP_ID
};

function createAuth() {
	let auth;

	const { subscribe } = readable(undefined, (set) => {
		let unsubscribe = () => {};

		async function init() {
			if (browser) {
				const { initializeApp } = await import('firebase/app');

				const firebaseClientApp = initializeApp(firebaseConfig);				const { getAuth, onAuthStateChanged } = await import('firebase/auth');

				auth = getAuth(firebaseClientApp);

				// calls set with the "auth" when state changes => updates the readable store
				unsubscribe = onAuthStateChanged(auth, set);
			}
		}

		init();

		return unsubscribe;
	});

	async function sign_in() {
		const { signInWithPopup, GoogleAuthProvider } = await import('firebase/auth');
		await signInWithPopup(auth, new GoogleAuthProvider());

		const csrfToken = '?'; //cookies.get('csrfToken')

		const idToken = await auth.currentUser.getIdToken();
		// console.log({
		// 	currentUser: auth.currentUser,
		// 	idToken,
		// 	csrfToken,
		// });

		// exchange idToken for session cookie
		await fetch('/api/sessionLogin', {
			body: JSON.stringify({ idToken, csrfToken }),
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			}
		})
		// deletes the one we got because we now use a server session cookie
		auth.currentUser.getIdToken(true);
		invalidateAll();
	}

	async function sign_out() {
		const csrfToken = '?'; //cookies.get('csrfToken')
		const { signOut } = await import('firebase/auth');

		await signOut(auth);

		await fetch('/api/sessionLogout', {
			body: JSON.stringify({ csrfToken }),
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			}
		})
		invalidateAll();
		if (browser) {
			window.location = '/';
		}
	}

	return {
		subscribe,
		sign_in,
		sign_out
	};
}

export const auth = createAuth();
