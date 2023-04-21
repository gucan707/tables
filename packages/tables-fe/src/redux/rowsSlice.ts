import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  AddColumnArgs,
  ChangeHeadTypeArgs,
  DelRowArgs,
  Grid,
  Row,
  TableHead,
} from "@tables/types";
import { createInitialGrid } from "@tables/utils";

type RowsState = Record<string, (Grid & { gridId: string })[]>;

type RowsArrState = { rowId: string; createTime: number }[];

type AddColumnWithContentsArgs = {
  // head: TableHead;
  added: Record<string, Grid>;
};

export const rowsSlice = createSlice({
  name: "rows",
  initialState: {
    rows: {} as RowsState,
    rowsArr: [] as RowsArrState,
  },
  reducers: {
    addRows: (state, action: PayloadAction<Row[]>) => {
      const { payload } = action;
      console.log("redux addRows", payload);

      payload.forEach((row) => {
        const gridIds = row.data.map((grid) => ({
          gridId: grid._id,
          ...grid,
        }));
        state.rows[row._id] = gridIds;
        const exitedRowIndex = state.rowsArr.findIndex(
          (r) => r.rowId === row._id
        );
        if (exitedRowIndex !== -1) {
          state.rowsArr[exitedRowIndex] = {
            rowId: row._id,
            createTime: row.createTime ?? -1,
          };
        } else {
          state.rowsArr.push({
            rowId: row._id,
            createTime: row.createTime ?? -1,
          });
        }
      });

      state.rowsArr.sort((a, b) => a.createTime - b.createTime);
    },
    addColumn: (state, action: PayloadAction<AddColumnArgs>) => {
      const { added, head } = action.payload;
      // TODO 或许要考虑一下分页或其他异常情况
      state.rowsArr.forEach((r) => {
        const grid = createInitialGrid(added[r.rowId], head.type, head._id);
        if (!grid) return;
        state.rows[r.rowId].push({
          gridId: added[r.rowId],
          ...grid,
        });
      });
    },
    addColumnWithContents: (
      state,
      action: PayloadAction<AddColumnWithContentsArgs>
    ) => {
      const { added } = action.payload;
      state.rowsArr.forEach((r) => {
        const grid = added[r.rowId];
        if (!grid) return;
        state.rows[r.rowId].push({
          ...grid,
          gridId: grid._id,
        });
      });
    },
    // replaceGrids: (state, action: PayloadAction<ChangeHeadTypeArgs>) => {
    //   const { head, newGrids } = action.payload;
    //   for (let rowId in state.rows) {
    //     const grids = state.rows[rowId];
    //     if (!newGrids[rowId]) continue;
    //     const index = grids.findIndex((g) => g.gridId === newGrids[rowId]);
    //     if (index === -1) {
    //       state.rows[rowId].push({ gridId: newGrids[rowId], headId: head._id });
    //     } else {
    //       state.rows[rowId][index].gridId = newGrids[rowId];
    //     }
    //   }
    // },
    delRowInRedux: (state, action: PayloadAction<DelRowArgs>) => {
      const { rowId } = action.payload;
      delete state.rows[rowId];
      const index = state.rowsArr.findIndex((r) => r.rowId === rowId);
      if (index === -1) return;
      state.rowsArr.splice(index, 1);
    },
    delColumn: (state, action: PayloadAction<{ headId: string }>) => {
      const { headId } = action.payload;
      state.rowsArr.forEach((r) => {
        const index = state.rows[r.rowId].findIndex((g) => g.headId === headId);
        if (index === -1) return;
        state.rows[r.rowId].splice(index, 1);
      });
    },
  },
});

export const {
  addColumn,
  addRows,
  delRowInRedux,
  addColumnWithContents,
  delColumn,
} = rowsSlice.actions;
export default rowsSlice.reducer;
