import { IMiddleware } from "koa-router";

import {
  Events,
  ReqPutTag,
  ResCommon,
  TableColumnTypes,
  UpdateTagArgs,
} from "@tables/types";

import { io } from "../..";
import { tables } from "../../db";
import { checkToken } from "../../utils/checkToken";
import {
  TErrorTableIdNotFound,
  TErrorTablePermission,
} from "../../utils/errors";

export const putTag: IMiddleware = async (ctx) => {
  const userInfo = checkToken(ctx);
  const req = ctx.request.body as ReqPutTag;
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

  const tag = head.tags.find((t) => t._id === req.tagId);

  if (!tag) return;

  await tables.updateOne(
    { _id: req.tableId },
    {
      $set: {
        "heads.$[element1].tags.$[element2].text": req.text,
        "heads.$[element1].tags.$[element2].color": req.color,
      },
    },
    {
      arrayFilters: [
        { "element1._id": req.headId },
        { "element2._id": req.tagId },
      ],
    }
  );

  const updateTagArgs: UpdateTagArgs = {
    color: req.color,
    headId: req.headId,
    tagId: req.tagId,
    text: req.text,
  };

  io.to(req.tableId).emit(Events.UpdateTag, updateTagArgs);

  const res: ResCommon<string> = {
    status: 200,
    msg: "ok",
    data: "ok",
  };

  ctx.body = res;
};
