import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

// Initialize Firebase
const config = {
  apiKey: "AIzaSyCzO_neVpTuKS7ROUGi0oT_tBhqdx-hBRU",
  authDomain: "maslow-2de90.firebaseapp.com",
  databaseURL: "https://maslow-2de90.firebaseio.com",
  projectId: "maslow-2de90",
  storageBucket: "maslow-2de90.appspot.com",
  messagingSenderId: "544833869916"
};

firebase.initializeApp(config);
firebase.firestore().settings({
  timestampsInSnapshots: true
});

export default firebase;
