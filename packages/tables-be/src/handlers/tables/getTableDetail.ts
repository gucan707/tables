import { IMiddleware } from "koa-router";

import {
  ReqGetTableDetail,
  ResCommon,
  ResGetTableDetail,
  Table,
} from "@tables/types";

import { tables } from "../../db";
import { checkToken } from "../../utils/checkToken";
import {
  TErrorTableIdNotFound,
  TErrorTableReadPermission,
} from "../../utils/errors";

const LIMIT_ROWS = 20;

export const getTableDetail: IMiddleware = async (ctx) => {
  const userInfo = checkToken(ctx);

  const req = ctx.params as ReqGetTableDetail;

  const result = await tables
    .aggregate<Table>([
      {
        $match: {
          _id: req.tableId,
        },
      },
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

  const tableDetail = result[0];

  if (!tableDetail) {
    throw new TErrorTableIdNotFound();
  }

  if (
    tableDetail.owner !== userInfo._id &&
    !tableDetail.collaborators.includes(userInfo._id)
  ) {
    throw new TErrorTableReadPermission();
  }

  // TODO 把 rows 里多余的东西也删掉
  tableDetail.heads = tableDetail.heads.filter((h) => !h.isDeleted);

  const res: ResCommon<ResGetTableDetail> = {
    status: 200,
    msg: "ok",
    data: tableDetail,
  };

  ctx.body = res;
};
