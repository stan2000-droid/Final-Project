import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: process.env.REACT_APP_BASE_URL }),
  reducerPath: "adminApi",
  tagTypes: [
    "Detections" // Only keep detections tag as it's the main functionality
  ],  endpoints: (build) => ({    // Upload endpoint for video files
    uploadVideo: build.mutation({
      query: ({ file }) => {
        const formData = new FormData();
        formData.append('file', file);
        
        return {
          url: `/api/upload`,
          method: 'POST',
          body: formData,
          // Don't set Content-Type header, let browser set it with boundary for FormData
          formData: true,
        };
      },
      invalidatesTags: ['Detections']
    }),
      // Get detection data from Flask backend
    getDetectionData: build.query({
      query: (limit = 10) => ({
        url: `http://localhost:5000/api/detections?limit=${limit}`,
        method: 'GET',
      }),
      providesTags: ['Detections'],
      transformResponse: (response) => {
        return response.detections || [];
      },
    }),

    // Get statistics box data for dashboard
    getStatBox: build.query({
      query: () => '/api/detections/stats-box',
      providesTags: ['Detections'],
      pollingInterval: 30000, // Poll every 30 seconds for real-time updates
    }),

    // Get overview data for monthly chart visualization
    getOverview: build.query({
      query: () => '/api/detections/overview',
      providesTags: ['Detections'],
      pollingInterval: 60000, // Poll every 60 seconds
    }),

    // Get breakdown data for pie/bar charts
    getBreakdown: build.query({
      query: () => '/api/detections/breakdown',
      providesTags: ['Detections'],
      pollingInterval: 30000, // Poll every 30 seconds
    }),    // Get all detection data with basic fields
    getData: build.query({
      query: () => '/api/detections/data',
      providesTags: ['Detections'],
      pollingInterval: 30000, // Poll every 30 seconds
    }),

    // Get paginated detection list with sorting and search
    getDetectionList: build.query({
      query: ({ page = 1, pageSize = 20, sort = null, search = "" }) => {
        const params = new URLSearchParams({
          page: page.toString(),
          pageSize: pageSize.toString(),
          search,
        });
        
        if (sort) {
          params.append('sort', JSON.stringify(sort));
        }
        
        return `/api/detections/list?${params}`;
      },
      providesTags: ['Detections'],
    }),
  }),
});

export const {
  useUploadVideoMutation,
  useGetDetectionDataQuery,
  useGetStatBoxQuery,
  useGetOverviewQuery,
  useGetBreakdownQuery,
  useGetDataQuery,
  useGetDetectionListQuery,
} = api;
