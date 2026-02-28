import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";



const firebaseConfig = {
  apiKey: "AIzaSyAWvMtWoMDFJ2kNE_bcY05gu-uIdguRBxs",
  authDomain: "kaaizen-a822f.firebaseapp.com",
  projectId: "kaaizen-a822f",
  storageBucket: "kaaizen-a822f.firebasestorage.app",
  messagingSenderId: "415397595617",
  appId: "1:415397595617:web:9aff288b98f59b4f18eaa0",
  measurementId: "G-ZV7H14QE61"
};


const app = initializeApp(firebaseConfig);

const analytics = getAnalytics(app);