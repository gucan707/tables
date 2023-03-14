import { FC } from "react";

import { Grid, Row, SelectOptionType, TableHeads } from "@tables/types";

import { ReadonlyTableGrid } from "../ReadonlyTableGrid";

export type ReadonlyTableRowProps = {
  row: Row;
  heads: TableHeads;
  tags: Map<string, SelectOptionType>;
};

export const ReadonlyTableRow: FC<ReadonlyTableRowProps> = (props) => {
  const { row, heads, tags } = props;
  const mapRow = getMapRow(row);

  return (
    <tr>
      {heads.map((head) => (
        <ReadonlyTableGrid
          key={head._id}
          grid={mapRow.get(head._id)}
          tags={tags}
        />
      ))}
    </tr>
  );
};

export function getMapRow(row: Row) {
  const mapRow: Map<string, Grid> = new Map();
  row.data.forEach((r) => {
    mapRow.set(r.headId, r);
  });
  return mapRow;
}
