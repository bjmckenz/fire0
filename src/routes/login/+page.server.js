import { fail, redirect } from '@sveltejs/kit';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { firebaseAuth } from '$lib/firebase';

export async function load({ cookies }) {
	const uid = ''; //await cookies.get('UNSAFE_uid');
	const session = ''; //await cookies.get('session');
	const email = ''; //await cookies.get('UNSAFE_email');
	console.log('login page load()', { uid, email, session });
	await signOut(firebaseAuth);
	//$authUser = undefined;
	cookies.set('session', '', {
		path: '/',
		expires: new Date(0)
	});
	cookies.set('UNSAFE_uid', '', {
		path: '/',
		expires: new Date(0)
	});
	cookies.set('UNSAFE_email', '', {
		path: '/',
		expires: new Date(0)
	});
	return { email, session };
}

export const actions = {
	// This gets invoked on the user clicking the login button
	login: async ({ cookies, request }) => {
		const formData = await request.formData();

		const email = formData.get('email');
		const password = formData.get('password');

		if (!email || !password) {
			return fail(400, { email, missing: true });
		}

		let userCredentials;
		try {
			userCredentials = await signInWithEmailAndPassword(firebaseAuth, email, password);
		} catch (error) {
			const errorCode = error.code;
			const errorMessage = error.message;
			console.log('caught from login:', errorCode, errorMessage);

			return fail(400, { email, incorrect: true });
		}

		console.log('User logged in:');

		cookies.set('session', userCredentials.user.accessToken, {
			path: '/',
			sameSite: 'strict',
			secure: process.env.NODE_ENV === 'production',
			maxAge: 60 * 60 * 24 * 30
		});
		cookies.set('UNSAFE_uid', userCredentials.user.uid, {
			path: '/',
			sameSite: 'strict',
			secure: process.env.NODE_ENV === 'production',
			maxAge: 60 * 60 * 24 * 30
		});
		cookies.set('UNSAFE_email', userCredentials.user.email, {
			path: '/',
			sameSite: 'strict',
			secure: process.env.NODE_ENV === 'production',
			maxAge: 60 * 60 * 24 * 30
		});

		const redirectTo = cookies.get('redirectTo');
		console.log('post login()');
		if (redirectTo) {
			console.log('redirecting to:', redirectTo);
			redirect(303, redirectTo);
		}
		console.log('default-redirecting to /');
		redirect(303, '/');
	}
};
