import "./index.less";

import { FC, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

import { Select, Tag } from "@arco-design/web-react";
import { MultiSelectOT } from "@tables/ot";
import {
  MultiSelectType,
  TableColumnTypes,
  TableTagColors,
} from "@tables/types";

import { CommonGridProps } from "../..";
import { useAppSelector } from "../../../../redux/store";
import { getMapTags } from "../../../../utils/getMapTags";
import { OTReason, TagsOTController } from "../../../../utils/tagsOTController";

export type MultiSelectGridProps = {
  grid: MultiSelectType;
} & CommonGridProps;
const Option = Select.Option;

export const MultiSelectGrid: FC<MultiSelectGridProps> = (props) => {
  const { grid, rowId, isActive } = props;
  const heads = useAppSelector((state) => state.headsReducer.heads);
  const head = heads.find((h) => h._id === grid.headId);
  const [curTagIds, setCurTagIds] = useState<string[]>(grid.contents);
  const { tableId = "" } = useParams();
  const tagsOtRef = useRef<MultiSelectOT>();
  const tags = getMapTags(heads);

  if (!head || head.type !== TableColumnTypes.MultiSelect) return null;

  useEffect(() => {
    if (!isActive) return;
    const ids = grid.contents.map((c) => ({ tagId: c }));
    const ot = TagsOTController.current.createOT(grid._id, ids, OTReason.Init);
    tagsOtRef.current = ot.OT;
  }, [isActive]);

  useEffect(() => {
    grid.contents = curTagIds;
  }, [curTagIds]);

  return isActive ? (
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
  ) : (
    <div>
      {curTagIds.map((tagId) => (
        <Tag key={tagId} color={tags.get(tagId)?.color || TableTagColors.Blue}>
          {tags.get(tagId)?.text || ""}
        </Tag>
      ))}
    </div>
  );
};

export type TagRender = {
  label: React.ReactNode;
};

function tagRender(props: TagRender) {
  const { label } = props;

  return <div className="multi_select_grid-tag_render">{label}</div>;
}
