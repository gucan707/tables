import { IMiddleware } from "koa-router";
import { ObjectId } from "mongodb";

import {
  DateFormatOptions,
  NumberFormatDecimal,
  NumberFormatPercent,
  ResCommon,
  ResCreateTable,
  Row,
  Table,
  TableColumnTypes,
  TableHead,
  TableHeads,
} from "@tables/types";

import { rows, tables } from "../../db";
import { checkToken } from "../../utils/checkToken";
import { createInitialGrid } from "../../utils/createInitialGrid";
import { createInitialHead } from "../../utils/createInitialHead";

const INIITIAL_ROW_NUM = 3;

export const createTable: IMiddleware = async (ctx) => {
  const userInfo = checkToken(ctx);

  const tableId = new ObjectId().toString();
  const initialTable = getInitialTable(userInfo._id, tableId);

  const initialRows: Row[] = [];
  for (let i = 0; i < INIITIAL_ROW_NUM; i++) {
    initialRows.push(getInitialTableRow(tableId, initialTable.heads));
  }

  await Promise.all([
    tables.insertOne(initialTable),
    rows.insertMany(initialRows),
  ]);

  const res: ResCommon<ResCreateTable> = {
    status: 200,
    data: { ...initialTable, rows: initialRows },
    msg: "ok",
  };

  ctx.body = res;
};

function getInitialTable(owner: string, tableId: string): Omit<Table, "rows"> {
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
    const _id = new ObjectId().toString();
    const head = createInitialHead(_id, value);

    head && heads.push(head);
  }

  return heads;
}

function getInitialTableRow(tableId: string, heads: TableHeads): Row {
  const row: Row = {
    _id: new ObjectId().toString(),
    data: [],
    tableId,
  };
  heads.forEach((head) => {
    const grid = createInitialGrid(
      new ObjectId().toString(),
      head.type,
      head._id
    );
    grid && row.data.push(grid);
  });
  return row;
}
