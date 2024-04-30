import Database from 'better-sqlite3';

import {DB_FILE} from '$env/static/private';

let database;

export function database_handle() {
  if (!database) {
    console.log("opening db: " + DB_FILE);
    database = new Database(DB_FILE, { fileMustExist: true, /* verbose: console.log */ });
  }
  return database;
}
