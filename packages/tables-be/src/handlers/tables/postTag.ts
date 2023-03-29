import { IMiddleware } from "koa-router";
import { ObjectId } from "mongodb";

import { ReqPostTag, ResCommon, TableColumnTypes } from "@tables/types";

import { tables } from "../../db";
import { checkToken } from "../../utils/checkToken";
import {
  TErrorTableIdNotFound,
  TErrorTablePermission,
} from "../../utils/errors";

export const postTag: IMiddleware = async (ctx) => {
  const userInfo = checkToken(ctx);
  const req = ctx.request.body as ReqPostTag;

  const tableInfo = await tables.findOne({ _id: req.tableId });
  if (!tableInfo) {
    throw new TErrorTableIdNotFound();
  }

  if (tableInfo.owner !== userInfo._id) {
    throw new TErrorTablePermission();
  }

  const head = tableInfo.heads.find((h) => h._id === req.headId);
  if (!head) return;

  if (
    head.type !== TableColumnTypes.Select &&
    head.type !== TableColumnTypes.MultiSelect
  ) {
    return;
  }

  await tables.updateOne(
    { _id: req.tableId },
    {
      $addToSet: {
        "heads.$[elements].tags": {
          _id: new ObjectId().toString(),
          text: req.text,
          color: req.color,
        },
      },
    },
    {
      arrayFilters: [{ "elements._id": req.headId }],
    }
  );

  const res: ResCommon<string> = {
    status: 200,
    msg: "ok",
    data: "ok",
  };

  ctx.body = res;
};
