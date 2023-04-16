import "./index.less";

import { FC, useEffect } from "react";

import {
  Grid,
  Row,
  SelectOptionType,
  TableColumnTypes,
  TableHeads,
} from "@tables/types";
import { createInitialGrid } from "@tables/utils";

import { useAppSelector } from "../../redux/store";
import { getMapRow } from "../../utils/getMapRow";
import { EditableTableGrid } from "../EditableTableGrid";

export type EditableTableRowProps = {
  row: Row;
  heads: TableHeads;
  tags: Map<string, SelectOptionType>;
};

export const EditableTableRow: FC<EditableTableRowProps> = (props) => {
  const { row, heads, tags } = props;
  const rowDataRedux = useAppSelector(
    (state) => state.rowsReducer.rows[row._id]
  );

  const curRowData: Grid[] = [];
  if (rowDataRedux) {
    rowDataRedux.forEach((grid) => {
      const exited = row.data.find((g) => g._id === grid.gridId);
      if (exited) {
        curRowData.push(exited);
        return;
      }

      const head = heads.find((h) => h._id === grid.headId);
      if (!head) return;
      // 视为新增
      const newGrid = createInitialGrid(grid.gridId, head.type, head._id);
      newGrid && curRowData.push(newGrid);
    });
  } else {
    curRowData.push(...row.data);
  }

  const mapRow = getMapRow(curRowData);

  return (
    <tr className="editable_row">
      {heads.map((head) => (
        <EditableTableGrid
          key={head._id}
          grid={mapRow.get(head._id)}
          rowId={row._id}
          tags={tags}
        />
      ))}
      <td className="grid grid_common grid_add"></td>
      <div className="editable_row-add_row">
        <div className="editable_row-add_row-btn">+</div>
      </div>
    </tr>
  );
};
