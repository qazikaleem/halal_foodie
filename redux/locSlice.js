import { createSlice } from "@reduxjs/toolkit";

export const locSlice = createSlice({
    name: 'location',
    initialState: {
        currentLocation: "",
        latitude: "",
        longitude: ""
    },
    reducers: {
        upLocation: (state, action) => {
            state.currentLocation = action.payload.currentLocation;
            state.latitude = action.payload.latitude;
            state.longitude = action.payload.longitude;
        }
    }
})

export const {upLocation} = locSlice.actions;
export default locSlice.reducer;