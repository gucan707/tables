export enum Events {
  JoinRoom = "join room",
}

export type ReqJoinRoom = {
  /** tableID */
  roomNumber: string;
  jwt: string;
};
