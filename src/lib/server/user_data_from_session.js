import { getAuth } from 'firebase-admin/auth';
import { firebaseServerApp } from '$lib/server/firebaseServerApp';
import { sanitized } from '$lib/sanitized_user_record';


export const user_data_from_session = async (sessionCookie) => {
	if (!sessionCookie) {
		return {};
	}
	const allClaims = sessionCookie
		? await getAuth(firebaseServerApp).verifySessionCookie(sessionCookie, true /** checkRevoked */)
		: {};

	const realUserRec = await getAuth(firebaseServerApp).getUser(allClaims.sub);

	const userRec = sanitized(realUserRec);
	//console.log('user_data_from_session', { userRec });

	return userRec;
};
