import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  error: false,
};

export const dataSlice = createSlice({
  name: "data",
  initialState,
  reducers: {
    toggleLoading: (state, action) => {
      state.loading = action.payload;
    },
    toggleError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { toggleLoading, toggleError } = dataSlice.actions;
export const loadingState = (state) => state.data.loading;
export const errorState = (state) => state.data.error;

export default dataSlice.reducer;
