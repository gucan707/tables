import { IMiddleware } from "koa-router";

import {
  ChangeHeadTypeArgs,
  Events,
  ReqPutColumnType,
  ResCommon,
} from "@tables/types";

import { io } from "../..";
import { rows, tables } from "../../db";
import { checkToken } from "../../utils/checkToken";
import { createInitialGrid } from "../../utils/createInitialGrid";
import { createInitialHead } from "../../utils/createInitialHead";
import { TErrorTablePermission } from "../../utils/errors";

export const putColumnType: IMiddleware = async (ctx) => {
  const userInfo = checkToken(ctx);
  const req = ctx.request.body as ReqPutColumnType;
  const tableInfo = await tables.findOne({ _id: req.tableId });

  if (tableInfo.owner !== userInfo._id) {
    throw new TErrorTablePermission();
  }

  const head = tableInfo.heads.find((h) => h._id === req.headId);
  if (!head) return;

  const newHead = createInitialHead(req.headId, req.type);

  if (head.type !== req.type) {
    await Promise.all([
      tables.updateOne(
        { _id: req.tableId },
        {
          $set: {
            "heads.$[element]": newHead,
          },
        },
        {
          arrayFilters: [{ "element._id": req.headId }],
        }
      ),
      rows.updateMany({ tableId: req.tableId }, [
        {
          $set: {
            data: {
              $map: {
                input: "$data",
                as: "elem",
                in: {
                  $cond: [
                    { $eq: ["$$elem.headId", req.headId] },
                    {
                      ...createInitialGrid("", req.type, req.headId),
                      _id: {
                        $toString: {
                          $function: {
                            body: "function() { return new ObjectId(); }",
                            lang: "js",
                            args: [],
                          },
                        },
                      },
                      version: 0,
                    },
                    "$$elem",
                  ],
                },
              },
            },
          },
        },
      ]),
    ]);
  }

  const newRows = await rows.find({ tableId: req.tableId }).toArray();

  const newGrids: Record<string, string> = {};

  newRows.forEach((r) => {
    const grid = r.data.find((g) => g.headId === req.headId);
    if (!grid) return;
    newGrids[r._id] = grid._id;
  });

  io.to(req.tableId).emit(Events.ChangeHeadType, {
    head: newHead,
    newGrids,
  } as ChangeHeadTypeArgs);

  const res: ResCommon<string> = {
    status: 200,
    msg: "ok",
    data: "ok",
  };

  ctx.body = res;
};
