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
  UndoType,
} from "@tables/types";
import { createInitialGrid } from "@tables/utils";

import { delRow } from "../../http/table/delRow";
import { useAppSelector } from "../../redux/store";
import { getMapRow } from "../../utils/getMapRow";
import { undoStack } from "../../utils/UndoStack";
import { EditableTableGrid } from "../EditableTableGrid";

export type EditableTableRowProps = {
  heads: TableHeads;
  tags: Map<string, SelectOptionType>;
  data: Grid[];
  rowId: string;
};

export const EditableTableRow: FC<EditableTableRowProps> = (props) => {
  const { heads, tags, data, rowId } = props;
  const { tableId = "" } = useParams();

  const mapRow = getMapRow(data);

  return (
    <tr className="editable_row">
      {heads.map((head) => (
        <EditableTableGrid
          key={head._id}
          grid={mapRow.get(head._id)}
          rowId={rowId}
          tags={tags}
        />
      ))}
      <td className="grid grid_common grid_add"></td>
      <div className="editable_row-delete_row">
        <IconClose
          className="editable_row-delete_row-btn"
          onClick={async () => {
            await delRow({ rowId, tableId });
            undoStack.add({
              undoType: UndoType.Row,
              isDeleted: false,
              rowId,
            });
          }}
        />
      </div>
    </tr>
  );
};
