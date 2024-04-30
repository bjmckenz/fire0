import { roles_from_user } from '$lib/roles_from_user';

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
	[new RegExp(/^[/]admin([/]|$)/), SUPERUSER_ROLE],
	[new RegExp(/^[/]user([/]|$)/), 'user'],
	[new RegExp(/^[/]useradmin([/]|$)/), 'useradmin']
]);

export const user_can_access_url = (user_record, url) => {

	// URLs can be public, and there may not be a logged-in user
	let user_supplied = user_record && Object.keys(user_record).length !== 0;

	const roles = user_supplied? roles_from_user(user_record) : [];
	if (roles.includes(SUPERUSER_ROLE)) {
		//console.log('superuser', { user_record, url });
		return true;
	}

	const [stem] = [...path_to_role_map.keys()].filter((aStem) => aStem.test(url.pathname));
	const result = !stem || (user_supplied &&
				path_to_role_map.get(stem) in roles);
	//console.log('post-test', JSON.stringify({ user_supplied, user_record, stem, url, result }, null, 2));
	return result;
};
