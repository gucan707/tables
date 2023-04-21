import { Grid, Table, ToGetColumnArgs } from "@tables/types";

import { getColumn } from "../http/table/getColumn";
import { addHeadByBeforeId } from "../redux/headsSlice";
import { addColumnWithContents } from "../redux/rowsSlice";
import { store } from "../redux/store";

export const getColumnFn = async (args: ToGetColumnArgs, tableId: string) => {
  const rowIds = store.getState().rowsReducer.rowsArr.map((r) => r.rowId);
  const res = await getColumn({
    headId: args.headId,
    rowIds,
    tableId,
  });

  if (!res) return;

  const rowIdToGrid: Record<string, Grid> = {};

  res.data.forEach((data) => {
    rowIdToGrid[data.rowId] = data.grid;
  });

  store.dispatch(
    addHeadByBeforeId({ head: res.head, beforeHeadId: res.beforeHeadId })
  );
  store.dispatch(addColumnWithContents({ added: rowIdToGrid }));
};
