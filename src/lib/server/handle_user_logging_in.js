import { serverAuth } from '$lib/server/firebaseServerApp';

// SUPERUSER_ROLE: this role name has access to ALL routes
import { SUPERUSER_ROLE, NEW_USER_ROLE, DEBUG_AUTH } from '$env/static/private';

import { is_uid_present, number_of_users, create_local_user_record } from '$lib/server/user_functions';


export const handle_user_logging_in = async (claims) => {
    if (DEBUG_AUTH) {
        console.log(`handle_user_logging_in: ${claims.email} ${claims.name} ${claims.uid}`);
    }

	if (await is_uid_present(claims.uid)) {
        // no need to add a new user record
        return;
    }

    // A new (never been seen before) user has signed in
    const application_userid =
        await create_local_user_record(claims.uid, claims.email, claims.name);

    if (!application_userid) {
        return;
    }

    const claims_to_add = { application_userid, ['approle_'+NEW_USER_ROLE] : true};

    if (DEBUG_AUTH) {
        console.log(`Adding user ${application_userid}/${claims.email}/${claims.name} with role ${NEW_USER_ROLE}`);
    }

    if (number_of_users() === 1) {
        if (DEBUG_AUTH) {
            console.log(`Adding ${SUPERUSER_ROLE} role to ${application_userid}/${claims.email} (since they are the first user)`);
        }
		claims_to_add['approle_'+SUPERUSER_ROLE] = true;
    }

    // "customClaims" (that we can update) is a subset of all claims returned
    let claimsToSet = {...claims, ...claims_to_add};
    ["aud", "auth_time", "exp", "iat", "iss", "sub", "firebase"]
        .map( (cl) => delete claimsToSet[cl] );

    await serverAuth.setCustomUserClaims(claims.uid, claimsToSet);
};
