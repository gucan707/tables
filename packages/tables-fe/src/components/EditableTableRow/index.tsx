import { FC, useEffect } from "react";

import {
  Grid,
  Row,
  SelectOptionType,
  TableColumnTypes,
  TableHeads,
} from "@tables/types";

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
      curRowData.push({
        type: TableColumnTypes.Text,
        _id: grid.gridId,
        headId: head._id,
        text: "",
        version: 0,
      });
    });
  } else {
    curRowData.push(...row.data);
  }

  const mapRow = getMapRow(curRowData);

  return (
    <tr>
      {heads.map((head) => (
        <EditableTableGrid
          key={head._id}
          grid={mapRow.get(head._id)}
          rowId={row._id}
          tags={tags}
        />
      ))}
      <td className="grid grid_common grid_add"></td>
    </tr>
  );
};
