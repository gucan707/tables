import { IMiddleware } from "koa-router";
import { ObjectId } from "mongodb";

import { MultiSelectOT, OT1D } from "@tables/ot";
import {
  Changes,
  Events,
  MultiSelectOTData,
  OpsEmitedFromBeArgs,
  ReqAddTagsOps,
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

export const addTagsOps: IMiddleware = async (ctx) => {
  // await sleep(5000);
  const userInfo = checkToken(ctx);
  const req = ctx.request.body as ReqAddTagsOps;
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

  if (curGrid.type !== TableColumnTypes.MultiSelect) return;
  const curTags: MultiSelectOTData[] = curGrid.contents.map((c) => ({
    tagId: c,
  }));

  let result: MultiSelectOTData[];
  let emitedOT: MultiSelectOT;

  if (curGrid.version > req.basedVersion) {
    // req 基于版本低于当前后端版本时，compose 相差版本的 changes，transform 后再 apply 与 emit
    const gapChangesCursor = changes.find({
      gridId: req.gridId,
      oldVersion: { $gte: req.basedVersion },
    });
    const gapChanges = await gapChangesCursor.toArray();
    console.log({ gapChanges });

    const initialOT = new MultiSelectOT();
    gapChanges[0].tagsOps.forEach((op) => initialOT.addOp(op));

    const composedChange = gapChanges.reduce((pre, cur, curIndex) => {
      if (curIndex === 0) return pre;
      const ot = new MultiSelectOT();
      cur.tagsOps.forEach((op) => ot.addOp(op));
      return pre.compose(ot, MultiSelectOT);
    }, initialOT);

    const reqOt = new MultiSelectOT();
    req.tagsOps.forEach((op) => reqOt.addOp(op));
    console.log({ composedChange, reqOt });
    const [_, reqPrime] = OT1D.transform(composedChange, reqOt, MultiSelectOT);
    try {
      console.log("try reqPrime.apply(curTags)");
      result = reqPrime.apply(curTags);
    } catch (error) {
      console.error(error);
      throw new TErrorCommon();
    }
    emitedOT = reqPrime;
  } else {
    // req 基于版本正好是当前后端版本，直接 apply
    const reqOt = new MultiSelectOT();
    req.tagsOps.forEach((op) => reqOt.addOp(op));
    try {
      console.log("try reqOt.apply(curTags)");
      result = reqOt.apply(curTags);
    } catch (error) {
      console.error(error);
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
    tagsOps: emitedOT.ops,
    tableId,
    rowId: req.rowId,
    time: Date.now(),
  };

  const emitedOps: OpsEmitedFromBeArgs<MultiSelectOTData> = {
    ops: newChange.tagsOps,
    oldVersion: newChange.oldVersion,
    gridId: newChange.gridId,
    rowId: newChange.rowId,
    tableId: tableId,
    author: newChange.author,
    feId: req.feId,
  };

  // console.log({ resText });

  io.to(tableId).emit(Events.OpsEmitedFromBe, emitedOps);

  const strArrResult = result.map((r) => r.tagId);
  await Promise.all([
    changes.insertOne(newChange),
    rows.updateOne(
      { _id: req.rowId },
      {
        $set: {
          "data.$[element].contents": strArrResult,
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
