import { serverAuth, firebaseServerApp } from '$lib/server/firebaseServerApp';
import { getAuth } from 'firebase-admin/auth';

import { DEBUG_AUTH } from '$env/static/private';

import { uid_for_userid } from '$lib/server/user_functions';


export const grant_role_to_user = async (userid, role) => {
    const uid = await uid_for_userid(userid);
    if (!uid) {
        return {error: 'No such user'};
    }
    const claims_to_add = { ['approle_'+role]: true };
    const aUser = await getAuth(firebaseServerApp).getUser(uid);
    const claimsToSet = {...aUser.customClaims, ...claims_to_add};

    // "customClaims" (that we can update) is a subset of all claims returned
    ["aud", "auth_time", "exp", "iat", "iss", "sub", "firebase"]
        .map( (cl) => delete claimsToSet[cl] );

    if (DEBUG_AUTH) {
        console.log(`grant_role_to_user: User ${userid}, Firebase UID ${uid}, granting ${role}`);
    }
    await serverAuth.setCustomUserClaims(uid, claimsToSet);
    return {status: 'Success'};
}

export const revoke_role_from_user = async (userid, role) => {
    const uid = await uid_for_userid(userid);
    if (!uid) {
        return {error: 'No such user'};
    }
    const aUser = await getAuth(firebaseServerApp).getUser(uid);
    const claimsToSet = {...aUser.customClaims};
    delete claimsToSet['approle_'+role];

    // "customClaims" (that we can update) is a subset of all claims returned
    ["aud", "auth_time", "exp", "iat", "iss", "sub", "firebase"]
        .map( (cl) => delete claimsToSet[cl] );

    if (DEBUG_AUTH) {
        console.log(`revoke_role_from_user: User ${userid}, Firebase UID ${uid}, revoking ${role}`);
    }
    await serverAuth.setCustomUserClaims(uid, claimsToSet);
    return {status: 'Success'};
}

export const user_roles = async (userid) => {
    const uid = await uid_for_userid(userid);
    if (!uid) {
        return null;
    }
    const aUser = await getAuth(firebaseServerApp).getUser(uid);
    const roles = Object.entries({...aUser.customClaims})
        .filter(([key, value]) => key.startsWith('approle_') && value)
        .map(([key]) => key.replace('approle_', ''));

    if (DEBUG_AUTH) {
        console.log(`user_roles: User ${userid}, Firebase UID ${uid}, has roles ${roles}`);
    }
    return roles;
}
