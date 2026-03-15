import { getToken } from "firebase/messaging";
import { messagingPromise } from "./firebase";
import { saveDeviceToken } from "@/services/notifications/deviceToken";
import { waitForSWController } from "@/utils/notifications";


export const getDeviceToken = async () => {
  try {
    console.log("STEP 0 — Checking browser support");

    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      console.log("Push not supported");
      return null;
    }

    console.log("STEP 1 — Registering service worker");

    await navigator.serviceWorker.register(
      "/firebase-messaging-sw.js"
    );

    console.log("STEP 2 — Waiting for SW control");

    await waitForSWController();

    console.log(" Page controlled by SW");

    const swRegistration = await navigator.serviceWorker.ready;

    console.log("STEP 3 — Requesting permission");

    const permission = await Notification.requestPermission();
    if (permission !== "granted") return null;

    console.log("STEP 4 — Getting messaging instance");

    const messaging = await messagingPromise;
    if (!messaging) return null;

    console.log("STEP 5 — Getting FCM token");

    const token = await getToken(messaging, {
      vapidKey:"BFlmJaTFNI7fU8E_d29vetEYYhqgNjlGFLy8ck2b8hkvXA4ylXJlrY559K8nc3Kw04ODuYQJUgG2DVyN8CVjJok",
      serviceWorkerRegistration: swRegistration,
    });

    console.log("TOKEN RESULT:", token);

    if (!token) return null;

    await saveDeviceToken(token);

    console.log(" Token saved");

    return token;
  } catch (error) {
    console.error("FAILED:", error);
    return null;
  }
};