import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MultiSelectOTData, OpsEmitedFromBeArgs } from "@tables/types";

import { OTController } from "../utils/OTsController";

type PushOTPayload = {
  gridId: string;
  ots: OpsEmitedFromBeArgs<string>;
};

type PushTagsOTPayload = {
  gridId: string;
  ots: OpsEmitedFromBeArgs<MultiSelectOTData>;
};

type delOTPayload = {
  gridId: string;
  index: number;
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
      const curGridOts = state.shouldAppliedOT[gridId] || [];
      curGridOts.push(ots);
      curGridOts.sort((a, b) => a.oldVersion - b.oldVersion);
      state.shouldAppliedOT[gridId] = curGridOts;
    },
    /** 接收index，删除 ots 的 [0, index) */
    delOT: (state, action: PayloadAction<delOTPayload>) => {
      const { gridId, index } = action.payload;
      state.shouldAppliedOT[gridId] &&
        state.shouldAppliedOT[gridId].splice(0, index);
    },
    pushTagsOT: (state, action: PayloadAction<PushTagsOTPayload>) => {
      const { gridId, ots } = action.payload;
      const curGridOts = state.shouldAppliedTagsOt[gridId] || [];
      curGridOts.push(ots);
      curGridOts.sort((a, b) => a.oldVersion - b.oldVersion);
      state.shouldAppliedTagsOt[gridId] = curGridOts;
    },
    delTagsOT: (state, action: PayloadAction<delOTPayload>) => {
      const { gridId, index } = action.payload;
      state.shouldAppliedTagsOt[gridId] &&
        state.shouldAppliedTagsOt[gridId].splice(0, index);
    },
  },
});

export const { pushOT, pushTagsOT, delOT, delTagsOT } =
  shouldAppliedOTSlice.actions;
export default shouldAppliedOTSlice.reducer;
