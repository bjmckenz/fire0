import { grantAccess, session_auth_data } from '../lib/access_auth';

export const load = async ({ cookies, url }) => {
	const auth_data = await session_auth_data( cookies.get('session') );

	return {
		auth_data,
		grant_access: grantAccess(auth_data, url)
	};
};
