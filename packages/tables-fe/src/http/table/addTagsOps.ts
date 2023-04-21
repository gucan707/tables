import { nanoid } from "@reduxjs/toolkit";
import { MultiSelectOT } from "@tables/ot";
import { OperatorType, ReqAddTagsOps } from "@tables/types";

import { TagsOTController } from "../../utils/tagsOTController";
import { request } from "../request";
import { TABLE_BASE_URL } from "../url";

export async function addTagsOps(
  gridId: string,
  tableId: string,
  gridVer: number,
  rowId: string
) {
  const ots = TagsOTController.current.otInfo.filter(
    (ot) => !ot.hasSendToBe && ot.gridId === gridId
  );

  if (!ots.length) return;
  if (!ots[0].OT.ops.length) return;

  const initialOT = new MultiSelectOT();
  ots[0].OT.ops.forEach((op) => initialOT.addOp(op));
  // debugger;
  const composed = ots.reduce((pre, cur, curIndex) => {
    if (curIndex === 0) return pre;
    if (!cur.OT.ops.length) return pre;
    return pre.compose(cur.OT, MultiSelectOT);
  }, initialOT);

  const ADD_TAGS_OPS_URL = `/${TABLE_BASE_URL}/${tableId}/addTagsOps`;

  ots.forEach((ot) => (ot.hasSendToBe = true));
  console.log(TagsOTController.current);

  const ot: ReqAddTagsOps = {
    basedVersion: gridVer,
    gridId,
    tagsOps: composed.ops,
    rowId,
    feId: nanoid(),
  };

  if (!TagsOTController.unEmitedOT[gridId]) {
    TagsOTController.unEmitedOT[gridId] = [];
  }
  TagsOTController.unEmitedOT[gridId]!.push(ot);

  await request<string, ReqAddTagsOps>({
    url: ADD_TAGS_OPS_URL,
    method: "POST",
    data: ot,
  });
}
