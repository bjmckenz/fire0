import { json } from '@sveltejs/kit';
import { serverAuth } from '$lib/firebase-server';
import { SUPERUSER_ROLE } from '$env/static/private';

export async function POST({ request, cookies }) {
	const { idToken, csrfToken } = await request.json();

	const claims = await serverAuth.verifyIdToken(idToken);

	// console.log('received in POST to /sessionLogin:', {
	// 	idTokenInRequest: idToken,
	// 	sessionCookie: cookies.get('session'),
	// 	csrfTokenInCookie: cookies.get('csrfToken'),
	// 	csrfTokenInRequest: csrfToken,
	// 	claims: claims ?? 'none'
	// });

	// How to make yourself an admin the first time you log in?
	// uncomment this and add your email address. Then run. Then comment out again.
	// const aUser = await serverAuth.getUserByEmail('YOUR_EMAIL_HERE');
	// let userCustomClaims = aUser.customClaims ?? {};
	// if (!userCustomClaims['approle_'+SUPERUSER_ROLE]) {
	// 	userCustomClaims['approle_'+SUPERUSER_ROL] = true;
	// 	serverAuth.setCustomUserClaims(aUser.uid, userCustomClaims);
	// 	console.log("Adding "+SUPERUSER_ROLE+" role to "+aUser.email);
	// }

	// This is the place you would add a default role, such as "user" to new users.
	// Otherwise you'll have to add roles manually via /useradmin/manageUserRoles

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
