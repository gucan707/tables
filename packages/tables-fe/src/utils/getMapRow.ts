import { Grid, Row } from "@tables/types";

export function getMapRow(rowData: Grid[]) {
  const mapRow: Map<string, Grid> = new Map();
  rowData.forEach((r) => {
    mapRow.set(r.headId, r);
  });
  return mapRow;
}
