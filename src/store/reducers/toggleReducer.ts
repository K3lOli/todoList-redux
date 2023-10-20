import { createSlice } from "@reduxjs/toolkit";


const Toggle = createSlice({
    name: 'toggle',
    initialState: false,
    reducers: {
        toggle: (state) => !state,
    },
});

export const { toggle } = Toggle.actions;
export default Toggle.reducer;