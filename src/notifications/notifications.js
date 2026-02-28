import { getToken } from "firebase/messaging";
import { messaging } from "./firebase";
import { saveDeviceToken } from "@/services/notifications/deviceToken";

export const getDeviceToken = async () => {
    try {
        const permission = await Notification.requestPermission();

        if (permission !== "granted") {
            console.log("Notification permission denied");
            return null;
        }

        const token = await getToken(messaging, {
            vapidKey: "BDXX8_vp0TTymGGr5F-khnPN1fAIbeSDOtGtP6INM-yf4ajTjaDstWnChlmMBn27tO3J5kFoZZZibtNe7gE3scg",
        });

        console.log("FCM TOKEN:", token);
        return token;

        await saveDeviceToken(token);

        
        console.log("Token saved in backend");


    } catch (error) {
         console.error("Error getting token:", error);
    }


};