import Router from "koa-router";

import { createUser } from "../handlers/user/createUser";
import { getUserByToken } from "../handlers/user/getUserByToken";
import { signInWithPw } from "../handlers/user/signIn";

export const userRouter = new Router();

userRouter
  .post("/sign", signInWithPw)
  .post("/", createUser)
  .get("/", getUserByToken);
