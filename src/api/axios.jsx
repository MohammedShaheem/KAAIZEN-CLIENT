import axios from "axios";
import Cookies from "js-cookie";
import.meta.env.VITE_API_URLS


    
const api = axios.create({
    baseURL:import.meta.env.VITE_API_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

// attaching csrf for every unsafe methods 
// in all the unsafe requests
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


let onUnauthorized = null;

export const setUnauthorizedHandler = (handler) => {
  onUnauthorized = handler;
};


let isRefreshing = false;
let queue = [];

const processQueue = (err) => {
    queue.forEach(({ reject }) => reject(err));
    queue = [];
};
// adding interceptor in response
// Every response that comes back from this api instance will pass through this function first
api.interceptors.response.use(
    // if no error
    (res) => res,
    async (error) => {
        // getting the request that caused error
        const originalRequest = error.config;

        // handling the error in the waiting queue other than 401
        if(!error.response) return Promise.reject(error);
        if(error.response.status !== 401) return Promise.reject(error);

        
        // For not doing the refresh operation for me request and refresh request
        if (originalRequest.url?.includes("/api/auth/me") || originalRequest.url?.includes("/api/auth/refresh/")){
            onUnauthorized?.();
            return Promise.reject(error);
        }


        // for checking whether the 401 comes more than 2
        if(originalRequest._retry) {
            onUnauthorized?.();
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
            // calling the function
            onUnauthorized?.();
            return Promise.reject(refreshError)

        }
    }
);
export default api;