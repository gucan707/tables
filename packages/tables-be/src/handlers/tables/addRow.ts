import { IMiddleware } from "koa-router";

import { AddRowArgs, Events, ReqAddRow, ResCommon } from "@tables/types";

import { io } from "../..";
import { rows, tables } from "../../db";
import { checkToken } from "../../utils/checkToken";
import { TErrorTableReadPermission } from "../../utils/errors";
import { getInitialTableRow } from "../../utils/getInitialTableRow";

export const addRow: IMiddleware = async (ctx) => {
  const userInfo = checkToken(ctx);
  const req = ctx.params as ReqAddRow;
  const tableInfo = await tables.findOne({ _id: req.tableId });
  if (
    tableInfo.owner !== userInfo._id &&
    !tableInfo.collaborators.includes(userInfo._id)
  ) {
    throw new TErrorTableReadPermission();
  }

  const newRow = getInitialTableRow(req.tableId, tableInfo.heads);

  await rows.insertOne(newRow);

  io.to(req.tableId).emit(Events.AddRow, {
    createTime: Date.now(),
    row: newRow,
  } as AddRowArgs);

  const res: ResCommon<string> = {
    status: 200,
    msg: "ok",
    data: newRow._id,
  };

  ctx.body = res;
};
