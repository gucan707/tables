import { User } from "../../users";

export type ReqGetUsers = {
  name: string;
  /** 默认为 0 */
  page?: number;
};

export type ResGetUsers = Omit<User, "pw">[];
