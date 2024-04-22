import { firebaseServerApp } from '$lib/firebase-server';
import { getAuth } from 'firebase-admin/auth';

export const load = async ({ cookies }) => {
	const sessionCookie = cookies.get('session') || '';

	if (!sessionCookie) {
		return { claims: {} };
	}

	const claims = await getAuth(firebaseServerApp).verifySessionCookie(
		sessionCookie,
		true /** checkRevoked */
	);

	console.log('layout.server',{ claims });

	return {
		claims
	};
};
