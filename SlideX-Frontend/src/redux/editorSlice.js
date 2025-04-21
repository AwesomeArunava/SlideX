import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  editor: null, // Fabric.js editor instance
};

const editorSlice = createSlice({
  name: "editor",
  initialState,
  reducers: {
    setEditor: (state, action) => {
      state.editor = action.payload;
    },
  },
});

export const { setEditor } = editorSlice.actions;
export default editorSlice.reducer;
