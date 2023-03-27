import "./index.less";

import { FC, useState } from "react";

import { DatePicker } from "@arco-design/web-react";
import { DateType } from "@tables/types";

export type DateGridProps = {
  grid: DateType;
  rowId: string;
};

export const DateGrid: FC<DateGridProps> = (props) => {
  const { grid } = props;
  const [date, setDate] = useState(grid.date);
  const [format, setFormat] = useState(grid.format);

  return (
    <DatePicker
      className="date_grid"
      showTime
      format={format}
      value={date === -1 ? undefined : date}
      onChange={(_, date) => {
        if (!date) return;
        setDate(date.valueOf());
      }}
      onClear={() => {
        setDate(-1);
      }}
    />
  );
};
