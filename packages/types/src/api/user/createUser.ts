import { User } from "../../users/user";

export type ReqCreateUser = Pick<User, "name" | "pw">;
/** user _id */
export type ResCreateUser = string | null;
