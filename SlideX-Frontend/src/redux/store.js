import { configureStore } from "@reduxjs/toolkit";
import editorReducer from "./editorSlice";
import slideReducer from "./slideSlice";

export const store = configureStore({
  reducer: {
    editor: editorReducer,
    slides: slideReducer,
  },
});
