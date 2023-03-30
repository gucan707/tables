import "./index.less";

import { FC, useEffect, useRef, useState } from "react";

import { Select, Tag } from "@arco-design/web-react";
import { SelectHandle } from "@arco-design/web-react/es/Select/select";
import { SelectType, TableColumnTypes } from "@tables/types";

import { useAppSelector } from "../../../../redux/store";

const Option = Select.Option;
export type SelectGridProps = {
  grid: SelectType;
};

export const SelectGrid: FC<SelectGridProps> = (props) => {
  const { grid } = props;
  const heads = useAppSelector((state) => state.headsReducer.heads);
  const head = heads.find((h) => h._id === grid.headId);
  const selectRef = useRef<SelectHandle>(null);
  const [curTagId, setCurTagId] = useState<string | undefined>(grid.content);
  if (!head || head.type !== TableColumnTypes.Select) return null;

  return (
    <Select
      allowClear
      renderTag={tagRender}
      className="select_grid"
      ref={selectRef}
      arrowIcon={null}
      value={curTagId}
      onChange={(val) => {
        setCurTagId(val);
      }}
    >
      {head.tags.map((tag) => (
        <Option className="select_grid-option" key={tag._id} value={tag._id}>
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

  return <div className="select_grid-tag_render">{label}</div>;
}
