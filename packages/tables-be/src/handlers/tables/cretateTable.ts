import {
  ReqCreateTable,
  ResCommon,
  ResCreateTable,
  Row,
  Table,
  TableColumnTypes,
  TableHeads,
} from "@tables/types";
import { IMiddleware } from "koa-router";
import { ObjectId } from "mongodb";
import { tables } from "../../db";

export const createTable: IMiddleware = async (ctx) => {
  const req = ctx.request.body as ReqCreateTable;
  const tableId = new ObjectId().toString();
  const initialTable = getInitialTable(req.owner, tableId);
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
