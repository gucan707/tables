import "./index.less";

import { FC, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

import { Select, Tag } from "@arco-design/web-react";
import { SelectHandle } from "@arco-design/web-react/es/Select/select";
import { SelectType, TableColumnTypes } from "@tables/types";

import { CommonGridProps } from "../..";
import { putGridContent } from "../../../../http/table/putGridContent";
import { useAppSelector } from "../../../../redux/store";

const Option = Select.Option;
export type SelectGridProps = {
  grid: SelectType;
} & CommonGridProps;

export const SelectGrid: FC<SelectGridProps> = (props) => {
  const { grid, rowId } = props;
  const heads = useAppSelector((state) => state.headsReducer.heads);
  const head = heads.find((h) => h._id === grid.headId);
  const selectRef = useRef<SelectHandle>(null);
  const [curTagId, setCurTagId] = useState<string>(grid.content);
  const { tableId = "" } = useParams();
  const shouldReplacedContent = useAppSelector(
    (state) => state.shouldReplacedContent.shouldReplacedContent[grid._id]
  );

  useEffect(() => {
    if (shouldReplacedContent?.type !== TableColumnTypes.Select) return;
    setCurTagId(shouldReplacedContent.content);
  }, [shouldReplacedContent]);

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
        putGridContent({
          type: TableColumnTypes.Select,
          content: val,
          gridId: grid._id,
          rowId,
          tableId,
        });
      }}
      onClear={() => {
        setCurTagId("");
        putGridContent({
          type: TableColumnTypes.Select,
          content: "",
          gridId: grid._id,
          rowId,
          tableId,
        });
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
