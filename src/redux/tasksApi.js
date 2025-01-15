import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const tasksApi = createApi({
  reducerPath: "tasksApi",
  tagTypes: ["Tasks"],
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3001/" }),
  endpoints: (build) => ({
    getTasks: build.query({
      query: ({ currentPage, sortProperty }) => {
        const url = `/tasks?_page=${currentPage}&_limit=10&_sort=${sortProperty}`;
        console.log("Generated URL:", url);
        return url;
      },
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: "Tasks", id })), { type: "Tasks", id: "LIST" }]
          : [{ type: "Tasks", id: "LIST" }],

      serializeQueryArgs: ({ endpointName }) => {
        return endpointName;
      },
      merge: (currentCache, newItems) => {
        console.log("Current Cache:", currentCache);
        console.log("New Items:", newItems);

        const deduplicated = [
          ...currentCache,
          ...newItems.filter(
            (newItem) => !currentCache.some((cacheItem) => cacheItem.id === newItem.id),
          ),
        ];

        return deduplicated;
      },
    
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
    }),
    addTask: build.mutation({
      query: (body) => ({
        url: "tasks",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Tasks", id: "LIST" }],
    }),
    deleteTask: build.mutation({
      query: (id) => ({
        url: `/tasks/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Tasks", id: "LIST" }],
    }),
  }),
});

export const { useGetTasksQuery, useAddTaskMutation, useDeleteTaskMutation } = tasksApi;
