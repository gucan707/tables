import { ReqAddCollaborators, ResCommon } from "@tables/types";
import { IMiddleware } from "koa-router";
import { tables } from "../../db";
import { checkToken } from "../../utils/checkToken";
import { TErrorTablePermission } from "../../utils/errors";

export const addCollaborators: IMiddleware = async (ctx) => {
  const userInfo = checkToken(ctx);
  const req = ctx.request.body as ReqAddCollaborators;
  const tableInfo = await tables.findOne({ _id: req.tableId });
  if (tableInfo.owner !== userInfo._id) {
    throw new TErrorTablePermission();
  }

  await tables.updateOne(
    { _id: req.tableId },
    { $addToSet: { collaborators: { $each: req._ids } } }
  );

  const res: ResCommon = {
    status: 200,
    msg: "ok",
  };

  ctx.body = res;
};
