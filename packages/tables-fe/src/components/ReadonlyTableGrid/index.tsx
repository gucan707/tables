import "./index.less";

import dayjs from "dayjs";
import { FC } from "react";

import { Tag } from "@arco-design/web-react";
import { IconCheck } from "@arco-design/web-react/icon";
import {
  Grid,
  NumberFormatDecimal,
  NumberFormatPercent,
  SelectOptionType,
  TableColumnTypes,
  TableTagColors,
} from "@tables/types";

export type ReadonlyTableGridProps = {
  grid: Grid | undefined;
  tags: Map<string, SelectOptionType>;
};

export const ReadonlyTableGrid: FC<ReadonlyTableGridProps> = (props) => {
  const { grid, tags } = props;

  if (!grid) return <td></td>;

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
          {grid.checked && <IconCheck />}
        </div>
      );
      break;
    case TableColumnTypes.Date:
      content = <>{dayjs(grid.date).format(grid.format)}</>;
      break;
    case TableColumnTypes.MultiSelect:
      content = (
        <div>
          {grid.contents.map((tagId) => (
            <Tag
              key={tagId}
              closable
              color={tags.get(tagId)?.color || TableTagColors.Blue}
            >
              {tags.get(tagId)?.text || ""}
            </Tag>
          ))}
        </div>
      );
      break;
    case TableColumnTypes.Number:
      content = (
        <div className="readonly_grid-num">
          {getFormattedNumber(grid.content, grid.decimal, grid.percent)}
        </div>
      );
      break;
    case TableColumnTypes.Select:
      content = (
        <Tag
          closable
          color={tags.get(grid.content)?.color || TableTagColors.Blue}
        >
          {tags.get(grid.content)?.text || ""}
        </Tag>
      );
      break;
    default:
      content = <></>;
      break;
  }

  return <td className="readonly_grid grid_common">{content}</td>;
};

function getFormattedNumber(
  num: number,
  decimal: NumberFormatDecimal,
  percent: NumberFormatPercent
) {
  const n = percent === NumberFormatPercent.Percent ? num * 100 : num;
  let s = n.toFixed(decimal);
  return s + (percent === NumberFormatPercent.Percent ? "%" : "");
}
