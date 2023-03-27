import "./index.less";

import { FC, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { InputNumber } from "@arco-design/web-react";
import { NumberType, TableColumnTypes } from "@tables/types";

import { CommonGridProps } from "../..";
import { putGridContent } from "../../../../http/table/putGridContent";
import { changeActiveGridId } from "../../../../redux/activeGridSlice";
import { useAppDispatch, useAppSelector } from "../../../../redux/store";
import { getFormattedNumber } from "../../../../utils/getFormattedNumber";

export type NumberGridProps = {
  grid: NumberType;
} & CommonGridProps;

export const NumberGrid: FC<NumberGridProps> = (props) => {
  const { grid, rowId, isActive } = props;
  const [num, setNum] = useState(grid.content);
  const [decimal, setDecimal] = useState(grid.decimal);
  const [percent, setPercent] = useState(grid.percent);
  const { tableId = "" } = useParams();
  const dispatch = useAppDispatch();
  const replacedContent = useAppSelector(
    (state) => state.shouldReplacedContent.shouldReplacedContent[grid._id]
  );

  useEffect(() => {
    if (!replacedContent) return;
    if (replacedContent.type !== TableColumnTypes.Number) {
      console.error(
        "CheckboxGrid: replacedContent.type !== TableColumnTypes.Number"
      );
      return;
    }
    setNum(replacedContent.content);
    setDecimal(replacedContent.decimal);
  }, [replacedContent]);

  const numStr = getFormattedNumber(num, decimal, percent);
  return isActive ? (
    <InputNumber
      className="number_grid"
      autoFocus
      hideControl
      defaultValue={numStr}
      onBlur={(e) => {
        setNum(Number(e.target.value));
        putGridContent({
          type: TableColumnTypes.Number,
          content: Number(e.target.value),
          decimal,
          percent,
          gridId: grid._id,
          rowId,
          tableId,
        });
        dispatch(changeActiveGridId(""));
      }}
    />
  ) : (
    <div>{numStr}</div>
  );
};
