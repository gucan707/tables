import "./index.less";

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
          className={`readonly grid-checkbox ${grid.checked ? "checked" : ""}`}
        >
          {grid.checked && <IconCheck />}
        </div>
      );
      break;
    case TableColumnTypes.Date:
      // TODO fomat
      content = <>{grid.date > 0 && dayjs(grid.date).format()}</>;
      break;
    case TableColumnTypes.MultiSelect:
      content = (
        <div className="readonly grid-tags">
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
        <div className="readonly grid-num">
          {/* TODO 使用 head 的 decimal */}
          {getFormattedNumber(grid.content, 0, 0)}
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

  return <td className="readonly grid grid_common">{content}</td>;
};
