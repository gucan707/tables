import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const activeGridSlice = createSlice({
  name: "activeGrid",
  initialState: {
    id: "",
  },
  reducers: {
    changeActiveGridId: (state, action: PayloadAction<string>) => {
      state.id = action.payload;
    },
  },
});

export const { changeActiveGridId } = activeGridSlice.actions;
export default activeGridSlice.reducer;
