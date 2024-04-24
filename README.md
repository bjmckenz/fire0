# Firebase + Svelte

A starter pack. Svelte 4.2.7. Vite 5.0.3

## Overview

A framework you can add to an existing Svelte project and get page-level protections using Firebase.

***The site runs as https by default, even as a development server.*** *(configure this in ```vite.config.js```)*

It comes with two roles (user, admin) out of the box

Grants are based on the route URL. See ```src/lib/access_auth.js``` for config. (In other words you can protect routes starting with "/")

It comes with four protected routes (/admin, /user, /useradmin). Note that /useradmin is protected by a role "useradmin" that doesn't [exist or] need to be granted because "admin" has access to all routes (superuser mode)

If you want users to have access to "user" things immediately after creating an account, you must grant them the user role in ```src/routes/api/sessionLogin.js/POST```.

(You must also grant yourself the admin role; see note in same place)


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
* modify ```src/lib/access_auth.js``` to grant yourself "admin" **then remove this later**
* ```npm run dev```
* modify ```src/lib/access_auth.js``` to protect paths, moving routes as necessary

# .env

Your Firebase config goes in this file. Set up a Firebase project, and eventually it'll give you these params:

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
```

This are your development params.

***DO NOT CHECK THIS FILE INTO GIT/GITHUB***

# Limitations

Oh yeah.

* Redirect is going to stop working in a few months
* Passing "granted" to layout.svelte is not secure (since layout.svelte is client-side)
* Only doing Google auth right (signinRedirect). You'll have to modify if you want other providers.
* initial user/admin is lame
* Should fix the "grant a role by default on new user", at least as sample code
* notion of "user" role seems like it means "can log in" but it's not. It's just a role.
* I like [CC-BY-SA-4.0](https://creativecommons.org/licenses/by-sa/4.0/deed.en). Should add that everywhere.

# Most Useful Links

* (#1 by a mile) https://www.captaincodeman.com/lazy-loading-firebase-with-sveltekit
* https://firebase.google.com/docs/auth/admin/custom-claims
* https://www.okupter.com/blog/client-side-authentication-firebase-sveltekit
* https://www.poetryfoundation.org/poems/42916/jabberwocky
