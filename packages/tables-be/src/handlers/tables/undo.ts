import { IMiddleware } from "koa-router";

import {
  DelColumnArgs,
  Events,
  ReqUndo,
  ResCommon,
  ToGetColumnArgs,
  UndoType,
} from "@tables/types";

import { io } from "../..";
import { tables } from "../../db";
import { checkToken } from "../../utils/checkToken";
import { TErrorTablePermission } from "../../utils/errors";
import { delColumnFromDB } from "./delColumn";

export const undo: IMiddleware = async (ctx) => {
  const userInfo = checkToken(ctx);
  const req = ctx.request.body as ReqUndo;
  const tableInfo = await tables.findOne({ _id: req.tableId });
  if (
    tableInfo.owner !== userInfo._id &&
    !tableInfo.collaborators.includes(userInfo._id)
  ) {
    console.error("undo: 权限错误，需检查 undo stack");
    throw new TErrorTablePermission();
  }

  if (
    tableInfo.owner !== userInfo._id &&
    (req.type === UndoType.Column || req.type === UndoType.ColumnType)
  ) {
    console.error("undo: 权限错误，需检查 undo stack");
    throw new TErrorTablePermission();
  }

  await undoByType(req);

  const res: ResCommon<string> = {
    status: 200,
    msg: "ok",
    data: "ok",
  };

  ctx.body = res;
};

export async function undoByType(req: ReqUndo) {
  switch (req.type) {
    case UndoType.Column:
      if (req.isDelete) {
        // 需要删除一列
        await delColumnFromDB(req.tableId, req.headId);
        io.to(req.tableId).emit(Events.DelColumn, {
          headId: req.headId,
        } as DelColumnArgs);
      } else {
        // 需要撤销‘删除一列’
        await tables.updateOne(
          { _id: req.tableId, "heads._id": req.headId },
          { $set: { "heads.$.isDeleted": false } }
        );
        io.to(req.tableId).emit(Events.ToGetColumn, {
          headId: req.headId,
        } as ToGetColumnArgs);
      }
  }
}
