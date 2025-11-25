import { createSlice } from "@reduxjs/toolkit";

export const catSlice = createSlice({
    name: 'categories',
    initialState: {
        parent: [],
        child: [],
    },
    reducers: {
        upCategories: (state, action) => {
            state.parent = action.payload.parent;
            state.child = action.payload.child;
        }
    }
})

export const {upCategories} = catSlice.actions;
export default catSlice.reducer;