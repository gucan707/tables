import "./index.less";

import { FC, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

import { Select, Tag } from "@arco-design/web-react";
import { MultiSelectOT } from "@tables/ot";
import {
  MultiSelectOTData,
  MultiSelectType,
  Operator,
  OperatorType,
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

function diffTags(curTags: string[], ot: MultiSelectOT) {
  const tags1 = ot.baseData;
  const tags2: MultiSelectOTData[] = curTags.map((t) => ({ tagId: t }));

  if (JSON.stringify(tags1) === JSON.stringify(tags2)) return;
  ot.init();

  if (!tags1.length) {
    ot.addOp({ type: OperatorType.Insert, data: tags2 });
    return;
  }

  if (!tags2.length) {
    ot.addOp({ type: OperatorType.Delete, count: tags1.length });
    return;
  }

  let start1 = 0;
  for (; start1 < tags1.length; start1++) {
    if (tags1[start1].tagId !== tags2[start1].tagId) break;
  }
  start1--;

  let end1 = tags1.length - 1;
  let end2 = tags2.length - 1;
  for (; end1 > start1 && end2 > start1; end1--, end2--) {
    if (tags1[end1].tagId !== tags2[end2].tagId) break;
  }
  end1++;
  end2++;

  ot.addOp({ type: OperatorType.Retain, count: start1 + 1 });

  const deleteOp: Operator<MultiSelectOTData> = {
    type: OperatorType.Delete,
    count: end1 - start1 - 1,
  };

  const insertOp: Operator<MultiSelectOTData> = {
    type: OperatorType.Insert,
    data: tags2.slice(start1 + 1, end2),
  };

  if (end2 > end1) {
    ot.addOp(insertOp);
    if (end1 !== start1 + 1) {
      ot.addOp(deleteOp);
    }
  } else if (end2 < end1) {
    ot.addOp(deleteOp);
    if (end2 !== start1 + 1) {
      ot.addOp(insertOp);
    }
  } else {
    ot.addOp(deleteOp).addOp(insertOp);
  }

  ot.addOp({
    type: OperatorType.Retain,
    count: tags1.length - end1,
  });
}
