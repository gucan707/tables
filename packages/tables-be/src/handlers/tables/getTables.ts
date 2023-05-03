import { IMiddleware } from 'koa-router';
import { ObjectId } from 'mongodb';

import { ReqGetTables, ResCommon, ResGetTables, Table } from '@tables/types';

import { rows, tables, users } from '../../db';
import { checkToken } from '../../utils/checkToken';
import { TErrorPageError } from '../../utils/errors';

const LIMIT_TABLES = 24;
const LIMIT_ROWS = 3;

export const getTables: IMiddleware = async (ctx) => {
  const userInfo = checkToken(ctx);

  const req = ctx.request.query as { [K in keyof ReqGetTables]: string };
  if (isNaN(Number(req.page))) {
    throw new TErrorPageError();
  }

  const result = await tables
    .aggregate<Table>([
      {
        $match: {
          owner: userInfo._id,
        },
      },
      { $skip: Number(req.page) * LIMIT_TABLES },
      { $limit: LIMIT_TABLES },
      {
        $lookup: {
          from: "rows",
          localField: "_id",
          foreignField: "tableId",
          as: "rows",
          pipeline: [{ $limit: LIMIT_ROWS }],
        },
      },
    ])
    .toArray();

  result.forEach((r) => {
    r.createTime = new ObjectId(r._id).getTimestamp().valueOf();
  });

  const res: ResCommon<ResGetTables> = {
    status: 200,
    msg: "ok",
    data: result || [],
  };

  ctx.body = res;
};
