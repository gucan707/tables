import { FC } from "react";

import { Grid, Row, SelectOptionType, TableHeads } from "@tables/types";

import { getMapRow } from "../../utils/getMapRow";
import { ReadonlyTableGrid } from "../ReadonlyTableGrid";

export type ReadonlyTableRowProps = {
  row: Row;
  heads: TableHeads;
  tags: Map<string, SelectOptionType>;
};

export const ReadonlyTableRow: FC<ReadonlyTableRowProps> = (props) => {
  const { row, heads, tags } = props;
  const mapRow = getMapRow(row.data);

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
