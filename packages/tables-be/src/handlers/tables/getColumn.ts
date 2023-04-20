import { IMiddleware } from "koa-router";

import {
  ReqGetColumn,
  ResCommon,
  ResGetColumn,
  ResGetColumnItem,
} from "@tables/types";

import { rows, tables } from "../../db";
import { checkToken } from "../../utils/checkToken";
import { TErrorTableReadPermission } from "../../utils/errors";

export const getColumn: IMiddleware = async (ctx) => {
  const userInfo = checkToken(ctx);
  const req = ctx.request.body as ReqGetColumn;
  const tableInfo = await tables.findOne({ _id: req.tableId });

  if (
    tableInfo.owner !== userInfo._id &&
    !tableInfo.collaborators.includes(userInfo._id)
  ) {
    throw new TErrorTableReadPermission();
  }
  const heads = tableInfo.heads;
  let beforeHeadId, head;
  for (let i = 0; i < heads.length; i++) {
    if (heads[i].isDeleted) continue;
    if (heads[i]._id === req.headId) {
      head = heads[i];
      break;
    }
    beforeHeadId = heads[i]._id;
  }

  const result = await rows
    .aggregate<ResGetColumnItem>([
      { $match: { _id: { $in: req.rowIds } } },
      { $unwind: "$data" },
      { $match: { "data.headId": req.headId } },
      { $project: { rowId: "$_id", grid: "$data" } },
    ])
    .toArray();

  const res: ResCommon<ResGetColumn> = {
    status: 200,
    msg: "ok",
    data: {
      data: result,
      head,
      beforeHeadId,
    },
  };

  ctx.body = res;
};
