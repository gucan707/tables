import { FC, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { IconCheck } from "@arco-design/web-react/icon";
import { CheckboxType, TableColumnTypes } from "@tables/types";

import { CommonGridProps } from "../..";
import { putGridContent } from "../../../../http/table/putGridContent";
import { useAppSelector } from "../../../../redux/store";

export type CheckboxGrid = {
  grid: CheckboxType;
} & CommonGridProps;
export const CheckboxGrid: FC<CheckboxGrid> = (props) => {
  const { grid, rowId } = props;
  const [checked, setChecked] = useState(grid.checked);
  const { tableId = "" } = useParams();
  const replacedContent = useAppSelector(
    (state) => state.shouldReplacedContent.shouldReplacedContent[grid._id]
  );

  useEffect(() => {
    if (!replacedContent) return;
    if (replacedContent.type !== TableColumnTypes.Checkbox) {
      console.error(
        "CheckboxGrid: replacedContent.type !== TableColumnTypes.Checkbox"
      );
      return;
    }
    setChecked(replacedContent.checked);
  }, [replacedContent]);

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
