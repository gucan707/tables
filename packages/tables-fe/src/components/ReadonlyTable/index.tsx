import "./index.less";

import { FC } from "react";

import { fakeTables } from "../../data/tables";
import { ReadonlyTableRow } from "../ReadonlyTableRow";
import { TableIcon } from "../TableIcon";

export const ReadonlyTable: FC = () => {
  const { heads, body } = fakeTables[0];

  return (
    <div className="readonly_table-container">
      <table className="readonly_table">
        <thead className="readonly_table-heads">
          <tr>
            {heads.map((head) => (
              <th
                key={head._id}
                className="readonly_table-heads-item grid_common"
              >
                <TableIcon
                  type={head.type}
                  className="readonly_table-heads-item-icon"
                />
                {head.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {body.map((row) => (
            <ReadonlyTableRow heads={heads} row={row} key={row._id} />
          ))}
        </tbody>
      </table>
    </div>
  );
};
