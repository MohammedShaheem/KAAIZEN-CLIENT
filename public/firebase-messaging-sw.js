importScripts(
  "https://www.gstatic.com/firebasejs/12.10.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/12.10.0/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyAWvMtWoMDFJ2kNE_bcY05gu-uIdguRBxs",
  authDomain: "kaaizen-a822f.firebaseapp.com",
  projectId: "kaaizen-a822f",
  storageBucket: "kaaizen-a822f.firebasestorage.app",
  messagingSenderId: "415397595617",
  appId: "1:415397595617:web:9aff288b98f59b4f18eaa0",
});

const messaging = firebase.messaging();


self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});