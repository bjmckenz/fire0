import { redirect } from '@sveltejs/kit';

export const handle = async ({ event, resolve }) => {
	// This seems to only pull userdata for these routes. It does not redirect to login?
	// thought - always pull the session data, AND THEN check if the user is allowed to view the page.
	if (event.url.pathname === '/onlyUser' || event.url.pathname === '/onlyAdmin') {
		const session = event.cookies.get('session');
		const uid = event.cookies.get('UNSAFE_uid');
		const email = event.cookies.get('UNSAFE_email');

		if (!session) {
			// if there is no session load page as normal
			console.log('no session in hooks.server.js ', { pathname: event.url.pathname });
			event.locals.redirectTo = event.url.pathname;
			event.cookies.set('redirectTo', event.url.pathname, {
				secure: true,
				httpOnly: true,
				path: '/'
			});
			redirect(302, '/login');
		}

		event.locals.user = {
			session: session,
			uid: uid,
			email: email
		};
		console.log('user in hooks.server.js', {
			user: event.locals.user,
			pathname: event.url.pathname
		});

		return await resolve(event);
	}
	console.log('unmanaged url in hooks.server.js ', event.url.pathname);
	return await resolve(event);
};
