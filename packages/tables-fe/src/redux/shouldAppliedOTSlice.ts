import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MultiSelectOTData, OpsEmitedFromBeArgs } from "@tables/types";

type PushOTPayload = {
  gridId: string;
  ots: OpsEmitedFromBeArgs<string>[];
};

type PushTagsOTPayload = {
  gridId: string;
  ots: OpsEmitedFromBeArgs<MultiSelectOTData>[];
};

export const shouldAppliedOTSlice = createSlice({
  name: "shouldAppliedOT",
  initialState: {
    shouldAppliedOT: {} as Record<string, OpsEmitedFromBeArgs<string>[]>,
    shouldAppliedTagsOt: {} as Record<
      string,
      OpsEmitedFromBeArgs<MultiSelectOTData>[]
    >,
  },
  reducers: {
    pushOT: (state, action: PayloadAction<PushOTPayload>) => {
      const { gridId, ots } = action.payload;
      state.shouldAppliedOT[gridId] = ots;
    },
    pushTagsOT: (state, action: PayloadAction<PushTagsOTPayload>) => {
      const { gridId, ots } = action.payload;
      state.shouldAppliedTagsOt[gridId] = ots;
    },
  },
});

export const { pushOT, pushTagsOT } = shouldAppliedOTSlice.actions;
export default shouldAppliedOTSlice.reducer;
