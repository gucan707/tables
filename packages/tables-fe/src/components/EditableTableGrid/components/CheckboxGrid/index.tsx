import { FC, useState } from "react";

import { IconCheck } from "@arco-design/web-react/icon";
import { CheckboxType } from "@tables/types";

import { CommonGridProps } from "../..";

export type CheckboxGrid = {
  grid: CheckboxType;
} & CommonGridProps;
export const CheckboxGrid: FC<CheckboxGrid> = (props) => {
  const { grid, rowId } = props;
  const [checked, setChecked] = useState(grid.checked);
  return (
    <div
      onClick={() => setChecked(!checked)}
      className={`editable grid-checkbox ${checked ? "checked" : ""}`}
    >
      {checked && <IconCheck />}
    </div>
  );
};
