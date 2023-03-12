import { FC } from "react";

import { Tag } from "@arco-design/web-react";
import { IconCheck } from "@arco-design/web-react/icon";
import {
  DateFormatOptions,
  Grid,
  NumberFormatDecimal,
  NumberFormatPercent,
  TableColumnTypes,
} from "@tables/types";

export type ReadonlyTableGridProps = {
  grid: Grid | undefined;
};

export const ReadonlyTableGrid: FC<ReadonlyTableGridProps> = (props) => {
  const { grid } = props;
  console.log(19, { grid });

  if (!grid) return <td></td>;
  console.log({ grid });

  let content: JSX.Element;
  switch (grid.type) {
    case TableColumnTypes.Text:
      content = <>{grid.text}</>;
      break;
    case TableColumnTypes.Checkbox:
      content = (
        <div
          className={`readonly_grid-checkbox ${grid.checked ? "checked" : ""}`}
        >
          <IconCheck />
        </div>
      );
      break;
    case TableColumnTypes.Date:
      content = <>{getFormattedDate(grid.date, grid.format)}</>;
      break;
    case TableColumnTypes.MultiSelect:
      content = (
        <div>
          {grid.contents.map((item) => (
            <Tag key={item._id} closable color={item.color}>
              {item.text}
            </Tag>
          ))}
        </div>
      );
      break;
    case TableColumnTypes.Number:
      content = (
        <>{getFormattedNumber(grid.content, grid.decimal, grid.percent)}</>
      );
      break;
    case TableColumnTypes.Select:
      content = (
        <Tag closable color={grid.content.color}>
          {grid.content.text}
        </Tag>
      );
      break;
    default:
      content = <></>;
      break;
  }

  return <td className="readonly_grid">{content}</td>;
};

function getFormattedDate(time: number, format: DateFormatOptions) {
  const date = new Date(time);
  const year = date.getFullYear(),
    month = date.getMonth() + 1,
    day = date.getDay(),
    hour = date.getHours(),
    minute = date.getMinutes();

  switch (format) {
    case DateFormatOptions.MD:
      return `${month}/${day}`;
    case DateFormatOptions.MDT:
      return `${month}/${day} ${hour}:${minute}`;
    case DateFormatOptions.YMD:
      return `${year}/${month}/${day}`;
    case DateFormatOptions.YMDT:
      return `${year}/${month}/${day} ${hour}:${minute}`;
    default:
      return "";
  }
}

function getFormattedNumber(
  num: number,
  decimal: NumberFormatDecimal,
  percent: NumberFormatPercent
) {
  const n = percent === NumberFormatPercent.Percent ? num * 100 : num;
  let s = n.toFixed(decimal);
  return s + (percent === NumberFormatPercent.Percent ? "%" : "");
}
