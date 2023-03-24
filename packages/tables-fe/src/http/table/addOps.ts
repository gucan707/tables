import { nanoid } from "@reduxjs/toolkit";
import { TextOT } from "@tables/ot";
import { OperatorType, ReqAddOps } from "@tables/types";

import { OTController } from "../../utils/OTsController";
import { request } from "../request";
import { TABLE_BASE_URL } from "../url";

export async function addOps(
  gridId: string,
  tableId: string,
  gridVer: number,
  rowId: string
) {
  const ots = OTController.current.otInfo.filter(
    (ot) => !ot.hasSendToBe && ot.gridId === gridId
  );

  if (!ots.length) return;
  if (!ots[0].OT.ops.length) return;

  const initialOT = new TextOT();
  ots[0].OT.ops.forEach((op) => initialOT.addOp(op));
  // debugger;
  const composed = ots.reduce((pre, cur, curIndex) => {
    if (curIndex === 0) return pre;
    if (!cur.OT.ops.length) return pre;
    return pre.compose(cur.OT, TextOT);
  }, initialOT);

  const ADD_OPS_URL = `/${TABLE_BASE_URL}/${tableId}/addOps`;

  const ot: ReqAddOps = {
    basedVersion: gridVer,
    gridId,
    ops: composed.ops,
    rowId,
    feId: nanoid(),
  };

  await request<string, ReqAddOps>({
    url: ADD_OPS_URL,
    method: "POST",
    data: ot,
  });
}
