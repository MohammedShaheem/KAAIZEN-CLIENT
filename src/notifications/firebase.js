import { initializeApp, getApps, getApp } from "firebase/app";
import { getMessaging, isSupported } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyAWvMtWoMDFJ2kNE_bcY05gu-uIdguRBxs",
  authDomain: "kaaizen-a822f.firebaseapp.com",
  projectId: "kaaizen-a822f",
  storageBucket: "kaaizen-a822f.firebasestorage.app",
  messagingSenderId: "415397595617",
  appId: "1:415397595617:web:9aff288b98f59b4f18eaa0",
};


const app = getApps().length ? getApp() : initializeApp(firebaseConfig);


export const messagingPromise = isSupported().then((supported) => {
  if (supported) {
    return getMessaging(app);
  }
  return null;
});