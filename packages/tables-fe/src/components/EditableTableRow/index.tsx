import { FC } from "react";

import { Row, SelectOptionType, TableHeads } from "@tables/types";

import { getMapRow } from "../../utils/getMapRow";
import { EditableTableGrid } from "../EditableTableGrid";

export type EditableTableRowProps = {
  row: Row;
  heads: TableHeads;
  tags: Map<string, SelectOptionType>;
};

export const EditableTableRow: FC<EditableTableRowProps> = (props) => {
  const { row, heads, tags } = props;
  const mapRow = getMapRow(row);

  return (
    <tr>
      {heads.map((head) => (
        <EditableTableGrid
          key={head._id}
          grid={mapRow.get(head._id)}
          tags={tags}
        />
      ))}
    </tr>
  );
};
