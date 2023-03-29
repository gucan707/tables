import { ReqPutGridContent, ReqPutHeadAttributes } from "../api";
import { Operator } from "../ot";
import { SelectOptionType } from "../tables";

export enum Events {
  JoinRoom = "join room",
  EmitOnlineUsers = "emit online users",
  OpsEmitedFromBe = "ops emited from be",
  ReplaceGridContent = "replace grid content",
  PutHeadAttributes = "put head attributes",
  AddTag = "add tag",
}

export type ReqJoinRoom = {
  /** tableID */
  roomNumber: string;
  jwt: string;
};

export type OpsEmitedFromBeArgs<T> = {
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
