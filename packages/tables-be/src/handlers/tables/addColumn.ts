import { IMiddleware } from "koa-router";
import { ObjectId } from "mongodb";

import {
  AddColumnArgs,
  Events,
  ReqAddColumn,
  ResCommon,
  TableColumnTypes,
  TextHead,
  TextType,
} from "@tables/types";

import { io } from "../..";
import { rows, tables } from "../../db";
import { checkToken } from "../../utils/checkToken";
import { TErrorTablePermission } from "../../utils/errors";

export const addColumn: IMiddleware = async (ctx) => {
  const userInfo = checkToken(ctx);
  const req = ctx.params as ReqAddColumn;
  const tableInfo = await tables.findOne({ _id: req.tableId });
  if (tableInfo.owner !== userInfo._id) {
    throw new TErrorTablePermission();
  }

  const headId = new ObjectId().toHexString();

  const addedHead: TextHead = {
    _id: headId,
    type: TableColumnTypes.Text,
    name: TableColumnTypes.Text,
  };

  await Promise.all([
    tables.updateOne(
      { _id: req.tableId },
      {
        $addToSet: {
          heads: addedHead,
        },
      }
    ),
    rows
      .aggregate([
        { $match: { tableId: req.tableId } },
        {
          $addFields: {
            data: {
              $concatArrays: [
                "$data",
                [
                  {
                    _id: {
                      $toString: {
                        $function: {
                          body: "function() { return new ObjectId(); }",
                          lang: "js",
                          args: [],
                        },
                      },
                    },
                    text: "",
                    type: TableColumnTypes.Text,
                    headId,
                    version: 0,
                  },
                ],
              ],
            },
          },
        },
        { $out: "rows" },
      ])
      .toArray(),
  ]);

  const newRows = await rows.find({ tableId: req.tableId }).toArray();

  const added: Record<string, string> = {};

  newRows.forEach((row) => {
    added[row._id] = row.data[row.data.length - 1]._id;
  });

  io.to(req.tableId).emit(Events.AddColumn, {
    head: addedHead,
    added,
  } as AddColumnArgs);

  const res: ResCommon<string> = {
    status: 200,
    msg: "ok",
    data: headId,
  };

  ctx.body = res;
};
