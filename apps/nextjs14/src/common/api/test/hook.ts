import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { fetchManagerBaseQuery } from '@makeapi/fetch-manager';

interface Post {
  id: number;
  name: string;
}

// Define a service using a base URL and expected endpoints
export const testApi = createApi({
  reducerPath: 'testApi',
  baseQuery: fetchManagerBaseQuery(),
  endpoints: build => ({
    getTodos: build.query<any, void>({
      query: () => ({ url: '/todos', method: 'get' }),
    }),
    /*addPost: build.mutation<Post, Partial<Post>>({
     // highlight-start
     query: (body) => ({
       url: `posts`,
       method: 'POST',
       body,
     }),
     // highlight-end
     invalidatesTags: [{ type: 'Post', id: 'LIST' }],
   }),*/
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetTodosQuery } = testApi;
