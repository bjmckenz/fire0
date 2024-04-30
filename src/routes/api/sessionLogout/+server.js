import { json } from '@sveltejs/kit';
import { firebaseServerApp } from '$lib/server/firebaseServerApp';
import { getAuth } from 'firebase-admin/auth';

export async function POST({ request, cookies }) {
	const { csrfToken } = await request.json();
	const sessionCookie = cookies.get('session') || '';
	cookies.set('session', '', {
		httpOnly: true,
		path: '/',
		maxAge: 0
	});

	if (!sessionCookie) {
		return json({ error: 'no session cookie' }, 400);
	}

	const claims = await getAuth(firebaseServerApp).verifySessionCookie(
		sessionCookie,
		true /** checkRevoked */
	);
	// "sub" is the offial uid in firebase auth
	await getAuth().revokeRefreshTokens(claims.sub);

	return json({ message: 'success' });
}
