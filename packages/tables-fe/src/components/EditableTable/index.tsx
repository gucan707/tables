import { FC } from "react";

import { Trigger } from "@arco-design/web-react";
import { Table } from "@tables/types";

import { getMapTags } from "../../utils/getMapTags";
import { EditableTableRow } from "../EditableTableRow";
import { HeadAttributes } from "../HeadAttributes";
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
              <Trigger
                popup={() => <HeadAttributes head={head} />}
                trigger="click"
                position="bottom"
                classNames="zoomInTop"
                key={head._id}
              >
                <th className="editable table-heads-item grid_common">
                  <TableIcon
                    type={head.type}
                    className="editable table-heads-item-icon"
                  />
                  {head.name}
                </th>
              </Trigger>
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
