import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  ReqPutHeadAttributes,
  TableColumnTypes,
  TableHeads,
} from "@tables/types";

export const headsSlice = createSlice({
  name: "headsSlice",
  initialState: {
    heads: [] as TableHeads,
  },
  reducers: {
    setHeadAttribute: (state, action: PayloadAction<ReqPutHeadAttributes>) => {
      const { payload } = action;
      const headIndex = state.heads.findIndex(
        (head) => head._id === payload.headId
      );
      if (headIndex === -1) return;
      if (state.heads[headIndex].type !== payload.type) return;
      const h = state.heads[headIndex];

      switch (payload.type) {
        case TableColumnTypes.Checkbox:
        case TableColumnTypes.MultiSelect:
        case TableColumnTypes.Select:
        case TableColumnTypes.Text:
          h.name = payload.name;
          break;
        case TableColumnTypes.Date:
          if (h.type !== TableColumnTypes.Date) return;
          h.format = payload.format;
          break;
        case TableColumnTypes.Number:
          if (h.type !== TableColumnTypes.Number) return;
          h.decimal = payload.decimal;
          h.percent = payload.percent;
        default:
          break;
      }
    },
    setHeads: (state, action: PayloadAction<TableHeads>) => {
      state.heads = action.payload;
    },
  },
});

export const { setHeadAttribute, setHeads } = headsSlice.actions;
export default headsSlice.reducer;
