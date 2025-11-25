import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
    name: "auth",
    initialState: {
        accessToken: null, // Initially no token
        uid: null
    },
    reducers: {
        login: (state, action) => {
            state.accessToken = action.payload.accessToken;
            state.uid = action.payload.uid;
        },
        logout: (state) => {
            state.accessToken = null;
            state.uid = null;
        },
    },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;