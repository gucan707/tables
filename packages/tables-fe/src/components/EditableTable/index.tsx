import { FC } from "react";

import { Table } from "@tables/types";

import { fakeTables, fakeTags } from "../../data/tables";
import { getMapTags } from "../../utils/getMapTags";
import { EditableTableRow } from "../EditableTableRow";
import { TableIcon } from "../TableIcon";

export type EditableTableProps = {
  className?: string;
  table: Table;
};

export const EditableTable: FC<EditableTableProps> = (props) => {
  const { className = "", table } = props;
  const { heads, rows } = table;

  const tags = getMapTags(heads);

  return (
    <div className={`editable table-container ${className}`}>
      <table className="editable table">
        <thead className="editable table-heads">
          <tr>
            {heads.map((head) => (
              <th
                key={head._id}
                className="editable table-heads-item grid_common"
              >
                <TableIcon
                  type={head.type}
                  className="editable table-heads-item-icon"
                />
                {head.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <EditableTableRow
              heads={heads}
              row={row}
              key={row._id}
              tags={tags}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};
