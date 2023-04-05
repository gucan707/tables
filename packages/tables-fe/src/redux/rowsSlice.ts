import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AddColumnArgs, Row } from "@tables/types";

type RowsState = Record<
  string,
  {
    headId: string;
    gridId: string;
  }[]
>;

export const rowsSlice = createSlice({
  name: "rows",
  initialState: {
    rows: {} as RowsState,
  },
  reducers: {
    addRows: (state, action: PayloadAction<Row[]>) => {
      const { payload } = action;
      const newRows: RowsState = {};
      payload.forEach((row) => {
        const gridIds = row.data.map((grid) => ({
          gridId: grid._id,
          headId: grid.headId,
        }));
        newRows[row._id] = gridIds;
      });

      state.rows = { ...state.rows, ...newRows };
    },
    addColumn: (state, action: PayloadAction<AddColumnArgs>) => {
      const { added, head } = action.payload;
      const rowIds = Object.keys(state.rows);
      // TODO 或许要考虑一下分页或其他异常情况
      rowIds.forEach((rowId) => {
        state.rows[rowId].push({
          gridId: added[rowId],
          headId: head._id,
        });
      });
    },
  },
});

export const { addColumn, addRows } = rowsSlice.actions;
export default rowsSlice.reducer;
