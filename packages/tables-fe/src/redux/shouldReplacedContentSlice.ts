import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ReplaceGridContentArgs } from "@tables/types";

export const shouldReplacedContentSlice = createSlice({
  name: "shouldReplaceContent",
  initialState: {
    shouldReplacedContent: {} as Record<
      string,
      ReplaceGridContentArgs | undefined
    >,
  },
  reducers: {
    addContent: (state, action: PayloadAction<ReplaceGridContentArgs>) => {
      const { gridId } = action.payload;
      state.shouldReplacedContent[gridId] = action.payload;
    },
  },
});

export const { addContent } = shouldReplacedContentSlice.actions;
export default shouldReplacedContentSlice.reducer;
