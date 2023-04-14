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
    let head: TableHead;
    const _id = new ObjectId().toString();
    switch (value) {
      case TableColumnTypes.Text:
      case TableColumnTypes.Checkbox:
        head = {
          type: value,
          name: value,
          _id,
        };
        break;
      case TableColumnTypes.Date:
        head = {
          type: value,
          _id,
          name: value,
          format: DateFormatOptions.YMD,
        };
        break;
      case TableColumnTypes.MultiSelect:
      case TableColumnTypes.Select:
        head = {
          type: value,
          _id,
          name: value,
          tags: [],
        };
        break;
      case TableColumnTypes.Number:
        head = {
          type: value,
          _id,
          name: value,
          decimal: NumberFormatDecimal.None,
          percent: NumberFormatPercent.None,
        };
        break;
      default:
        break;
    }

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
    const common = {
      _id: new ObjectId().toString(),
      headId: head._id,
      version: 0,
    };
    switch (head.type) {
      case TableColumnTypes.Checkbox:
        row.data.push({
          ...common,
          checked: false,
          type: head.type,
        });
        break;
      case TableColumnTypes.Date:
        row.data.push({
          ...common,
          type: head.type,
          date: -1,
        });
        break;
      case TableColumnTypes.MultiSelect:
        row.data.push({
          type: head.type,
          contents: [],
          ...common,
        });
        break;
      case TableColumnTypes.Number:
        row.data.push({
          type: head.type,
          ...common,
          content: 0,
        });
        break;
      case TableColumnTypes.Select:
        row.data.push({
          type: head.type,
          ...common,
          content: "",
        });
        break;
      case TableColumnTypes.Text:
        row.data.push({
          type: head.type,
          ...common,
          text: "",
        });
      default:
        break;
    }
  });
  return row;
}
