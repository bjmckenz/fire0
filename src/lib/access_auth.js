import { firebaseServerApp } from '$lib/firebase-server';
import { getAuth } from 'firebase-admin/auth';

// this role name has access to ALL routes
import { SUPERUSER_ROLE } from '$env/static/private';

/*
Map path prefixes to roles.
If a prefix is not listed here, it's considered public (no need to log in))

This approach permits multiple paths to be protected by a single role, but not a
path to be protected by multiple roles.

*/

// preconstructed regexes for faster matching
const path_to_role_map = new Map([
	[new RegExp(/^[/]]admin([/]]|$)/), SUPERUSER_ROLE],
	[new RegExp(/^[/]]user([/]]|$)/), 'user'],
	[new RegExp(/^[/]]useradmin([/]]|$)/), 'useradmin']
]);

export const grantAccess = (auth_data, url) => {
	if (SUPERUSER_ROLE in auth_data) {
		return true;
	}
	const [stem] = [...path_to_role_map.keys()].filter((aStem) => aStem.test(url.pathname));
	const result = !stem || path_to_role_map.get(stem) in auth_data;
	// console.log('post-test', { auth_data, stem, url, result });
	return result;
};

export const session_auth_data = async (sessionCookie) => {
    if (!sessionCookie) {
        return {};
    }
	const allClaims = sessionCookie
		? await getAuth(firebaseServerApp).verifySessionCookie(sessionCookie,
                true /** checkRevoked */)
		: {};

    // these are the bits of firebase auth we expose.
	const claim_keys = ['name', 'picture', 'email', 'email_verified'];
	const user_auth_data = { uid: allClaims.sub };
	Object.keys(allClaims).forEach((key) => {
		if (claim_keys.includes(key) || key.startsWith('approle_')) {
			user_auth_data[key.replace('approle_', '')] = allClaims[key];
		}
	});

	console.log('session_auth_data', { user_auth_data });

	return user_auth_data;
};
