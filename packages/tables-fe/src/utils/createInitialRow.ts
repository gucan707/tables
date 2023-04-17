import { Grid, Row, TableHeads } from "@tables/types";
import { createInitialGrid } from "@tables/utils";

type CreateInitialRowArgs = {
  dataInfo: { gridId: string; headId: string }[];
  rowId: string;
  heads: TableHeads;
};

export function createInitialRow(
  args: CreateInitialRowArgs
): Omit<Row, "tableId"> {
  const { dataInfo, rowId, heads } = args;
  const data: Grid[] = [];
  heads.forEach((h) => {
    const grid = dataInfo.find((d) => d.headId === h._id);
    if (!grid) {
      console.error("createInitialRow: 存在缺失格子");
      return;
    }

    const initialGrid = createInitialGrid(grid.gridId, h.type, h._id);
    if (!initialGrid) {
      console.error("createInitialRow: createInitialGrid 返回空值");
      return;
    }

    data.push(initialGrid);
  });

  return {
    _id: rowId,
    data,
  };
}
