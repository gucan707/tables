import { IMiddleware } from "koa-router";
import { ObjectId } from "mongodb";

import {
  ChangeHeadTypeArgs,
  Events,
  ReqPutColumnType,
  ResCommon,
} from "@tables/types";

import { io } from "../..";
import { rows, tables } from "../../db";
import { checkToken } from "../../utils/checkToken";
import { createInitialGrid } from "../../utils/createInitialGrid";
import { createInitialHead } from "../../utils/createInitialHead";
import { TErrorTablePermission } from "../../utils/errors";

export const putColumnType: IMiddleware = async (ctx) => {
  const userInfo = checkToken(ctx);
  const req = ctx.request.body as ReqPutColumnType;
  const tableInfo = await tables.findOne({ _id: req.tableId });

  if (tableInfo.owner !== userInfo._id) {
    throw new TErrorTablePermission();
  }

  const head = tableInfo.heads.find((h) => h._id === req.headId);
  const headIndex = tableInfo.heads.findIndex((h) => h._id === req.headId);
  if (!head) return;

  const res: ResCommon<string> = {
    status: 200,
    msg: "ok",
    data: "ok",
  };

  if (head.type === req.type) {
    ctx.body = res;
    return;
  }

  const newHead = createInitialHead(new ObjectId().toHexString(), req.type);
  const allRows = await rows.find({ tableId: req.tableId }).toArray();

  const bulkUpdateOps = allRows.map((row) => {
    const _id = new ObjectId().toHexString();
    const newDataItem = {
      _id,
      ...createInitialGrid(_id, newHead.type, newHead._id),
    };

    return {
      updateOne: {
        filter: { _id: row._id },
        update: { $push: { data: newDataItem } },
      },
    };
  });

  await Promise.all([
    tables.updateOne(
      { _id: req.tableId, "heads._id": req.headId },
      { $set: { "heads.$.isDeleted": true } }
    ),
    tables.updateOne(
      { _id: req.tableId, "heads._id": req.headId },
      {
        $push: {
          heads: {
            $each: [newHead],
            $position: headIndex + 1,
          },
        },
      }
    ),
    rows.bulkWrite(bulkUpdateOps),
  ]);

  const newRows = await rows.find({ tableId: req.tableId }).toArray();

  const newGrids: Record<string, string> = {};

  newRows.forEach((r) => {
    const grid = r.data.find((g) => g.headId === newHead._id);
    if (!grid) return;
    newGrids[r._id] = grid._id;
  });

  io.to(req.tableId).emit(Events.ChangeHeadType, {
    oldHeadId: req.headId,
    head: newHead,
    newGrids,
  } as ChangeHeadTypeArgs);

  ctx.body = res;
};
