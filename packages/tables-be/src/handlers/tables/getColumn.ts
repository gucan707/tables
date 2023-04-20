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
    data: result,
  };

  ctx.body = res;
};
