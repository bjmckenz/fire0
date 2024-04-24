import { user_can_access_url, user_data_from_session } from '../lib/access_auth';

export const load = async ({ cookies, url }) => {
	const user_record = await user_data_from_session( cookies.get('session') );

	return {
		user_record,
		grant_access: user_can_access_url(user_record, url)
	};
};
