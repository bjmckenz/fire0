import { user_can_access_url } from '$lib/server/user_can_access_url';
import { user_data_from_session } from '$lib/server/user_data_from_session';
import { roles_from_user } from '$lib/roles_from_user';
import { redirect } from '@sveltejs/kit';

export const load = async ({ cookies, url }) => {
	const user_record = await user_data_from_session( cookies.get('session') );

	if (user_record === null) {
		redirect(302, '/');
	}

	const application_userid = user_record?.customClaims?.application_userid;
	//console.log("(layout.server.js) application_userid",application_userid);

	return {
		user_record,
		userid: application_userid,
		roles: roles_from_user(user_record),
		grant_access: user_can_access_url(user_record, url),
	};
};
