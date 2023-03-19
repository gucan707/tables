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
