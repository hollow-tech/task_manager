import { configureStore } from "@reduxjs/toolkit";
import pageReducer from "./pageSlice";
import { tasksApi } from "./tasksApi";

// If you need to persist state, you can use `redux-persist` (optional)
// import { persistReducer, persistStore } from 'redux-persist';
// import storage from 'redux-persist/lib/storage'; // LocalStorage by default

// const persistConfig = {
//   key: 'root',
//   storage,
// };

// const persistedReducer = persistReducer(persistConfig, pageReducer);

export const store = configureStore({
  reducer: {
    page: pageReducer, // Handle the current page state
    [tasksApi.reducerPath]: tasksApi.reducer, // RTK Query reducer for tasks API
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(tasksApi.middleware), // Middleware to handle async API requests
});

// Optional: If you're using redux-persist to persist page state across reloads
// export const persistor = persistStore(store);

export default store;
