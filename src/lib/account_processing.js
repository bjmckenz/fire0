
import { serverAuth } from '$lib/firebase-server';

// SUPERUSER_ROLE: this role name has access to ALL routes
import { SUPERUSER_ROLE, NEW_USER_ROLE } from '$env/static/private';

//import {database_handle} from '$lib/server/database';
//let db;

export const user_logged_in = async (claims) => {

    // if the user is already assigned a (valdi) application-specific
    // user id, we're done.
	if (claims.application_userid) {
        // if we're concerned that our userids have leaked or changed,
        // enable this code

        // YOU MUST CONFIGURE: table names, column names.
        // vvvvvvvvv

        // const test_user_validity =
        //     `SELECT COUNT(*) as is_valid FROM users WHERE rowid = ?`;
        // const test_user_validity_stmt = db.prepare(test_user_validity);
        // const test_user_validitycount = test_user_validity_stmt.get(claims.application_userid)['is_valid'];
        // const user_is_valid = test_user_validitycount == 1;

        // if (user_is_valid) {
            return;
        // }
        // console.log("User {email} has an invalid application_userid ({appid}). Reassigning.".format(claims.email, claims.application_userid));

        // ^^^^^^^^^
    }

    //console.log("user_logged_in",{claims})
    let uid = claims['uid'];

    // A new (never been seen before) user has signed in.
    // We need to choose an application-relevant user is for them,
    // and probably assign basic roles.
    //
    // this may also be the best place to assign a default role to all new users,
    // and the admin role to the first user who logs in.
    //

    // assign a application-specific user id

    // SAMPLE CODE ACCESSING A DATABASE
    // YOU MUST CONFIGURE: table names, column names.
    // vvvvvvvvv

    // if (!db) {
    //     db = database_handle();
    // }
    // const sql = `
    // INSERT INTO
    //     users (email, name)
    // VALUES
    //     (?, ?)`;

    // const stmt = db.prepare(sql);
    // stmt.run( claims.email, claims.name);
    // const newUserId = stmt.lastInsertRowid;
    // if (stmt !== 1) {
    //     console.error("Error creating user record for "+claims.email);
    //     return;
    // }

    // const user_count_sql = `SELECT COUNT(*) as user_count FROM users`;
    // const user_count_stmt = db.prepare(user_count_sql);
    // const user_count = user_count_stmt.get()['user_count'];
    // const first_user = user_count == 1;

    // ^^^^^^^^^

    // simple default. just use Firebase's UID
    // (if we're not doing something cute with database)
    const newUserId = uid;
    // then we would need some other way to track the first user.
    // since we don't have that, assume EVERY user is an admin.
    const first_user = true;

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
