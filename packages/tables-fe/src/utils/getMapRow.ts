import { Grid, Row } from "@tables/types";

export function getMapRow(row: Row) {
  const mapRow: Map<string, Grid> = new Map();
  row.data.forEach((r) => {
    mapRow.set(r.headId, r);
  });
  return mapRow;
}
