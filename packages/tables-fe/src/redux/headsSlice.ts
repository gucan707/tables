import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  AddTagArgs,
  ChangeHeadTypeArgs,
  DelColumnArgs,
  ReqPostTag,
  ReqPutHeadAttributes,
  TableColumnTypes,
  TableHead,
  TableHeads,
  UpdateTagArgs,
} from "@tables/types";

export type AddHeadByBeforeId = {
  head: TableHead;
  beforeHeadId?: string;
};

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
    changeHeadType: (state, action: PayloadAction<ChangeHeadTypeArgs>) => {
      const { head, oldHeadId } = action.payload;
      const index = state.heads.findIndex((h) => h._id === oldHeadId);
      if (index === -1) {
        state.heads.push(head);
        return;
      }
      state.heads[index] = head;
    },
    addTag: (state, action: PayloadAction<AddTagArgs>) => {
      const { payload } = action;
      const head = state.heads.find((h) => h._id === payload.headId);
      if (
        !head ||
        (head.type !== TableColumnTypes.MultiSelect &&
          head.type !== TableColumnTypes.Select)
      )
        return;

      head.tags.push(payload);
    },
    updateTag: (state, action: PayloadAction<UpdateTagArgs>) => {
      const { payload } = action;
      const head = state.heads.find((h) => h._id === payload.headId);
      if (
        !head ||
        (head.type !== TableColumnTypes.MultiSelect &&
          head.type !== TableColumnTypes.Select)
      )
        return;

      const tag = head.tags.find((t) => t._id === payload.tagId);
      if (!tag) return;
      tag.color = payload.color;
      tag.text = payload.text;
    },
    addHead: (state, action: PayloadAction<TableHead>) => {
      state.heads.push(action.payload);
    },
    delHead: (state, action: PayloadAction<DelColumnArgs>) => {
      const index = state.heads.findIndex(
        (h) => h._id === action.payload.headId
      );
      state.heads.splice(index, 1);
    },
    addHeadByBeforeId: (state, action: PayloadAction<AddHeadByBeforeId>) => {
      const { head, beforeHeadId = "" } = action.payload;

      const index = state.heads.findIndex((h) => h._id === beforeHeadId);
      if (index === -1) {
        state.heads.unshift(head);
        return;
      }

      state.heads.splice(index, 0, head);
    },
  },
});

export const {
  setHeadAttribute,
  setHeads,
  addTag,
  updateTag,
  addHead,
  delHead,
  changeHeadType,
  addHeadByBeforeId,
} = headsSlice.actions;
export default headsSlice.reducer;
