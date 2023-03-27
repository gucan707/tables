import { IMiddleware } from "koa-router";
import { UpdateFilter } from "mongodb";

import {
  Events,
  ReqPutGridContent,
  ResCommon,
  Row,
  TableColumnTypes,
} from "@tables/types";

import { io } from "../..";
import { rows, tables } from "../../db";
import { checkToken } from "../../utils/checkToken";
import { TErrorTablePermission } from "../../utils/errors";

export const putGridContent: IMiddleware = async (ctx) => {
  const req = ctx.request.body as ReqPutGridContent;
  const userInfo = checkToken(ctx);

  const tableInfo = await tables.findOne({ _id: req.tableId });
  if (
    tableInfo.owner !== userInfo._id &&
    !tableInfo.collaborators.includes(userInfo._id)
  ) {
    throw new TErrorTablePermission();
  }

  let update: UpdateFilter<Row> = {};

  switch (req.type) {
    case TableColumnTypes.Checkbox:
      update = {
        $set: {
          "data.$[element].checked": req.checked,
        },
      };
      break;
    case TableColumnTypes.Date:
      update = {
        $set: {
          "data.$[element].date": req.date,
          "data.$[element].format": req.format,
        },
      };
      break;
    case TableColumnTypes.Number:
      update = {
        $set: {
          "data.$[element].content": req.content,
          "data.$[element].decimal": req.decimal,
          "data.$[element].percent": req.percent,
        },
      };
      break;
    case TableColumnTypes.Select:
      update = {
        $set: {
          "data.$[element].content": req.content,
        },
      };
      break;
    default:
      break;
  }

  await rows.updateOne({ _id: req.rowId }, update, {
    arrayFilters: [{ "element._id": req.gridId }],
  });

  io.to(tableInfo._id).emit(Events.ReplaceGridContent, req);

  const res: ResCommon<string> = {
    status: 200,
    msg: "ok",
    data: "ok",
  };

  ctx.body = res;
};
