import { IMiddleware } from "koa-router";

import { ReqGetTables, ResCommon, ResGetTables, Table } from "@tables/types";

import { rows, tables } from "../../db";
import { checkToken } from "../../utils/checkToken";
import { TErrorPageError } from "../../utils/errors";

const LIMIT_TABLES = 24;
const LIMIT_ROWS = 3;

export const getTables: IMiddleware = async (ctx) => {
  const userInfo = checkToken(ctx);
  const req = ctx.request.query as { [K in keyof ReqGetTables]: string };
  if (isNaN(Number(req.page))) {
    throw new TErrorPageError();
  }
  const tablesCursor = tables.find({ owner: userInfo._id });
  const tablesRes = await tablesCursor
    .skip(Number(req.page) * LIMIT_TABLES)
    .limit(LIMIT_TABLES)
    .toArray();

  const tablesBrief: Table[] = [];
  tablesRes.forEach(async (table) => {
    const rowsCursor = rows.find({ tableId: table._id });
    const rowsRes = await rowsCursor.limit(LIMIT_ROWS).toArray();
    tablesBrief.push({ ...table, body: rowsRes });
  });

  const res: ResCommon<ResGetTables> = {
    status: 200,
    msg: "ok",
    data: tablesBrief,
  };

  ctx.body = res;
};
