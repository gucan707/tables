import "./index.less";

import dayjs from "dayjs";
import { FC, useRef, useState } from "react";
import { useParams } from "react-router-dom";

import { Button, Select } from "@arco-design/web-react";
import {
  DateFormatOptions,
  DateHead,
  TableColumnTypes,
  UndoType,
} from "@tables/types";

import { putHeadAttributes } from "../../../../http/table/putHeadAttributes";
import { undoStack } from "../../../../utils/UndoStack";

const Option = Select.Option;

export type DateConfigProps = {
  curHead: DateHead;
  closeModal: () => void;
};

export const DateConfig: FC<DateConfigProps> = (props) => {
  const { curHead, closeModal } = props;
  const [format, setFormat] = useState(curHead.format);
  const { tableId = "" } = useParams();
  const headRef = useRef(curHead);

  return (
    <div className="date_config">
      <div className="date_config-content">
        请选择日期格式
        <Select
          className="date_config-content-select"
          placeholder="Please select"
          value={format}
          onChange={(val) => setFormat(val)}
        >
          {Object.values(DateFormatOptions).map((option, index) => (
            <Option key={option} value={option}>
              {option}
            </Option>
          ))}
        </Select>
      </div>
      <div className="date_config-content-example">
        例如：{dayjs().format(format)}
      </div>
      <div className="date_config-content-btns">
        <Button
          type="primary"
          onClick={async () => {
            await putHeadAttributes({
              type: TableColumnTypes.Date,
              format,
              headId: curHead._id,
              name: curHead.name,
              tableId,
            });

            undoStack.add({
              undoType: UndoType.HeadAttributes,
              ...headRef.current,
              headId: headRef.current._id,
              tableId,
            });

            headRef.current = { ...headRef.current, format };
            closeModal();
          }}
        >
          确定
        </Button>
      </div>
    </div>
  );
};
