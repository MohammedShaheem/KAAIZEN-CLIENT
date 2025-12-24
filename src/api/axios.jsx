import axios from "axios";
import Cookies from "js-cookie";
import store  from "../app/store";
import { clearUser } from "../features/auth/authSlice";


const API_BASE = "http://localhost:8000";
    
const api = axios.create({
    baseURL: API_BASE,
    withCredentials: true,
    headers:{
        "Content-Type":"application/json",
    },
});


// attaching csrf for every unsafe methods
api.interceptors.request.use((config) => {
    const method = (config.method || "").toUpperCase();
    if(["POST","PUT","PATCH","DELETE"].includes(method)) {
        const csrftoken = Cookies.get("csrftoken");
        if (csrftoken) {
            config.headers["X-CSRFToken"] = csrftoken;
        }
    }
    return config;
});



let isRefreshing = false;
let queue = [];

const processQueue = (err) => {
    queue.forEach(({ reject }) => reject(err));
    queue = [];
};

api.interceptors.response.use(
    (res) => res,
    async (error) => {
        const originalRequest = error.config;

        // handling the error in the waiting queue other than 401
        if(!error.response) return Promise.reject(error);
        if(error.response.status !== 401) return Promise.reject(error);

        
        // For not doing the refresh operation for me request and refresh request
        if (originalRequest.url?.includes("/api/auth/me") || originalRequest.url?.includes("/api/auth/refresh/")){
            return Promise.reject(error);
        }


        // for checking whether the 401 comes more than 2
        if(originalRequest._retry) {
            store.dispatch(clearUser());
            return Promise.reject(error);
        }

        if(isRefreshing) {
            return new Promise((resolve,reject) => {
                queue.push({ resolve, reject });
            })
            .then(() => api(originalRequest))
            .catch((err) => Promise.reject(err));
        }

        isRefreshing = true;
        originalRequest._retry = true;


        try {
            // calling the refresh end point for the token refreshing
            await api.post("/api/auth/refresh/");
            isRefreshing = false;
            queue.forEach(({ resolve }) => resolve());
            queue = [];
            return api(originalRequest);
        }catch (refreshError) {
            isRefreshing = false;
            processQueue(refreshError);
            store.dispatch(clearUser());
            return Promise.reject(refreshError)

        }
    }
);
export default api;