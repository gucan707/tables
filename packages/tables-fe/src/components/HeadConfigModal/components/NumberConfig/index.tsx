import "./index.less";

import { FC, useRef, useState } from "react";
import { useParams } from "react-router-dom";

import { Button, Select } from "@arco-design/web-react";
import {
  NumberFormatDecimal,
  NumberHead,
  TableColumnTypes,
  UndoType,
} from "@tables/types";

import { putHeadAttributes } from "../../../../http/table/putHeadAttributes";
import { getFormattedNumber } from "../../../../utils/getFormattedNumber";
import { undoStack } from "../../../../utils/UndoStack";

export type NumberConfigProps = {
  curHead: NumberHead;
  closeModal: () => void;
};

export const NumberConfig: FC<NumberConfigProps> = (props) => {
  const { closeModal, curHead } = props;
  const format = [0, 1, 2] as NumberFormatDecimal[];
  const [decimal, setDecimal] = useState(curHead.decimal);
  const headRef = useRef(curHead);
  const { tableId = "" } = useParams();

  return (
    <div className="number_config">
      <div className="number_config-item">
        保留小数位数
        <Select
          placeholder="请选择保留小数位数"
          className="number_config-item-select"
          value={decimal}
          onChange={(v) => setDecimal(v)}
        >
          {format.map((option) => (
            <Select.Option key={option} value={option}>
              {option}
            </Select.Option>
          ))}
        </Select>
      </div>
      <div className="number_config-example">
        例如：{getFormattedNumber(123.45, decimal, curHead.percent)}
      </div>
      <div className="number_config-btns">
        <Button
          type="primary"
          onClick={async () => {
            await putHeadAttributes({
              type: TableColumnTypes.Number,
              decimal,
              headId: curHead._id,
              name: curHead.name,
              tableId,
              percent: curHead.percent,
            });

            undoStack.add({
              undoType: UndoType.HeadAttributes,
              ...headRef.current,
              headId: headRef.current._id,
              tableId,
            });
            headRef.current = {
              ...headRef.current,
              decimal,
            };
            closeModal();
          }}
        >
          确定
        </Button>
      </div>
    </div>
  );
};
