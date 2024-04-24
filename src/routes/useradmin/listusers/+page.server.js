import { firebaseServerApp } from '$lib/firebase-server';
import { getAuth } from 'firebase-admin/auth';
import { userForUserRecord } from '$lib/access_auth';

export const load = async () => {
	let listOfUsers;
	try {
		listOfUsers = await getAuth(firebaseServerApp).listUsers(1000, undefined);
	} catch (error) {
		return { error: 'Cannot list users: ' + error, users: [] };
	}

	const users = listOfUsers.users.map((userRec) => userForUserRecord(userRec));

	return { users };
};
