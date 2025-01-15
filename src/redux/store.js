import { configureStore } from "@reduxjs/toolkit";
import pageReducer from "./pageSlice";
import { tasksApi } from "./tasksApi";


export const store = configureStore({
  reducer: {
    page: pageReducer,
    [tasksApi.reducerPath]: tasksApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(tasksApi.middleware),
});


export default store;
