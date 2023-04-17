import { ObjectId } from "mongodb";

import { Row, TableHeads } from "@tables/types";
import { createInitialGrid } from "@tables/utils";

export function getInitialTableRow(tableId: string, heads: TableHeads): Row {
  const row: Row = {
    _id: new ObjectId().toString(),
    data: [],
    tableId,
  };
  heads.forEach((head) => {
    const grid = createInitialGrid(
      new ObjectId().toString(),
      head.type,
      head._id
    );
    grid && row.data.push(grid);
  });
  return row;
}
