import { firebaseServerApp } from '$lib/server/firebaseServerApp';
import { getAuth } from 'firebase-admin/auth';
import { roles_from_user } from '$lib/roles_from_user';

export const actions = {
	execute: async ({ request }) => {
		const data = await request.formData();

        const email = data.get('email') ?? '';
		const role = data.get('role') ?? '';
		const action = data.get('action') ?? '';

		const response = { email, role, action };

        if (!email ) {
			response.error = 'Email required';
			return response;
		}

		if ( !role && (action == 'grant' || action == 'revoke')) {
			response.error = 'Role required';
			return response;
		}

		if ( ! 'grant,revoke,check,reset,delete'.includes(action) ){
			response.error = 'Invalid request';
			return response;
		}

		let aUser;
		try {
			aUser = await getAuth(firebaseServerApp).getUserByEmail(email);
		} catch (error) {
			response.error = 'No such user';
			return response;
		}
		console.log('aUser', {aUser});

		if (action == 'check') {
			const claims = roles_from_user(aUser);
			response.message = `User ${email} has roles: ${claims.join(', ')}`;
			return response;
		}

		if (action == 'reset') {
			const existingClaims = { ...aUser.customClaims };
			delete existingClaims['application_userid'];
			await getAuth(firebaseServerApp)
				.setCustomUserClaims(aUser.uid, existingClaims);
			response.message = `User ${email} de-registered from the application`;
			return response;
		}

		if (action == 'delete') {
			response.message = `User ${email} deleted from the application`;
			let count = -1;
			try {
				count = await getAuth().deleteUser(aUser.uid);
			} catch (error) {
				delete response.message;
				response.error = `Error deleting user: ${error}`;
			}
			if (count == 0) {
				delete response.message;
				response.error = `User deletion failed: ${email}`;
			}
			return response;
		}

			const boolForAction = action == 'grant';
		// Lookup the user associated with the specified uid.

		await getAuth(firebaseServerApp)
			.setCustomUserClaims(aUser.uid, {
				...aUser.customClaims??[],
				[`approle_${role}`]: boolForAction });

		const actio = action == 'grant' ? 'granted' : 'revoked';
        response.message = `User ${email} ${actio} "${role}"`;
		return response;
	}
};
