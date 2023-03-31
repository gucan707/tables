import { IMiddleware } from "koa-router";
import { ObjectId } from "mongodb";

import { OT1D, TextOT } from "@tables/ot";
import {
  Changes,
  Events,
  OperatorType,
  OpsEmitedFromBeArgs,
  OpsTypeEmitedFromBe,
  ReqAddOps,
  ResCommon,
  TableColumnTypes,
} from "@tables/types";

import { io } from "../..";
import { changes, rows, tables } from "../../db";
import { checkToken } from "../../utils/checkToken";
import {
  TError,
  TErrorCommon,
  TErrorTablePermission,
} from "../../utils/errors";
import { sleep } from "../../utils/sleep";

export const addOps: IMiddleware = async (ctx) => {
  await sleep(5000);
  const userInfo = checkToken(ctx);
  const req = ctx.request.body as ReqAddOps;
  const { tableId } = ctx.params;
  const tableInfo = await tables.findOne({ _id: tableId });
  if (
    tableInfo.owner !== userInfo._id &&
    !tableInfo.collaborators.includes(userInfo._id)
  ) {
    throw new TErrorTablePermission();
  }

  const row = await rows.findOne({ _id: req.rowId });
  const curGrid = row.data.find((grid) => grid._id === req.gridId);
  // TODO 文本以外的情况
  if (curGrid.type !== TableColumnTypes.Text) return;

  let resText: string;
  let emitedOT: TextOT;

  if (curGrid.version > req.basedVersion) {
    // req 基于版本低于当前后端版本时，compose 相差版本的 changes，transform 后再 apply 与 emit
    const gapChangesCursor = changes.find({
      gridId: req.gridId,
      oldVersion: { $gte: req.basedVersion },
    });
    const gapChanges = await gapChangesCursor.toArray();
    console.log({ gapChanges });

    const initialOT = new TextOT();
    gapChanges[0].ops.forEach((op) => initialOT.addOp(op));

    const composedChange = gapChanges.reduce((pre, cur, curIndex) => {
      if (curIndex === 0) return pre;
      const ot = new TextOT();
      cur.ops.forEach((op) => ot.addOp(op));
      return pre.compose(ot, TextOT);
    }, initialOT);

    const reqOt = new TextOT();
    req.ops.forEach((op) => reqOt.addOp(op));
    console.log({ composedChange, reqOt });
    const [_, reqPrime] = OT1D.transform(composedChange, reqOt, TextOT);
    try {
      resText = reqPrime.apply(curGrid.text);
    } catch (error) {
      throw new TErrorCommon();
    }
    emitedOT = reqPrime;
  } else {
    // req 基于版本正好是当前后端版本，直接 apply
    const reqOt = new TextOT();
    req.ops.forEach((op) => reqOt.addOp(op));
    try {
      resText = reqOt.apply(curGrid.text);
    } catch (error) {
      throw new TErrorCommon();
    }
    emitedOT = reqOt;
  }

  const newChange: Changes = {
    _id: new ObjectId().toString(),
    author: userInfo._id,
    gridId: curGrid._id,
    oldVersion: curGrid.version,
    newVersion: curGrid.version + 1,
    ops: emitedOT.ops,
    tableId,
    rowId: req.rowId,
    time: Date.now(),
  };

  const emitedOps: OpsEmitedFromBeArgs<string> = {
    type: OpsTypeEmitedFromBe.Text,
    ops: newChange.ops,
    oldVersion: newChange.oldVersion,
    gridId: newChange.gridId,
    rowId: newChange.rowId,
    tableId: tableId,
    author: newChange.author,
    feId: req.feId,
  };

  // console.log({ resText });

  io.to(tableId).emit(Events.OpsEmitedFromBe, emitedOps);

  await Promise.all([
    changes.insertOne(newChange),
    rows.updateOne(
      { _id: req.rowId },
      {
        $set: {
          "data.$[element].text": resText,
          "data.$[element].version": curGrid.version + 1,
        },
      },
      { arrayFilters: [{ "element._id": curGrid._id }] }
    ),
  ]);

  const res: ResCommon<string> = {
    status: 200,
    msg: "ok",
    data: "ok",
  };

  ctx.body = res;
};
