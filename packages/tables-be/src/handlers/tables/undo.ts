import { IMiddleware } from "koa-router";
import { ObjectId } from "mongodb";

import {
  AddRowArgs,
  DelColumnArgs,
  DelRowArgs,
  Events,
  ReplaceColumnArgs,
  ReqUndo,
  ResCommon,
  ToGetColumnArgs,
  UndoType,
} from "@tables/types";

import { io } from "../..";
import { rows, tables } from "../../db";
import { checkToken } from "../../utils/checkToken";
import { TErrorTablePermission } from "../../utils/errors";
import { delColumnFromDB } from "./delColumn";
import { delRowFromDB } from "./deleteRow";
import { putHeadAttributesFromDB } from "./putHeadAttributes";

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
    (req.undoType === UndoType.Column || req.undoType === UndoType.ColumnType)
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
  switch (req.undoType) {
    case UndoType.Column:
      if (req.isDelete) {
        // 需要撤销‘新增一列’，也就是需要删除一列
        await delColumnFromDB(req.tableId, req.headId);
        io.to(req.tableId).emit(Events.DelColumn, {
          headId: req.headId,
        } as DelColumnArgs);
      } else {
        // 需要撤销‘删除一列’，也就是把被删除的一列还原
        await tables.updateOne(
          { _id: req.tableId, "heads._id": req.headId },
          { $set: { "heads.$.isDeleted": false } }
        );
        io.to(req.tableId).emit(Events.ToGetColumn, {
          headId: req.headId,
        } as ToGetColumnArgs);
      }
      break;
    case UndoType.ColumnType:
      await Promise.all([
        tables.updateOne(
          { _id: req.tableId, "heads._id": req.shouldDeleteHead },
          { $set: { "heads.$.isDeleted": true } }
        ),
        tables.updateOne(
          { _id: req.tableId, "heads._id": req.shouldRestoreHead },
          { $set: { "heads.$.isDeleted": false } }
        ),
      ]);
      io.to(req.tableId).emit(Events.ReplaceColumn, {
        curHeadId: req.shouldRestoreHead,
        oldHeadId: req.shouldDeleteHead,
      } as ReplaceColumnArgs);
      break;
    case UndoType.HeadAttributes:
      await putHeadAttributesFromDB(req);
      io.to(req.tableId).emit(Events.PutHeadAttributes, req);
      break;
    case UndoType.Row:
      if (req.isDeleted) {
        await delRowFromDB(req.rowId);
        io.to(req.tableId).emit(Events.DelRow, {
          rowId: req.rowId,
        } as DelRowArgs);
      } else {
        await rows.updateOne(
          { _id: req.rowId },
          { $set: { isDeleted: false } }
        );
        const row = await rows.findOne({ _id: req.rowId });
        io.to(req.tableId).emit(Events.AddRow, {
          row,
          createTime: new ObjectId(row._id).getTimestamp().valueOf(),
        } as AddRowArgs);
      }
      break;
  }
}
