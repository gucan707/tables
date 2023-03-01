import { User } from "../../users";

export type ReqSearchUser = {
  name: string;
};

export type ResSearchUser = Omit<User, "pw">;
