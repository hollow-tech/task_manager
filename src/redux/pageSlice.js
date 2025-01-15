import { createSlice } from "@reduxjs/toolkit";

const pageSlice = createSlice({
  name: "page",
  initialState: {
    currentPage: 1, // Start with the first page
  },
  reducers: {
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
  },
});

console.log(pageSlice, "pageSlice");

export const { setCurrentPage } = pageSlice.actions;
export default pageSlice.reducer;
