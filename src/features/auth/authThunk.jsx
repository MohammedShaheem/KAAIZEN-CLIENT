import { createAsyncThunk } from "@reduxjs/toolkit";
import { meRequest } from "../../api/authApi";
import { setUSer, clearUser, setLoading, setError } from "./authSlice";

export const refreshSession  =  createAsyncThunk(
    async (_,{ dispatch }) =>{
        dispatch(setLoading(true));
        try{
             const response = await meRequest();
             const user = response.data
             dispatch(setUSer(user));
             return user;
        }catch (error) {
            dispatch(clearUser());
            dispatch(setError(error.response?.data?.message || error.message || 'Session refresh failed'));
            throw error;
        }finally {
            dispatch(setLoading(false));
        }
    }
);