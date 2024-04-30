import {database_handle} from '$lib/server/database';

import { serverAuth } from '$lib/server/firebaseServerApp';

// SUPERUSER_ROLE: this role name has access to ALL routes
import { SUPERUSER_ROLE, NEW_USER_ROLE } from '$env/static/private';

let db;

export const handle_user_logging_in = async (claims) => {

    if (!db) {
        db = database_handle();
    }

    // if the user is already assigned a (valdi) application-specific
    // user id, we're done.
    // FIXME: should check if this name/email already exists in the database?
	if (claims.application_userid) {
        // if we're concerned that our userids have leaked or changed,
        // enable this code

        console.log(`Testing for presence of app user id ${claims.application_userid} in database.`);

        // YOU MUST CONFIGURE: table names, column names.
        // vvvvvvvvv

        const test_user_validity =
        `SELECT COUNT(*) as is_valid FROM users WHERE userid = ?`;
        const test_user_validity_stmt = db.prepare(test_user_validity);
        const test_user_validitycount = test_user_validity_stmt.get(claims.application_userid)['is_valid'];
        const user_is_valid = test_user_validitycount == 1;

        if (user_is_valid) {
            return;
        }
        console.log(`ERROR: User ${claims.email} has an invalid application_userid (${claims.application_userid}).`);

        // ^^^^^^^^^
    }

    //console.log("handle_user_logging_in",{claims})
    const uid = claims['uid'];

    // A new (never been seen before) user has signed in.
    // We need to choose an application-relevant user is for them,
    // and probably assign basic roles.
    //
    // this may also be the best place to assign a default role to all new users,
    // and the admin role to the first user who logs in.
    //

    // assign a application-specific user id

    // YOU MUST CONFIGURE: table names, column names.
    // vvvvvvvvv

    const sql = `
    INSERT INTO
        users (email_address, name)
    VALUES
        (?, ?)`;

    const stmt = db.prepare(sql);
    const info = stmt.run( claims.email, claims.name);
    const newUserId = info.lastInsertRowid;

    if (info.changes !== 1) {
        console.error("Error creating user record for ",{claims});
        return;
    }

    const user_count_sql = `SELECT COUNT(*) as user_count FROM users`;
    const user_count_stmt = db.prepare(user_count_sql);
    const user_count = user_count_stmt.get()['user_count'];
    const first_user = user_count == 1;
    console.log({user_count, first_user, newUserId});

    // ^^^^^^^^^

    // "customClaims" is a subset of all claims returned
    let claimsToSet = {...claims};
    ["aud", "auth_time", "exp", "iat", "iss", "sub", "firebase"]
        .map( (cl) => delete claimsToSet[cl] );

    // We add either two or three claims.
    claimsToSet['application_userid'] = newUserId;

    // all new users get this role
    claimsToSet['approle_'+NEW_USER_ROLE] = true;
    console.log("New user "+claims.email+" assigned "+NEW_USER_ROLE+" role");

	// Make the first user an admin!
	if (first_user) {
		claimsToSet['approle_'+SUPERUSER_ROLE] = true;
		console.log("Adding "+SUPERUSER_ROLE+" role to "+claims.email+" (since first user)");
	}

    await serverAuth.setCustomUserClaims(uid, claimsToSet);
};
