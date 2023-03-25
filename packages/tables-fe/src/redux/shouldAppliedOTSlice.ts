import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { OpsEmitedFromBeArgs } from "@tables/types";

type PushOTPayload = {
  gridId: string;
  ots: OpsEmitedFromBeArgs<string>[];
};

export const shouldAppliedOTSlice = createSlice({
  name: "shouldAppliedOT",
  initialState: {
    shouldAppliedOT: {} as Record<string, OpsEmitedFromBeArgs<string>[]>,
  },
  reducers: {
    pushOT: (state, action: PayloadAction<PushOTPayload>) => {
      const { gridId, ots } = action.payload;
      console.log("pushOT ots", { ots });

      state.shouldAppliedOT[gridId] = ots;
    },
  },
});

export const { pushOT } = shouldAppliedOTSlice.actions;
export default shouldAppliedOTSlice.reducer;
