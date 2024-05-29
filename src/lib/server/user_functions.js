import sql from '$lib/server/database';

// SUPERUSER_ROLE: this role name has access to ALL routes
import { DEBUG_AUTH } from '$env/static/private';

// YOU MUST CONFIGURE: table names, column names IN ALL OF THESE ROUTINES
// vvvvvvvvv

export const is_uid_present = async (uid) => {
    const rows = await sql`
    SELECT
        COUNT(*) as matching_count
    FROM
        users
    WHERE
        firebase_uid = ${ uid }`;

    const user_is_valid = rows[0].matching_count == 1;

    if (DEBUG_AUTH) {
        console.log(`is_uid_present: User ${uid} ${user_is_valid ? 'exists' : 'does not exist'} in database`);
    }

    return user_is_valid;
}

export const uid_for_userid = async (userid) => {
    if (!userid) {
        if (DEBUG_AUTH) {
            console.log(`uid_for_userid: NULL userid NO Firebase UID`);
        }
        return null;
    }

    const rows = await sql`
    SELECT
        firebase_uid
    FROM
        users
    WHERE
        userid = ${ userid }`;

    if (!rows.length) {
        if (DEBUG_AUTH) {
            console.log(`uid_for_userid: User ${userid} has NO Firebase UID`);
        }
        return null;
    }
    const firebase_id = rows[0].firebase_uid;

    if (DEBUG_AUTH) {
        console.log(`uid_for_userid: User ${userid} has Firebase UID ${firebase_id}`);
    }

    return firebase_id;
}

export const userid_for_email = async (email) => {
    if (!email) {
        if (DEBUG_AUTH) {
            console.log(`userid_for_email: NO userid`);
        }
        return null;
    }

    const rows = await sql`
    SELECT
        firebase_uid
    FROM
        users
    WHERE
        email_address = ${ email }`;

    if (!rows.length) {
        if (DEBUG_AUTH) {
            console.log(`userid_for_email: Email ${email} has NO userid`);
        }
        return null;
    }
    const userid = parseInt(rows[0].userid);

    if (DEBUG_AUTH) {
        console.log(`userid_for_email: Email ${email} has userid ${userid}`);
    }

    return userid;
}

export const number_of_users = async () => {
    const rows = await sql`
    SELECT
        COUNT(*) as count
    FROM
        users`;

    const user_count = parseInt(rows[0].count);

    if (DEBUG_AUTH) {
        console.log(`number_of_users: ${user_count} users in the database`);
    }

    return user_count;
}

export const create_local_user_record = async (uid, email, user_name) => {
    const rows = await sql`
    INSERT INTO
        users (firebase_uid, email_address, name)
    VALUES
        (${ uid }, ${ email }, ${ user_name })
    RETURNING
        userid`;

    if (!rows.length) {
        if (DEBUG_AUTH) {
            console.log("create_local_user_record: failed to create in the database",
                {firebase_uid: uid, email_address: email,
                    name: user_name}
            );
        }
        return null;
    }

    const userid = parseInt(rows[0].userid);

    if (DEBUG_AUTH) {
        console.log("create_local_user_record: created in the database",
            {firebase_uid: uid, email_address: email,
                name: user_name, userid}
        );
    }
    // the database userid i.e., the primary key
    return userid;
}

