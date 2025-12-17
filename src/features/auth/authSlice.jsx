import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user : null,
    isAuthenticated : false,
    isLoading : false,
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
});

export const { setUSer, clearUser, setLoading, setError, clearError} = authSlice.actions
export default authSlice.reducer;