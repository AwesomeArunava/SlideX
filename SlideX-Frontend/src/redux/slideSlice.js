import { createSlice, current, createAsyncThunk } from "@reduxjs/toolkit";

export const saveSlideToBackend = createAsyncThunk(
  'slides/saveSlideToBackend',
  async ({ slideDeckId, slides }) => {
    try {
      const response = await fetch('/api/slide/updateSlide', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ slideDeckId, slides }),
      });
      if (!response.ok) {
        throw new Error('Failed to save slide');
      }
      return await response.json();
    } catch (error) {
      console.error('Error saving slide:', error);
      throw error;
    }
  }
);

// const initialState = {
//   slides: [{id:1, elements:{}}],
//   currentSlide: null,
//   currentIndex:0,
// };

const initialState = {
  slides: [
    
  ],
  slidesAsImg:[],
  currentSlide: null,
  currentIndex: 0,
  
};


const slideSlice = createSlice({
  name: "slides",
  initialState,
  reducers: {
    setSlides: (state, action) => {
      state.slides = action.payload;
    },
    addSlide: (state, action) => {
      state.slides.push({
        id: state.slides.length + 1,
        elements: action.payload || {},
        history: [],
        redoStack: [], // fallback to empty if not provided
      });
    },
    deleteSlide:(state, action) => {
      const { slideIndex } = action.payload;
      state.slides.splice(slideIndex,1)
    },
    setCurrentSlide: (state, action) => {
      state.currentSlide = action.payload; // expects full slide object or index, your choice
    },
    setCurrentIndex: (state, action) => {
      state.currentIndex = action.payload; // expects full slide object or index, your choice
    },
    updateSlideJson: (state, action) => {
      const { slideIndex, canvasJson } = action.payload;
      state.slides[slideIndex].elements = canvasJson;
    },
    // updateHistory: (state, action) => {
    //   const { slideIndex, canvasJson } = action.payload;
    //   const slide = state.slides[slideIndex];
    
    //   if (!slide.history) {
    //     slide.history = [];
    //   }
    
    //   slide.history.push(canvasJson);
    // },
    updateHistory: (state, action) => {
      const { slideIndex, canvasJson } = action.payload;
      const history = state.slides[slideIndex].history || [];
      state.slides[slideIndex].history = [...history, canvasJson];
    },
    undoHistory: (state, action) => {
      const { slideIndex } = action.payload;
      const slide = state.slides[slideIndex];
    
      if (!slide.history || slide.history.length <= 1) return;
    
      const lastState = slide.history.pop();
      if (!slide.redoStack) {
        slide.redoStack = [];
      }
      slide.redoStack.push(lastState);
    
      slide.elements = slide.history[slide.history.length - 1]; // restore previous
    },
    redoHistory: (state, action) => {
      const { slideIndex } = action.payload;
      const slide = state.slides[slideIndex];
    
      if (!slide.redoStack || slide.redoStack.length === 0) return;
    
      const redoState = slide.redoStack.pop();
      slide.history.push(redoState);
      slide.elements = redoState; // Or wherever you store the canvas JSON
    },
    addSlideAsImage: (state, action) =>{
      state.slidesAsImg = action.payload;
    },
    reorderSlides: (state, action) => {
      const { fromIndex, toIndex } = action.payload;
      const [removed] = state.slides.splice(fromIndex, 1);
      state.slides.splice(toIndex, 0, removed);
      
      // Update currentIndex if needed
      if (state.currentIndex === fromIndex) {
        state.currentIndex = toIndex;
      } else if (
        fromIndex < state.currentIndex && 
        toIndex >= state.currentIndex
      ) {
        state.currentIndex--;
      } else if (
        fromIndex > state.currentIndex && 
        toIndex <= state.currentIndex
      ) {
        state.currentIndex++;
      }
      
      // Also reorder slidesAsImg array to keep in sync
      if (state.slidesAsImg.length > fromIndex && state.slidesAsImg.length > toIndex) {
        const [imgRemoved] = state.slidesAsImg.splice(fromIndex, 1);
        state.slidesAsImg.splice(toIndex, 0, imgRemoved);
      }
    }
  },
});

export const { 
  addSlide, 
  updateSlideJson, 
  setCurrentSlide, 
  setCurrentIndex, 
  updateHistory, 
  undoHistory, 
  redoHistory, 
  deleteSlide, 
  addSlideAsImage,
  reorderSlides 
} = slideSlice.actions;
export default slideSlice.reducer;

