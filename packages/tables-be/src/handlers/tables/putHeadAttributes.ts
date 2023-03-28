import { IMiddleware } from "koa-router";
import { UpdateFilter } from "mongodb";

import {
  Events,
  ReqPutHeadAttributes,
  ResCommon,
  Table,
  TableColumnTypes,
} from "@tables/types";

import { io } from "../..";
import { tables } from "../../db";
import { checkToken } from "../../utils/checkToken";
import {
  TErrorTableIdNotFound,
  TErrorTablePermission,
} from "../../utils/errors";

export const putHeadAttributes: IMiddleware = async (ctx) => {
  const userInfo = checkToken(ctx);
  const req = ctx.request.body as ReqPutHeadAttributes;
  const tableInfo = await tables.findOne({ _id: req.tableId });

  if (!tableInfo) {
    throw new TErrorTableIdNotFound();
  }
  if (userInfo._id !== tableInfo.owner) {
    throw new TErrorTablePermission();
  }

  const head = tableInfo.heads.find((head) => head._id === req.headId);

  if (req.type !== head.type) {
    console.error("修改类型接口错误");
    return;
  }

  let update: UpdateFilter<Omit<Table, "rows">> = {};

  switch (req.type) {
    case TableColumnTypes.Checkbox:
    case TableColumnTypes.MultiSelect:
    case TableColumnTypes.Select:
    case TableColumnTypes.Text:
      update = {
        $set: {
          "heads.$[element].name": req.name,
        },
      };
      break;
    case TableColumnTypes.Date:
      update = {
        $set: {
          "heads.$[element].name": req.name,
          "heads.$[element].format": req.format,
        },
      };
      break;
    case TableColumnTypes.Number:
      update = {
        $set: {
          "heads.$[element].name": req.name,
          "heads.$[element].decimal": req.decimal,
          "heads.$[element].percent": req.percent,
        },
      };
      break;
    default:
      break;
  }

  await tables.updateOne({ _id: req.tableId }, update, {
    arrayFilters: [{ "element._id": req.headId }],
  });

  io.to(tableInfo._id).emit(Events.PutHeadAttributes, req);

  const res: ResCommon<string> = {
    status: 200,
    msg: "ok",
    data: "ok",
  };

  ctx.body = res;
};
