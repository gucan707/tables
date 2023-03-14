import "./index.less";

import { FC } from "react";

import { SelectOptionType, Table } from "@tables/types";

import { fakeTables, fakeTags } from "../../data/tables";
import { ReadonlyTableRow } from "../ReadonlyTableRow";
import { TableIcon } from "../TableIcon";

export type ReadonlyTableProps = {
  className?: string;
  tables: Table[];
};

export const ReadonlyTable: FC<ReadonlyTableProps> = (props) => {
  const { className = "", tables = [] } = props;
  const { heads, body } = tables[0];
  const tags = getMapTags(fakeTags);

  return (
    <div className={`readonly_table-container ${className}`}>
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
            <ReadonlyTableRow
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

function getMapTags(tags: SelectOptionType[]) {
  const mapTags = new Map<string, SelectOptionType>();
  tags.forEach((tag) => {
    mapTags.set(tag._id, tag);
  });
  return mapTags;
}
