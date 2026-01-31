import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice"

console.log("🟢 store.jsx loaded");
const store = configureStore({
    reducer : {
        auth: authReducer,
    },
    
});

import { clearUser } from "@/features/auth/authSlice";
import { setUnauthorizedHandler } from "@/api/axios";

setUnauthorizedHandler(() => {
  store.dispatch(clearUser());
});


export default store