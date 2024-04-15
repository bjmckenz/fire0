import { redirect } from '@sveltejs/kit';

function managed_url(pathname) {
	const managed_urls = ['/onlyUser', '/onlyAdmin'];
	return managed_urls.includes(pathname);
}

export const handle = async ({ event, resolve }) => {
	if (!managed_url(event.url.pathname)) {
		console.log('unmanaged url in hooks.server.js ', event.url.pathname);
		return await resolve(event);
	}

	// 	if (!session) {
	// 		// if there is no session load page as normal
	// 		console.log('no session in hooks.server.js ', { pathname: event.url.pathname });
	// 		event.locals.redirectTo = event.url.pathname;
	// 		event.cookies.set('redirectTo', event.url.pathname, {
	// 			secure: true,
	// 			httpOnly: true,
	// 			path: '/'
	// 		});
	// 		redirect(302, '/login');
	// 	}

	// 	event.locals.user = {
	// 		session: session,
	// 		uid: uid,
	// 		email: email
	// 	};

	return await resolve(event);
};
