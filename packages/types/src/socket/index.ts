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
  DelColumn = "del column",
  ChangeHeadType = "change head type",
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
export type AddColumnArgs = {
  added: Record<string, string>;
  head: TableHead;
};
export type DelColumnArgs = {
  headId: string;
};
export type ChangeHeadTypeArgs = {
  newGrids: Record<string, string>;
  head: TableHead;
};
