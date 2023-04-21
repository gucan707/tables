import { Grid, Table, ToGetColumnArgs } from "@tables/types";

import { getColumn } from "../http/table/getColumn";
import { addHeadByBeforeId } from "../redux/headsSlice";
import { store } from "../redux/store";

export const getColumnFn = async (
  args: ToGetColumnArgs,
  tableId: string,
  setTable: React.Dispatch<React.SetStateAction<Table | null | undefined>>
) => {
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

  setTable((table) => {
    if (!table) return null;
    const newTable = { ...table };
    newTable.rows.forEach((r) => {
      rowIdToGrid[r._id] && r.data.push(rowIdToGrid[r._id]);
    });
    return newTable;
  });

  store.dispatch(
    addHeadByBeforeId({ head: res.head, beforeHeadId: res.beforeHeadId })
  );
};
