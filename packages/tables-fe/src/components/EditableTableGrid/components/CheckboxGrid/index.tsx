import { FC, useState } from "react";
import { useParams } from "react-router-dom";

import { IconCheck } from "@arco-design/web-react/icon";
import { CheckboxType } from "@tables/types";

import { CommonGridProps } from "../..";
import { putGridContent } from "../../../../http/table/putGridContent";

export type CheckboxGrid = {
  grid: CheckboxType;
} & CommonGridProps;
export const CheckboxGrid: FC<CheckboxGrid> = (props) => {
  const { grid, rowId } = props;
  const [checked, setChecked] = useState(grid.checked);
  const { tableId = "" } = useParams();

  return (
    <div
      onClick={() => {
        setChecked(!checked);
        putGridContent({
          type: grid.type,
          checked: !checked,
          gridId: grid._id,
          rowId,
          tableId,
        });
      }}
      className={`editable grid-checkbox ${checked ? "checked" : ""}`}
    >
      {checked && <IconCheck />}
    </div>
  );
};
