import { firebaseServerApp } from '$lib/server/firebaseServerApp';
import { getAuth } from 'firebase-admin/auth';
import { userid_for_email } from '$lib/server/user_functions';
import { grant_role_to_user, revoke_role_from_user, user_roles } from '$lib/server/role_utils';
import { fail } from '@sveltejs/kit';

export const actions = {
	clearApplicationId: async ({ request }) => {
		const data = await request.formData();
		const email = data.get('email');
		let aUser;
		try {
			aUser = await getAuth(firebaseServerApp).getUserByEmail(email);
		} catch (error) {
			return fail(422, { email, error: 'No such user - '+error.message, });
		}

		const existingClaims = { ...aUser.customClaims };
		delete existingClaims['application_userid'];
		await getAuth(firebaseServerApp).setCustomUserClaims(aUser.uid, existingClaims);
		return {email, message:`User ${email} de-registered from the application`};
	},
	deleteFirebaseAccount: async ({ request }) => {
		const data = await request.formData();
		const email = data.get('email');
		let aUser;
		try {
			aUser = await getAuth(firebaseServerApp).getUserByEmail(email);
		} catch (error) {
			return fail( 422, {email, error: 'No such user'});
		}
		try {
			count = await getAuth().deleteUser(aUser.uid);
		} catch (error) {
			return fail(422,{email, error: `Error removing user: ${error}`});
		}
		return { email, message:`User ${email} removed from the application`};
	},
	listRoles: async ({ request }) => {
		const data = await request.formData();
		const email = data.get('email');
		const userid = await userid_for_email(email);
		if (!userid) {
			return fail(422, { email, error: 'No such user', });
		}
		const roles = await user_roles(userid);
		if (roles === null) {
			return fail(422,{email, error:`Failed.`});
		}
		return {email, message:`User ${email} has roles: ${roles.join(', ')}`};
	},

	grantRole: async ({ request }) => {
		const data = await request.formData();
		const email = data.get('email');
		const role = data.get('role') ?? '';

		if (!role) {
			return fail(422,{email, error:'Role required'});
		}

		const result = await grant_role_to_user(await userid_for_email(email), role);
		if (result.error) {
			return fail(422,{email, role, error:result.error});
		}
		return {email, role, message: `User ${email} granted "${role}"`};
	},
	revokeRole: async ({ request }) => {
		const data = await request.formData();

		const email = data.get('email');
		const role = data.get('role') ?? '';

		if (!role) {
			return fail(422,{email, error:'Role required'});
		}

		const result = await revoke_role_from_user(await userid_for_email(email), role);
		if (result.error) {
			return fail(422,{email, role, error:result.error});
		}
		return {email, role, message:`Revoked "${role}" from user ${email}`};
	},
};
