import "./index.less";

import { FC, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { Select, Tag } from "@arco-design/web-react";
import { MultiSelectType, TableColumnTypes } from "@tables/types";

import { CommonGridProps } from "../..";
import { useAppSelector } from "../../../../redux/store";

export type MultiSelectGridProps = {
  grid: MultiSelectType;
} & CommonGridProps;
const Option = Select.Option;

export const MultiSelectGrid: FC<MultiSelectGridProps> = (props) => {
  const { grid, rowId } = props;
  const heads = useAppSelector((state) => state.headsReducer.heads);
  const head = heads.find((h) => h._id === grid.headId);
  const [curTagIds, setCurTagIds] = useState<string[]>(grid.contents);
  const { tableId = "" } = useParams();

  if (!head || head.type !== TableColumnTypes.MultiSelect) return null;

  return (
    <Select
      mode="multiple"
      renderTag={tagRender}
      className="multi_select_grid"
      arrowIcon={null}
      value={curTagIds}
      onChange={(val: string[]) => {
        setCurTagIds(val);
      }}
    >
      {head.tags.map((tag) => (
        <Option
          className="multi_select_grid-option"
          key={tag._id}
          value={tag._id}
        >
          <Tag color={tag.color}>{tag.text}</Tag>
        </Option>
      ))}
    </Select>
  );
};

export type TagRender = {
  label: React.ReactNode;
};

function tagRender(props: TagRender) {
  const { label } = props;

  return <div className="multi_select_grid-tag_render">{label}</div>;
}
