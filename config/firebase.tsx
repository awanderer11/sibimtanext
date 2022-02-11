
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";

const development = {
    apiKey: "AIzaSyDholvtc3VYMqBDRD-VK-nymQO_knXZY6k",
    authDomain: "sibimta-development-86538.firebaseapp.com",
    projectId: "sibimta-development-86538",
    storageBucket: "sibimta-development-86538.appspot.com",
    messagingSenderId: "216485389223",
    appId: "1:216485389223:web:53bad8bfaad3bde9194c82"
  };

  if (firebase.apps.length === 0) {
    firebase.initializeApp(development);
  }
  
  export const FirebaseApp = firebase.app();
  export const db = firebase.firestore();
  export const auth = firebase.auth();
  