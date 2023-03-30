import "./index.less";

import dayjs from "dayjs";
import { FC, useState } from "react";

import { Select } from "@arco-design/web-react";
import { DateFormatOptions, DateHead } from "@tables/types";

const Option = Select.Option;

export type DateConfigProps = {
  curHead: DateHead;
};

export const DateConfig: FC<DateConfigProps> = (props) => {
  const { curHead } = props;
  const [format, setFormat] = useState(curHead.format);

  return (
    <div>
      <div className="date_config">
        请选择日期格式
        <Select
          className="date_config-select"
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
      <div className="date_config-example">例如：{dayjs().format(format)}</div>
    </div>
  );
};
