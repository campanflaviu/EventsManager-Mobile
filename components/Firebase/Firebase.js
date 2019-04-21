import * as firebase from 'firebase';
const config = {
  apiKey: "AIzaSyAmgOYA-4ryUFliRPMfrT83vcsr1QX6e4o",
  authDomain: "food-check-9ba22.firebaseapp.com",
  databaseURL: "https://food-check-9ba22.firebaseio.com/",
  projectId: "food-check-9ba22",
//   storageBucket: "bucket.appspot.com",
//   messagingSenderId: "ENTER YOURS HERE"
}
firebase.initializeApp(config);
const databaseRef = firebase.database().ref();
// export const db = databaseRef;
export const Users = databaseRef.child('users');
export const Meals = databaseRef.child('meals');