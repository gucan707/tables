import "./index.less";

import { FC, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { Input } from "@arco-design/web-react";
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
  const head = useAppSelector((state) => {
    const heads = state.headsReducer.heads;
    return heads.find((h) => h._id === grid.headId);
  });
  const [decimal, setDecimal] = useState(0);
  const { tableId = "" } = useParams();
  const dispatch = useAppDispatch();
  const replacedContent = useAppSelector(
    (state) => state.shouldReplacedContent.shouldReplacedContent[grid._id]
  );

  useEffect(() => {
    if (!head || head.type !== TableColumnTypes.Number) return;
    setDecimal(head.decimal);
  }, [head]);

  useEffect(() => {
    if (!replacedContent) return;
    if (replacedContent.type !== TableColumnTypes.Number) {
      console.error(
        "NumberGrid: replacedContent.type !== TableColumnTypes.Number"
      );
      return;
    }
    setNum(replacedContent.content);
  }, [replacedContent]);

  const numStr = getFormattedNumber(num, decimal, 0);
  return isActive ? (
    <Input
      type={"number"}
      className="number_grid"
      autoFocus
      defaultValue={numStr}
      onBlur={(e) => {
        setNum(Number(e.target.value));
        putGridContent({
          type: TableColumnTypes.Number,
          content: Number(e.target.value),
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
