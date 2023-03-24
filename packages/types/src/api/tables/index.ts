import { Operator } from "../../ot";
import { Table } from "../../tables";
import { UserToken } from "../../users";

export type ResCreateTable = Table;
export type ReqAddCollaborators = {
  /** 合作者id */
  _ids: string[];
  /** 表格id */
  tableId: string;
};

export type ReqGetTables = {
  page: number;
};

export type ResGetTables = Table[];

export type ReqGetTableDetail = {
  tableId: string;
};

export type ResGetTableDetail = Table;

export type ReqGetOnlineUsers = {
  tableId: string;
};

export type ResGetOnlineUsers = UserToken[];

// TODO 多选协同类型复用
export type ReqAddOps = {
  feId: string;
  tableId: string;
  rowId: string;
  gridId: string;
  basedVersion: number;
  ops: Operator<string>[];
};
