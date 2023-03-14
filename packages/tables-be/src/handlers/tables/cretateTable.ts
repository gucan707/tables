import { IMiddleware } from "koa-router";
import { ObjectId } from "mongodb";

import {
  ResCommon,
  ResCreateTable,
  Row,
  Table,
  TableColumnTypes,
  TableHeads,
} from "@tables/types";

import { tables } from "../../db";
import { checkToken } from "../../utils/checkToken";

export const createTable: IMiddleware = async (ctx) => {
  const userInfo = checkToken(ctx);

  const tableId = new ObjectId().toString();
  const initialTable = getInitialTable(userInfo._id, tableId);
  await tables.insertOne(initialTable);

  const res: ResCommon<ResCreateTable> = {
    status: 200,
    data: { ...initialTable, body: [] },
    msg: "ok",
  };

  ctx.body = res;
};

function getInitialTable(owner: string, tableId: string): Omit<Table, "body"> {
  return {
    title: "Untitled",
    owner,
    _id: tableId,
    collaborators: [],
    heads: getInitialTableHeads(),
  };
}

function getInitialTableHeads(): TableHeads {
  const heads: TableHeads = [];
  for (let i in TableColumnTypes) {
    const value = TableColumnTypes[i as keyof typeof TableColumnTypes];
    heads.push({
      _id: new ObjectId().toString(),
      name: value,
      type: value,
    });
  }

  return heads;
}

// const INIITIAL_ROW_NUM = 5;

// function getInitialTableBody(tableId: string): Row[] {
//   return Array.from<Row>({ length: INIITIAL_ROW_NUM }).map(() => {
//     return {
//       tableId,
//       data: [],
//     };
//   });
// }
