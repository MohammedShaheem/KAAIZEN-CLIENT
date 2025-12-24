import { createSlice } from "@reduxjs/toolkit";
import { refreshSession } from "./authThunk";

const initialState = {
    user : null,
    isAuthenticated : false,
    isLoading : true,
    error : null,
};

const authSlice = createSlice({
    name:'auth',
    initialState,
    reducers: {
        setUSer: (state, action) => {
            state.user = action.payload;
            state.isAuthenticated = action.payload ? true : false;
            state.error = null;
        },
        clearUser: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.error = null;
        },
        setLoading : (state, action) => {
            state.isLoading = action.payload
        },
        setError:(state, action) => {
            state.error = action.payload;
            state.isLoading = false;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
        .addCase(refreshSession.pending, (state) => {
            
            
            state.isLoading = true;
            state.error = null;
        })
        .addCase(refreshSession.fulfilled, (state, action) => {
            
            
            state.isLoading = false;
            state.user = action.payload;
            state.isAuthenticated = !!action.payload;
            state.error = null;
        })
        .addCase(refreshSession.rejected, (state,action) => {
            
            
            state.isLoading = false;
            state.user = null;
            state.isAuthenticated = false;
            state.error = action.payload || 'Session refresh failed';

        });
    }
});

export const { setUSer, clearUser, setLoading, setError, clearError} = authSlice.actions
export default authSlice.reducer;