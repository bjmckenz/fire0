# Firebase + Svelte

A starter pack. Svelte 4.2.7. Vite 5.0.3

## Overview

A framework you can add to an existing Svelte project and get page-level protections using Firebase.

***The site runs as https by default, even as a development server.*** *(configure this in ```vite.config.js```)*

It comes with two roles (user, admin) out of the box

Grants are based on the route URL. See ```src/lib/server/path_to_role_map.js``` for config. (In other words you can protect routes starting with "/")

It comes with three protected routes (/admin, /user, /useradmin). Note that /useradmin is protected by a role "useradmin" that doesn't [exist or] need to be granted because "admin" has access to all routes (superuser mode)

All users are granted the "NEW_USER_ROLE" (from ```.env```) at first login.

The first user to log in is granted "SUPERUSER_ROLE" (from ```.env```), making them an admin

***You are not obligated to keep the default roles or routes. They are all configurable.***

## Wait, what?

OK, so you probably want to restrict access to parts of your site. Maybe you have an "admin" area, maybe there are things you have to be logged in to see.

Maybe users have profiles!

* What are the parts of the site that need protection?
* What group/role can see them?

That's all!

## Steps

* clone it
* create your ```.env``` file *(below)*
* ```npm install```
* Read and act upon the **Porting from SQLite3 to a server-friendly DB** section below
  * Which will have you modifying ```src/lib/server/role_utils.js```
* modify ```src/lib/server/path_to_role_map.js``` to protect paths, moving routes as necessary
* See ```src/routes/user/profile/+page.js``` to see how you access the logged-in user's id.
* ```npm run dev```

# .env

Your Firebase config goes in this file. Set up a Firebase project, add/enable authentication, and eventually it'll give you these params:

```
PUBLIC_FIREBASE_API_KEY=BLAHBLAHBLAH
PUBLIC_FIREBASE_AUTH_DOMAIN=MUMBLE.firebaseapp.com
PUBLIC_FIREBASE_PROJECT_ID=MUMBLE
PUBLIC_FIREBASE_STORAGE_BUCKET=MUMBLE.appspot.com
PUBLIC_FIREBASE_MESSAGING_SENDER_ID=BLIVIT
PUBLIC_FIREBASE_APP_ID=JABBERWOCKY
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nTwas brillig, and the slithy toves - Did gyre and gimble in the wabe: All mimsy were the borogoves, And the mome raths outgrabe.\n-----END PRIVATE KEY-----\n"
FIREBASE_ADMIN_CLIENT_EMAIL=BLURT@MUMBLE.iam.gserviceaccount.com
```

Create a file ```.env``` at the project root with all of those ***and the following lines:***

```
NODE_ENV=development
SUPERUSER_ROLE=admin
NEW_USER_ROLE=user
```

If you are using the default/include SQLite3 database, add:
```
DB=./data/sample.db
```

If you want to see what is going on with authentication and users, add:
```
AUTH_DEBUG=true
```

This are your development params.

***DO NOT CHECK THIS FILE INTO GIT/GITHUB***

# Porting from SQLite3 to a server-friendly DB

Yes, you're going to want to do that. But until you start deploying, SQLite3 is fast and easy.

When the time comes, you'll have to make some changes *(with respect to authentication - you're on your own for the rest of your application)*

1. ```src/lib/server/database.js``` returns a persistent connection handle
2. ```src/lib/server/role_utils.js``` accesses and updates the database on new user creation
3. ```.env``` *(or your production environment variables)* contains database connection params

## DB Design and Requirements

The DB must have a way to associate "internal" ids, Firebase uids, user names, and email addresses.

The user record is looked up by Firebase uid, and the internal id is made available to the app.

That's about it. Granted user roles are stored in the Firebase customClaims, not in the application or DB.

# So what are roles, anyways?

Just a string. In this code, the strings in ```src/lib/server/path_to_role_map.js``` are the role names:

```js
[new RegExp(/^[/]product([/]|$)/), 'user'],
```

says that accounts must be granted "user" to access "/product..." URLs.

You can check that users have a role by calling ```user_roles(userid}.includes('moderator')``` for example.

They don't have to be used for paths if you don't want them to by.

# Limitations

* notion of "user" role seems like it means "can log in" but it's not. It's just a role.
* I like [CC-BY-SA-4.0](https://creativecommons.org/licenses/by-sa/4.0/deed.en). Should add that everywhere.

# BUGS? ISSUES?

* Please add them to Github issues for this project.

# Most Useful Links

* (#1 by a mile) https://www.captaincodeman.com/lazy-loading-firebase-with-sveltekit
* https://firebase.google.com/docs/auth/admin/custom-claims
* https://www.okupter.com/blog/client-side-authentication-firebase-sveltekit
* https://www.poetryfoundation.org/poems/42916/jabberwocky
