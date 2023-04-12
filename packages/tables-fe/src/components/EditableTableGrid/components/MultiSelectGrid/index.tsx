import "./index.less";

import { FC, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

import { Select, Tag } from "@arco-design/web-react";
import { MultiSelectOT, OT1D } from "@tables/ot";
import {
  MultiSelectOTData,
  MultiSelectType,
  Operator,
  OperatorType,
  SelectOptionType,
  TableColumnTypes,
  TableTagColors,
} from "@tables/types";

import { CommonGridProps } from "../..";
import { addTagsOps } from "../../../../http/table/addTagsOps";
import { useUserInfo } from "../../../../http/user/useUserInfo";
import { changeActiveGridId } from "../../../../redux/activeGridSlice";
import { delTagsOT } from "../../../../redux/shouldAppliedOTSlice";
import { useAppDispatch, useAppSelector } from "../../../../redux/store";
import { getMapTags } from "../../../../utils/getMapTags";
import {
  multiSelectDataArrToStrArr,
  strArrToMultiSelectDataArr,
} from "../../../../utils/multiSelectDataTransform";
import { OTReason, TagsOTController } from "../../../../utils/tagsOTController";

export type MultiSelectGridProps = {
  grid: MultiSelectType;
} & CommonGridProps;
const Option = Select.Option;

export const MultiSelectGrid: FC<MultiSelectGridProps> = (props) => {
  const { grid, rowId, isActive } = props;
  const { userInfo } = useUserInfo();
  const heads = useAppSelector((state) => state.headsReducer.heads);
  const head = heads.find((h) => h._id === grid.headId);
  const versionRef = useRef<number>(grid.version);
  const [curTagIds, setCurTagIds] = useState<string[]>(grid.contents);
  const { tableId = "" } = useParams();
  const tagsOtRef = useRef<MultiSelectOT>();
  const tags = getMapTags(heads);
  const shouldAppliedTagsOt = useAppSelector(
    (state) => state.shouldAppliedOT.shouldAppliedTagsOt[grid?._id ?? ""]
  );
  const dispatch = useAppDispatch();

  const curTagIdsObj: MultiSelectOTData[] = curTagIds.map((id) => ({
    tagId: id,
  }));
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

  useEffect(() => {
    if (!shouldAppliedTagsOt || !shouldAppliedTagsOt.length || !userInfo)
      return;
    if (shouldAppliedTagsOt[0].oldVersion !== versionRef.current) return;

    let index = 1;
    while (index < shouldAppliedTagsOt.length) {
      if (
        shouldAppliedTagsOt[index].oldVersion ===
        shouldAppliedTagsOt[index - 1].oldVersion + 1
      ) {
        index++;
      } else {
        break;
      }
    }

    const ots = [...shouldAppliedTagsOt].splice(0, index);

    const unEmitedOT = TagsOTController.unEmitedOT[grid._id];
    console.log("shouldAppliedTagsOt", shouldAppliedTagsOt);
    ots.forEach((otInfo) => {
      const ot = OT1D.createOTByOps(otInfo.ops, MultiSelectOT);
      console.log("shouldAppliedTagsOt ot", ot);

      if (!ot) return;
      if (!unEmitedOT || !unEmitedOT.length) {
        // 本地没有对该格子进行修改，直接应用
        setCurTagIds((ids) => {
          const idObjs = strArrToMultiSelectDataArr(ids);
          const res = ot.apply(idObjs);
          return multiSelectDataArrToStrArr(res);
        });
        versionRef.current = otInfo.oldVersion + 1;
        return;
      }

      const exitedIndex = unEmitedOT.findIndex((o) => o.feId === otInfo.feId);
      if (exitedIndex !== -1) {
        // 收到了后端对该 OT 的广播，版本暂时与后端达成一致，直接 continue
        unEmitedOT.splice(exitedIndex, 1);
        versionRef.current = otInfo.oldVersion + 1;
        return;
      }

      // 是其他人的修改，需要与本地 unEmitedOT 依次 transform 后再 apply
      let transformedOt: MultiSelectOT = ot;
      unEmitedOT.forEach((o) => {
        const localOT = OT1D.createOTByOps(o.tagsOps, MultiSelectOT);
        if (!localOT) return;
        const [otPrime, _] = OT1D.transform(
          transformedOt,
          localOT,
          MultiSelectOT
        );
        transformedOt = otPrime;
      });

      setCurTagIds((ids) => {
        const idObjs = strArrToMultiSelectDataArr(ids);
        const res = transformedOt.apply(idObjs);
        return multiSelectDataArrToStrArr(res);
      });
      versionRef.current = otInfo.oldVersion + 1;
    });

    dispatch(
      delTagsOT({
        gridId: grid._id,
        index,
      })
    );
  }, [shouldAppliedTagsOt, userInfo, grid._id]);

  return isActive ? (
    <Select
      mode="multiple"
      renderTag={getTagRender(tags)}
      className="multi_select_grid"
      arrowIcon={null}
      value={[...new Set(curTagIds)]}
      onChange={(val: string[]) => {
        setCurTagIds(val);

        const ot = TagsOTController.current.createOT(
          grid._id,
          curTagIdsObj,
          val.length > curTagIds.length ? OTReason.Add : OTReason.Delete
        );
        tagsOtRef.current = ot.OT;

        tagsOtRef.current && diffTags(val, tagsOtRef.current);
      }}
      onBlur={() => {
        console.log("blur");
        dispatch(changeActiveGridId(""));
        addTagsOps(grid._id, tableId, versionRef.current, rowId);
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
    <div className="multi_select_grid-tags">
      {[...new Set(curTagIds)].map((tagId) => {
        return (
          <Tag
            key={tagId}
            color={tags.get(tagId)?.color || TableTagColors.Blue}
          >
            {tags.get(tagId)?.text || ""}
          </Tag>
        );
      })}
    </div>
  );
};

export type TagRender = {
  label: React.ReactNode;
  value: string;
};

function getTagRender(tags: Map<string, SelectOptionType>) {
  return (props: TagRender) => {
    const { label, value } = props;
    const tag = tags.get(value);
    if (!tag) return <></>;
    return (
      <Tag key={tag._id} color={tag.color}>
        {tag.text}
      </Tag>
    );
  };
}

export function diffTags(curTags: string[], ot: MultiSelectOT) {
  // debugger;
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
  for (; start1 < tags1.length && start1 < tags2.length; start1++) {
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
