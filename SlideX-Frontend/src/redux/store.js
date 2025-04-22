import { configureStore } from "@reduxjs/toolkit";
import editorReducer from "./editorSlice";
import slideReducer, { saveSlideToBackend } from "./slideSlice";

const autoSaveMiddleware = (store) => (next) => (action) => {
  const result = next(action);
  
  if (action.type === 'slides/updateSlideJson') {
    const state = store.getState().slides;
    const currentSlide = state.slides[state.currentIndex];
    if (currentSlide?._id) {
      store.dispatch(saveSlideToBackend({
        slideDeckId: slideId,
        slides: state.slides 
      }));
    }
  }
  
  return result;
};

export const store = configureStore({
  reducer: {
    editor: editorReducer,
    slides: slideReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(autoSaveMiddleware),
});
