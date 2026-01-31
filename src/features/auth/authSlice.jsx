import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { meRequest,refreshRequest } from "@/services/auth/auth";


  //  THUNK (defined FIRST)

export const refreshSession = createAsyncThunk(
  "auth/refreshSession",
  async (_, { rejectWithValue }) => {
    try {
      const response = await meRequest();
      return response.data.user;
    } catch (error) {
      if (error.response?.status === 401) {
        try {
          await refreshRequest();
          const retry = await meRequest();
          return retry.data.user;
        } catch {
          return rejectWithValue("Session expired");
        }
      }
      return rejectWithValue(
        error.response?.data?.message || "Session refresh failed"
      );
    }
  }
);


  //  INITIAL STATE

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

/* =======================
   SLICE
======================= */
console.log("🟡 authSlice.jsx loaded");

const authSlice = createSlice({
  name: "auth",
  initialState,

  /* ---------- SYNC REDUCERS ---------- */
  reducers: {
    setUSer: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
      state.error = null;
    },

    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
    },

    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },

    setError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    clearError: (state) => {
      state.error = null;
    },
  },

  /* ---------- ASYNC REDUCERS ---------- */
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
      .addCase(refreshSession.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.payload || "Session refresh failed";
      });
  },
});

/* =======================
   EXPORTS (THIS ANSWERS YOUR QUESTION)
======================= */
export const {
  setUSer,
  clearUser,
  setLoading,
  setError,
  clearError,
} = authSlice.actions;

export default authSlice.reducer;
