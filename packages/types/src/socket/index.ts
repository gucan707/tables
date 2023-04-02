import { ReqPutGridContent, ReqPutHeadAttributes, ReqPutTag } from "../api";
import { Operator } from "../ot";
import { SelectOptionType, TableHead } from "../tables";

export enum Events {
  JoinRoom = "join room",
  EmitOnlineUsers = "emit online users",
  OpsEmitedFromBe = "ops emited from be",
  ReplaceGridContent = "replace grid content",
  PutHeadAttributes = "put head attributes",
  AddTag = "add tag",
  UpdateTag = "update tag",
  AddColumn = "add column",
}

export type ReqJoinRoom = {
  /** tableID */
  roomNumber: string;
  jwt: string;
};

export enum OpsTypeEmitedFromBe {
  Text,
  MultiSelect,
}

export type OpsEmitedFromBeArgs<T> = {
  type: OpsTypeEmitedFromBe;
  feId: string;
  ops: Operator<T>[];
  oldVersion: number;
  rowId: string;
  gridId: string;
  tableId: string;
  author: string;
};

export type ReplaceGridContentArgs = ReqPutGridContent;
export type PutHeadAttributesArgs = ReqPutHeadAttributes;
export type AddTagArgs = SelectOptionType;
export type UpdateTagArgs = Omit<ReqPutTag, "tableId">;
export type AddColumnArgs = TableHead;
