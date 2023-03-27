import "./index.less";

import { FC, useState } from "react";

import { InputNumber } from "@arco-design/web-react";
import { NumberType } from "@tables/types";

import { CommonGridProps } from "../..";
import { changeActiveGridId } from "../../../../redux/activeGridSlice";
import { useAppDispatch } from "../../../../redux/store";
import { getFormattedNumber } from "../../../../utils/getFormattedNumber";

export type NumberGridProps = {
  grid: NumberType;
} & CommonGridProps;

export const NumberGrid: FC<NumberGridProps> = (props) => {
  const { grid, rowId, isActive } = props;
  const [num, setNum] = useState(grid.content);
  const [decimal, setDecimal] = useState(grid.decimal);
  const [percent, setPercent] = useState(grid.percent);
  const dispatch = useAppDispatch();

  const numStr = getFormattedNumber(num, decimal, percent);
  return isActive ? (
    <InputNumber
      className="number_grid"
      autoFocus
      hideControl
      defaultValue={numStr}
      onBlur={(e) => {
        setNum(Number(e.target.value));
        dispatch(changeActiveGridId(""));
      }}
    />
  ) : (
    <div>{numStr}</div>
  );
};
