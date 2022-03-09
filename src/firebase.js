// Firebase App (the core Firebase SDK) is always required and must be listed first
import * as firebase from "firebase/app";

// Add the Firebase products that you want to use
import "firebase/auth";
import "firebase/firestore";

var firebaseConfig = {
  apiKey: "AIzaSyA_X_K1KBxZJ_HgtHypoyAVd8kF_VvC-wA",
  authDomain: "maple-syrup-6d3ec.firebaseapp.com",
  databaseURL: "https://maple-syrup-6d3ec.firebaseio.com",
  projectId: "maple-syrup-6d3ec",
  storageBucket: "maple-syrup-6d3ec.appspot.com",
  appID: "1:633107944978:web:f168c969057c8988b4eacb"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const db = firebase.firestore();
