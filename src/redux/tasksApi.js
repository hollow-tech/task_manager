import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const tasksApi = createApi({
  reducerPath: "tasksApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3001/" }),
  endpoints: (build) => ({
    getTasks: build.query({
      query: ({ currentPage, sortProperty }) => {
        const url = `/tasks?_page=${currentPage}&_limit=10&_sort=${sortProperty}`;
        console.log("Generated URL:", url);
        return url;
      },
      serializeQueryArgs: ({ endpointName }) => {
        return endpointName;
      },
      merge: (currentCache, newItems) => {
        console.log("Current Cache:", currentCache);
        console.log("New Items:", newItems);
        currentCache.push(...newItems);
      },
      // Refetch when the page arg changes
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
    }),
  }),
});

export const { useGetTasksQuery } = tasksApi;
