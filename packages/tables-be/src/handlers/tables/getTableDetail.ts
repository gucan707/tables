import { IMiddleware } from "koa-router";
import { ObjectId } from "mongodb";

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

  const deletedIds: string[] = (
    await tables
      .aggregate([
        {
          $match: {
            _id: req.tableId,
          },
        },
        {
          $unwind: "$heads",
        },
        {
          $match: {
            "heads.isDeleted": true,
          },
        },
        {
          $project: {
            _id: 0,
            headId: "$heads._id",
          },
        },
      ])
      .toArray()
  ).map((i) => i.headId);

  const result = await tables
    .aggregate<Table>([
      {
        $match: {
          _id: req.tableId,
        },
      },
      {
        $addFields: {
          heads: {
            $filter: {
              input: "$heads",
              as: "head",
              cond: {
                $not: [{ $in: ["$$head._id", deletedIds] }],
              },
            },
          },
        },
      },
      {
        $lookup: {
          from: "rows",
          let: { table_id: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$tableId", "$$table_id"] },
                    { $ne: ["$isDeleted", true] },
                  ],
                },
              },
            },
            {
              $addFields: {
                data: {
                  $filter: {
                    input: "$data",
                    as: "item",
                    cond: {
                      $not: [{ $in: ["$$item.headId", deletedIds] }],
                    },
                  },
                },
              },
            },
            { $limit: LIMIT_ROWS },
          ],
          as: "rows",
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
  tableDetail.rows.forEach((r) => {
    r.createTime = new ObjectId(r._id).getTimestamp().valueOf();
  });

  const res: ResCommon<ResGetTableDetail> = {
    status: 200,
    msg: "ok",
    data: tableDetail,
  };

  ctx.body = res;
};
