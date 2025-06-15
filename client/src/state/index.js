import { createSlice, configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { api } from "./api";

// Get initial mode from localStorage or default to 'dark'
const initialState = {
  mode: localStorage.getItem("mode") || "dark",
};

const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setMode: (state) => {
      state.mode = state.mode === "dark" ? "light" : "dark";
      localStorage.setItem("mode", state.mode);
    },
  },
});

export const { setMode } = globalSlice.actions;

export const store = configureStore({
  reducer: {
    global: globalSlice.reducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
  preloadedState: {
    global: {
      mode: localStorage.getItem("mode") || "light",
    },
  },
});

setupListeners(store.dispatch);

export default store;
