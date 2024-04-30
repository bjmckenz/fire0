
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
