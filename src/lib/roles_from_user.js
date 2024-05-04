

// this is useful if you already have a Firebase UserRecord.
// If you don't, and are on the server, and have an application_userid (not
// the Firebase UID, but the application's own user ID)
// you can get them with lib/server/role_utile.js/user_roles(userid).

export const roles_from_user = (userRec) => {
	if ( !userRec || !userRec.customClaims ) {
		return [];
	}

	const allRoles = Object.keys(userRec.customClaims);
	const appRoles = allRoles.filter((role) => role.startsWith('approle_'));
	const enabledRoles = appRoles.filter((role) => userRec.customClaims[role]);

	const roles = enabledRoles.map((role) => role.replace('approle_', ''));

	return roles;
};
