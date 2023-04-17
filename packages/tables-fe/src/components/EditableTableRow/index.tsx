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
  row: Omit<Row, "tableId">;
  heads: TableHeads;
  tags: Map<string, SelectOptionType>;
};

export const EditableTableRow: FC<EditableTableRowProps> = (props) => {
  const { row, heads, tags } = props;

  const mapRow = getMapRow(row.data);

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
      {/* <div className="editable_row-add_row">
        <div className="editable_row-add_row-btn">+</div>
      </div> */}
    </tr>
  );
};
