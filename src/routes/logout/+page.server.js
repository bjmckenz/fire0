import { redirect } from '@sveltejs/kit';

export const actions = {
	default: async ({ cookies }) => {
        console.log('logout action');
		cookies.set('session', '', {
			path: '/',
			sameSite: 'strict',
			secure: process.env.NODE_ENV === 'production',
			maxAge: 0
		});
		cookies.set('UNSAFE_uid', '', {
			path: '/',
			sameSite: 'strict',
			secure: process.env.NODE_ENV === 'production',
			maxAge: 0
		});
		cookies.set('UNSAFE_email', '', {
			path: '/',
			sameSite: 'strict',
			secure: process.env.NODE_ENV === 'production',
			maxAge: 0
		});
        redirect(303, '/');
	},
};

