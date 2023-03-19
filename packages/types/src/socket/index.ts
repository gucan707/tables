export enum Events {
  JoinRoom = "join room",
  EmitOnlineUsers = "emit online users",
}

export type ReqJoinRoom = {
  /** tableID */
  roomNumber: string;
  jwt: string;
};
