
import postgres from 'postgres'

// see env variables in .env
import {PGCONNECT} from '$env/static/private';

const sql = postgres(PGCONNECT, {} )

export default sql;
