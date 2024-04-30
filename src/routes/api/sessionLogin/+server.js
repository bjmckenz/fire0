import { json } from '@sveltejs/kit';
import { serverAuth } from '$lib/server/firebaseServerApp';
import { handle_user_logging_in } from '$lib/server/handle_user_logging_in';

export async function POST({ request, cookies }) {
	const { idToken, csrfToken } = await request.json();

	const claims = await serverAuth.verifyIdToken(idToken);

	await handle_user_logging_in(claims);

	// console.log('received in POST to /sessionLogin:', {
	// 	idTokenInRequest: idToken,
	// 	sessionCookie: cookies.get('session'),
	// 	csrfTokenInCookie: cookies.get('csrfToken'),
	// 	csrfTokenInRequest: csrfToken,
	// 	claims: claims ?? 'none'
	// });

	// Guard against CSRF attacks.
	// if (csrfToken !== cookies.get('csrfToken') {
	// 	res.status(401).send('UNAUTHORIZED REQUEST!');
	// 	return;
	// }

	const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days

	const sessionCookie = await serverAuth.createSessionCookie(idToken, { expiresIn });

	const options = { maxAge: expiresIn, httpOnly: true, secure: true, path: '/' };
	cookies.set('session', sessionCookie, options);

	// console.log('new session cookie', { sessionCookie, options });

	// 	(error) => {
	// 		return json({ message: 'UNAUTHORIZED REQUEST', error }, { status: 401 });
	// 	}
	// );
	return json({ message: 'success' });
}
