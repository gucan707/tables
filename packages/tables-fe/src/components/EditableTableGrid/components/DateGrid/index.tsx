import "./index.less";

import { FC, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { DatePicker } from "@arco-design/web-react";
import { DateType, TableColumnTypes } from "@tables/types";

import { putGridContent } from "../../../../http/table/putGridContent";
import { useAppSelector } from "../../../../redux/store";

export type DateGridProps = {
  grid: DateType;
  rowId: string;
};

export const DateGrid: FC<DateGridProps> = (props) => {
  const { grid, rowId } = props;
  const { tableId = "" } = useParams();
  const [date, setDate] = useState(grid.date);
  const [format, setFormat] = useState(grid.format);
  const replacedContent = useAppSelector(
    (state) => state.shouldReplacedContent.shouldReplacedContent[grid._id]
  );

  useEffect(() => {
    if (!replacedContent) return;
    if (replacedContent.type !== TableColumnTypes.Date) {
      console.error(
        "CheckboxGrid: replacedContent.type !== TableColumnTypes.Checkbox"
      );
      return;
    }
    setDate(replacedContent.date);
    setFormat(replacedContent.format);
  }, [replacedContent]);

  return (
    <DatePicker
      className="date_grid"
      showTime
      format={format}
      value={date === -1 ? undefined : date}
      onChange={(_, datejs) => {
        const milliseconds = datejs ? datejs.valueOf() : -1;
        setDate(milliseconds);
        putGridContent({
          type: TableColumnTypes.Date,
          date: milliseconds,
          format,
          gridId: grid._id,
          rowId,
          tableId,
        });
      }}
    />
  );
};
