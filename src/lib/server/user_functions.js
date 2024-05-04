import {database_handle} from '$lib/server/database';

// SUPERUSER_ROLE: this role name has access to ALL routes
import { DEBUG_AUTH } from '$env/static/private';

// YOU MUST CONFIGURE: table names, column names IN ALL OF THESE ROUTINES
// vvvvvvvvv
let db;

export const is_uid_present = (uid) => {
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

export const uid_for_userid = (userid) => {
    if (!db) {
        db = database_handle();
    }
    if (!userid) {
        if (DEBUG_AUTH) {
            console.log(`uid_for_userid: NULL userid NO Firebase UID`);
        }
        return null;
    }

    const sql = `SELECT firebase_uid FROM users WHERE userid = ?`;
    const stmt = db.prepare(sql);
    const result = stmt.get(userid);
    if (!result) {
        if (DEBUG_AUTH) {
            console.log(`uid_for_userid: User ${userid} has NO Firebase UID`);
        }
        return null;
    }
    const firebase_id = result.firebase_uid;

    if (DEBUG_AUTH) {
        console.log(`uid_for_userid: User ${userid} has Firebase UID ${firebase_id}`);
    }

    return firebase_id;
}

export const userid_for_email = (email) => {
    if (!db) {
        db = database_handle();
    }
    if (!email) {
        if (DEBUG_AUTH) {
            console.log(`userid_for_email: NO userid`);
        }
        return null;
    }

    const sql = `SELECT userid FROM users WHERE email_address = ?`;
    const stmt = db.prepare(sql);
    const result = stmt.get(email);
    if (!result) {
        if (DEBUG_AUTH) {
            console.log(`userid_for_email: Email ${email} has NO userid`);
        }
        return null;
    }
    const userid = result.userid;

    if (DEBUG_AUTH) {
        console.log(`userid_for_email: Email ${email} has userid ${userid}`);
    }

    return userid;
}

export const number_of_users = () => {
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

export const create_local_user_record = (uid, email, user_name) => {
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

