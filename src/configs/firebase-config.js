import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCamoh3ylT_4x_QpMeBUNKwygQyZN8MORw",
  authDomain: "gravasend.firebaseapp.com",
  projectId: "gravasend",
  storageBucket: "gravasend.appspot.com",
  messagingSenderId: "739989967873",
  appId: "1:739989967873:web:3cd315dd1d12a8bc745c00",
  measurementId: "G-VXPDYKCMSH",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
