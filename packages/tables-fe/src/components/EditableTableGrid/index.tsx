import dayjs from "dayjs";
import { FC } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Tag } from "@arco-design/web-react";
import { IconCheck } from "@arco-design/web-react/icon";
import {
  Grid,
  SelectOptionType,
  TableColumnTypes,
  TableTagColors,
} from "@tables/types";

import { changeActiveGridId } from "../../redux/activeGridSlice";
import { store, useAppDispatch, useAppSelector } from "../../redux/store";
// import { activeGridId } from "../../signal";
import { getFormattedNumber } from "../../utils/getFormattedNumber";
import { TextGrid } from "./components/TextGrid";

export type CommonGridProps = {
  isActive: boolean;
  rowId: string;
};

export type EditableTableGridProps = {
  grid: Grid | undefined;
  rowId: string;
  tags: Map<string, SelectOptionType>;
};
export const EditableTableGrid: FC<EditableTableGridProps> = (props) => {
  const { grid, tags, rowId } = props;
  const dispatch = useAppDispatch();
  const activeGridId = useAppSelector((state) => state.activeGrid).id;

  if (!grid) return <td></td>;

  let content: JSX.Element;
  switch (grid.type) {
    case TableColumnTypes.Text:
      content = (
        <TextGrid
          grid={grid}
          isActive={activeGridId === grid._id}
          rowId={rowId}
        />
      );
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

  return (
    <td
      className="editable grid grid_common"
      onClick={() => {
        dispatch(changeActiveGridId(grid._id));
      }}
    >
      {content}
    </td>
  );
};
