import { FC } from "react";

import { Grid, Row, TableHeads } from "@tables/types";

import { ReadonlyTableGrid } from "../ReadonlyTableGrid";

export type ReadonlyTableRowProps = {
  row: Row;
  heads: TableHeads;
};

export const ReadonlyTableRow: FC<ReadonlyTableRowProps> = (props) => {
  const { row, heads } = props;
  const mapRow = getMapRow(row);

  return (
    <tr>
      {heads.map((head) => (
        <ReadonlyTableGrid key={head._id} grid={mapRow.get(head._id)} />
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
