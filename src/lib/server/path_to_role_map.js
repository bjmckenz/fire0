
import { SUPERUSER_ROLE } from '$env/static/private';

/*
Map path prefixes to roles.
If a prefix is not listed here, it's considered public (no need to log in))

This approach permits multiple paths to be protected by a single role, but not a
path to be protected by multiple roles.

*/



// preconstructed regexes for faster matching
export const path_to_role_map = new Map([
	[new RegExp(/^[/]admin([/]|$)/), SUPERUSER_ROLE],
	[new RegExp(/^[/]user([/]|$)/), 'user'],
	[new RegExp(/^[/]product([/]|$)/), 'user'],
	[new RegExp(/^[/]useradmin([/]|$)/), 'useradmin']
]);

