import { Grid, ReplaceColumnArgs, Table } from "@tables/types";

import { getColumn } from "../http/table/getColumn";
import { addHeadByBeforeId, delHead } from "../redux/headsSlice";
import { addColumnWithContents, delColumn } from "../redux/rowsSlice";
import { store } from "../redux/store";

export const replaceColumnFn = async (
  args: ReplaceColumnArgs,
  tableId: string
) => {
  const rowIds = store.getState().rowsReducer.rowsArr.map((r) => r.rowId);
  const res = await getColumn({
    headId: args.curHeadId,
    rowIds,
    tableId,
  });

  if (!res) return;
  const rowIdToGrid: Record<string, Grid> = {};

  res.data.forEach((data) => {
    rowIdToGrid[data.rowId] = data.grid;
  });

  store.dispatch(delHead({ headId: args.oldHeadId }));
  store.dispatch(
    addHeadByBeforeId({ head: res.head, beforeHeadId: res.beforeHeadId })
  );
  store.dispatch(delColumn({ headId: args.oldHeadId }));
  store.dispatch(addColumnWithContents({ added: rowIdToGrid }));
};
