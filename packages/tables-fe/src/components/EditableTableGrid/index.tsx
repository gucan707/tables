import dayjs from "dayjs";
import { FC } from "react";

import { Tag } from "@arco-design/web-react";
import { IconCheck } from "@arco-design/web-react/icon";
import {
  Grid,
  SelectOptionType,
  TableColumnTypes,
  TableTagColors,
} from "@tables/types";

import { getFormattedNumber } from "../../utils/getFormattedNumber";

export type EditableTableGridProps = {
  grid: Grid | undefined;
  tags: Map<string, SelectOptionType>;
};

export const EditableTableGrid: FC<EditableTableGridProps> = (props) => {
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
          className={`editable grid-checkbox ${grid.checked ? "checked" : ""}`}
        >
          {grid.checked && <IconCheck />}
        </div>
      );
      break;
    case TableColumnTypes.Date:
      content = <>{grid.date > 0 && dayjs(grid.date).format(grid.format)}</>;
      break;
    case TableColumnTypes.MultiSelect:
      content = (
        <div className="editable grid-tags">
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
        <div className="editable grid-num">
          {getFormattedNumber(grid.content, grid.decimal, grid.percent)}
        </div>
      );
      break;
    case TableColumnTypes.Select:
      content = tags.get(grid.content) ? (
        <Tag
          closable
          color={tags.get(grid.content)?.color || TableTagColors.Blue}
        >
          {tags.get(grid.content)?.text || ""}
        </Tag>
      ) : (
        <></>
      );
      break;
    default:
      content = <></>;
      break;
  }

  return <td className="editable grid grid_common">{content}</td>;
};
