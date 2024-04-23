import { firebaseServerApp } from '$lib/firebase-server';
import { getAuth } from 'firebase-admin/auth';

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

		if ( action != 'grant' && action != 'revoke' && action != 'check' ){
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
			const claims = Object.keys(aUser.customClaims??{})
				.filter((key) => key.startsWith('approle_'))
				.map((key) => key.replace('approle_', ''));
			response.message = `User ${email} has roles: ${claims.join(', ')}`;
			return response;
		}

		const boolForAction = action == 'grant';
		// Lookup the user associated with the specified uid.

		await getAuth(firebaseServerApp)
			.setCustomUserClaims(aUser.uid, { ...aUser.customClaims??[], [`approle_${role}`]: boolForAction });

        response.message = `User ${email} ${action}ed "${role}"`;
		return response;
	}
};
