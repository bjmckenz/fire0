# Firebase + Svelte

* clone it
* npm install
* npm run dev

(for me, that is)

I'll add details later

https://www.okupter.com/blog/client-side-authentication-firebase-sveltekit

project: fire0
https://console.firebase.google.com/project/fire0-ccfc9/overview

app: fire0
firebase hosting: NO

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD9APABxdL1rMz5elRtJ4crgdKXdItvYMQ",
  authDomain: "fire0-ccfc9.firebaseapp.com",
  projectId: "fire0-ccfc9",
  storageBucket: "fire0-ccfc9.appspot.com",
  messagingSenderId: "664890974734",
  appId: "1:664890974734:web:a6b083f73802965453125f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

(copy this to src/lib/firebase.js; add auth module; move actual values to .env)

Add "Auth" to project

Add Google
public facing name: fire0
support email: bjmckenz@gmail.com

Add Email/Password
passwordless: no

Add Phone

