import { json } from '@sveltejs/kit';
import { serverAuth } from '$lib/firebase-server';

export async function POST({ request, cookies }) {
	const { idToken, csrfToken } = await request.json();

	const claims = await serverAuth.verifyIdToken(idToken);

	console.log('received in POST to /sessionLogin:', {
		idTokenInRequest: idToken,
		sessionCookie: cookies.get('session'),
		csrfTokenInCookie: cookies.get('csrfToken'),
		csrfTokenInRequest: csrfToken,
		claims: claims ?? 'none'
	});

	const aUser = await serverAuth.getUserByEmail('bjmckenz@gmail.com');
	let userCustomClaims = aUser.customClaims ?? {};
	if (!userCustomClaims['admin']) {
		console.log('setting admin claim for user',aUser.uid);
		userCustomClaims['admin'] = true;
		serverAuth.setCustomUserClaims(aUser.uid, userCustomClaims);
	} else {
		console.log('user ',aUser.uid,' already has admin claim');
	}

	// Guard against CSRF attacks.
	// if (csrfToken !== cookies.get('csrfToken') {
	// 	res.status(401).send('UNAUTHORIZED REQUEST!');
	// 	return;
	// }

	const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days

	const sessionCookie = await serverAuth.createSessionCookie(idToken, { expiresIn });

	const options = { maxAge: expiresIn, httpOnly: true, secure: true, path: '/' };
	cookies.set('session', sessionCookie, options);

	console.log('new session cookie', { sessionCookie, options });

	// 	(error) => {
	// 		return json({ message: 'UNAUTHORIZED REQUEST', error }, { status: 401 });
	// 	}
	// );
	return json({ message: 'success' });
}
