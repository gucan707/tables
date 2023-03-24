import { Operator } from "../ot";

export type Changes = {
  _id: string;
  tableId: string;
  rowId: string;
  gridId: string;
  // TODO 多选类型
  ops: Operator<string>[];
  author: string;
  /** 修改应用前后的版本 */
  oldVersion: number;
  newVersion: number;
  time: number;
};
