import { serverAuth } from '$lib/server/firebaseServerApp';

// SUPERUSER_ROLE: this role name has access to ALL routes
import { SUPERUSER_ROLE, NEW_USER_ROLE, DEBUG_AUTH } from '$env/static/private';


// YOU MUST CONFIGURE: table names, column names IN THESE THREE ROUTINES
// vvvvvvvvv
import {database_handle} from '$lib/server/database';
let db;

const is_uid_present = (uid) => {
    if (!db) {
        db = database_handle();
    }

    const sql = `SELECT COUNT(*) as matching_count FROM users WHERE firebase_uid = ?`;
    const stmt = db.prepare(sql);
    const result = stmt.get(uid);
    const user_is_valid = result.matching_count === 1;
    if (DEBUG_AUTH) {
        console.log(`is_uid_present: User ${uid} ${user_is_valid ? 'exists' : 'does not exist'} in database`);
    }

    return user_is_valid;
}

const number_of_users = () => {
    if (!db) {
        db = database_handle();
    }

    const sql = `SELECT COUNT(*) as count FROM users`;

    const stmt = db.prepare(sql);
    const result = stmt.get();
    const user_count = result.count;

    if (DEBUG_AUTH) {
        console.log(`number_of_users: ${user_count} users in the database`);
    }

    return user_count;
}

const create_local_user_record = (uid, email, user_name) => {
    if (!db) {
        db = database_handle();
    }

    const sql = `INSERT INTO users (firebase_uid, email_address, name) VALUES (?, ?, ?)`;
    const stmt = db.prepare(sql);
    const info = stmt.run( uid, email, user_name);

    if (info.changes !== 1) {
        console.error("Error creating user record for ",{uid, email, user_name});
        return null;
    }

    if (DEBUG_AUTH) {
        console.log("create_local_user_record: created in the database",
            {firebase_uid: uid, email_address: email,
                name: user_name, info}
        );
    }
    // the database userid i.e., the primary key
    return info.lastInsertRowid;
}
// ^^^^^^^^^

export const handle_user_logging_in = async (claims) => {
	if (is_uid_present(claims.uid)) {
        // no need to add a new user record
        return;
    }

    // A new (never been seen before) user has signed in
    const application_userid =
        create_local_user_record(claims.uid, claims.email, claims.name);

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
