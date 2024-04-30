
export const sanitized = (userRec) => {
	if ( !userRec ) {
		return {};
	}

    const newRec = { ...userRec };
    'providerData,metadata,tenantId,tokensValidAfterTime,passwordHash,passwordSalt'
        .split(',')
        .map((key) => {
            delete newRec[key];
        });
    return newRec;
};
