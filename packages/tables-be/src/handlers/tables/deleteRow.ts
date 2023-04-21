import { IMiddleware } from "koa-router";

import { DelRowArgs, Events, ReqDeleteRow, ResCommon } from "@tables/types";

import { io } from "../..";
import { rows, tables } from "../../db";
import { checkToken } from "../../utils/checkToken";
import { TErrorTableReadPermission } from "../../utils/errors";

export const deleteRow: IMiddleware = async (ctx) => {
  const userInfo = checkToken(ctx);
  const req = ctx.params as ReqDeleteRow;

  const tableInfo = await tables.findOne({ _id: req.tableId });
  if (
    tableInfo.owner !== userInfo._id &&
    !tableInfo.collaborators.includes(userInfo._id)
  ) {
    throw new TErrorTableReadPermission();
  }

  await delRowFromDB(req.rowId);

  io.to(req.tableId).emit(Events.DelRow, { rowId: req.rowId } as DelRowArgs);

  const res: ResCommon<string> = {
    status: 200,
    msg: "ok",
    data: "ok",
  };

  ctx.body = res;
};

export function delRowFromDB(rowId: string) {
  return rows.updateOne(
    { _id: rowId },
    {
      $set: {
        isDeleted: true,
      },
    }
  );
}
