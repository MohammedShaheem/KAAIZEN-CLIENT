import { createAsyncThunk } from "@reduxjs/toolkit";
import { meRequest,refreshRequest } from "@/services/auth/auth";

export const refreshSession = createAsyncThunk(
    'auth/refreshSession',
    async (_, { rejectWithValue }) => {
        console.log('Starting refreshSession'); 
        try {
            const response = await meRequest();
            console.log('meRequest succeeded');  
            return response.data.user;
        } catch (error) {
            console.log('meRequest failed:', error.response?.status); 
            if (error.response?.status === 401) {
                try {
                    console.log('Attempting refresh');  
                    await refreshRequest();
                    console.log('refresh succeeded, retrying me');  
                    const meRetry = await meRequest();
                    return meRetry.data.user;
                } catch (refreshError) {
                    console.log('refresh failed:', refreshError.response?.status);  
                    return rejectWithValue("Session expired");
                }
            }
            return rejectWithValue(error.response?.data?.message || error.message || 'Session refresh failed');
        }
    }
);