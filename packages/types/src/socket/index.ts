import { ReqPutGridContent } from "../api";
import { Operator } from "../ot";

export enum Events {
  JoinRoom = "join room",
  EmitOnlineUsers = "emit online users",
  OpsEmitedFromBe = "ops emited from be",
  ReplaceGridContent = "replace grid content",
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
