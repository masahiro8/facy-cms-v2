import firebase from "firebase";
import { UserAuth } from "./userAuth";
import { Users } from "./users";
import { Reserves } from "./reserve";
import { ConfigReserve } from "./ConfigReserve";
import { DAY_OF_WEEK } from "./statics";
import { Typeids } from "./typeids";

function initFirebase() {
  const firebaseConfig = {
    apiKey: "AIzaSyAHFgp5NbVzb9X38XShElfc9OT1xPGtDOs",
    authDomain: "mahou-c71dd.firebaseapp.com",
    projectId: "mahou-c71dd",
    storageBucket: "mahou-c71dd.appspot.com",
    messagingSenderId: "681706806651",
    appId: "1:681706806651:web:bff86251c25e98d36871de",
    measurementId: "G-WYGVNV114R"
  };
  firebase.initializeApp(firebaseConfig);
}

export { initFirebase, UserAuth, Users, Reserves, ConfigReserve, DAY_OF_WEEK, Typeids };
