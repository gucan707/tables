import "./index.less";

import dayjs from "dayjs";
import { FC } from "react";

import { Tag } from "@arco-design/web-react";
import {
  Grid,
  OpsEmitedFromBeArgs,
  SelectOptionType,
  TableColumnTypes,
  TableTagColors,
} from "@tables/types";

import { changeActiveGridId } from "../../redux/activeGridSlice";
import { store, useAppDispatch, useAppSelector } from "../../redux/store";
// import { activeGridId } from "../../signal";
import { getFormattedNumber } from "../../utils/getFormattedNumber";
import { CheckboxGrid } from "./components/CheckboxGrid";
import { DateGrid } from "./components/DateGrid";
import { NumberGrid } from "./components/NumberGrid";
import { TextGrid } from "./components/TextGrid";

export type CommonGridProps = {
  isActive?: boolean;
  rowId: string;
  shouldAppliedOT?: OpsEmitedFromBeArgs<string>[];
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
  const shouldAppliedOT = useAppSelector((state) => state.shouldAppliedOT)
    .shouldAppliedOT[grid?._id ?? ""];

  if (!grid) return <td></td>;

  let content: JSX.Element;
  switch (grid.type) {
    case TableColumnTypes.Text:
      content = (
        <TextGrid
          grid={grid}
          isActive={activeGridId === grid._id}
          rowId={rowId}
          shouldAppliedOT={shouldAppliedOT}
        />
      );
      break;
    case TableColumnTypes.Checkbox:
      content = <CheckboxGrid grid={grid} rowId={rowId} />;
      break;
    case TableColumnTypes.Date:
      content = <DateGrid grid={grid} rowId={rowId} />;
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
        <NumberGrid
          grid={grid}
          rowId={rowId}
          isActive={activeGridId === grid._id}
        />
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
