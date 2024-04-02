export const load = async ({ cookies }) => {
    return {
        uid: await cookies.get('UNSAFE_uid'),
        session: await cookies.get('session'),
        email: await cookies.get('UNSAFE_email')
    }
};
