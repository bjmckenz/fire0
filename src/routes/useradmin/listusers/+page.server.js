import { firebaseServerApp } from '$lib/server/firebaseServerApp';
import { getAuth } from 'firebase-admin/auth';
import { sanitized } from '$lib/sanitized_user_record';

export const load = async () => {
	let users;
	try {
		// recs come from FB with non-seriazable fields
		const { users: userRecs } = await getAuth(firebaseServerApp).listUsers(1000, undefined);
		users = userRecs.map((ur) => sanitized(ur));
	} catch (error) {
		return { error: 'Cannot list users: ' + error, users: [] };
	}

	return { users };
};
