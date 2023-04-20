import { IMiddleware } from "koa-router";

import { DelColumnArgs, Events, ReqDelColumn, ResCommon } from "@tables/types";

import { io } from "../..";
import { tables } from "../../db";
import { checkToken } from "../../utils/checkToken";
import { TErrorTablePermission } from "../../utils/errors";

export const delColumn: IMiddleware = async (ctx) => {
  const userInfo = checkToken(ctx);
  const req = ctx.params as ReqDelColumn;
  const tableInfo = await tables.findOne({ _id: req.tableId });
  if (tableInfo.owner !== userInfo._id) {
    throw new TErrorTablePermission();
  }

  await delColumnFromDB(req.tableId, req.headId);

  io.to(req.tableId).emit(Events.DelColumn, {
    headId: req.headId,
  } as DelColumnArgs);

  const res: ResCommon<string> = {
    status: 200,
    msg: "ok",
    data: "ok",
  };

  ctx.body = res;
};

export function delColumnFromDB(tableId: string, headId: string) {
  return tables.updateOne(
    { _id: tableId },
    {
      $set: {
        "heads.$[element].isDeleted": true,
      },
    },
    {
      arrayFilters: [{ "element._id": headId }],
    }
  );
}
