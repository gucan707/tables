import "./index.less";

import { FC, useEffect } from "react";
import { useParams } from "react-router-dom";

import { IconClose, IconDelete } from "@arco-design/web-react/icon";
import {
  Grid,
  Row,
  SelectOptionType,
  TableColumnTypes,
  TableHeads,
} from "@tables/types";
import { createInitialGrid } from "@tables/utils";

import { delRow } from "../../http/table/delRow";
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
  const { tableId = "" } = useParams();

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
      <div className="editable_row-delete_row">
        <IconClose
          className="editable_row-delete_row-btn"
          onClick={() => delRow({ rowId: row._id, tableId })}
        />
      </div>
    </tr>
  );
};
