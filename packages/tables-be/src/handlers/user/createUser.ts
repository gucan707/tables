import { IMiddleware } from "koa-router";
import { db } from "../../db";
import { ReqCreateUser, ResCommon, ResCreateUser } from "@tables/types";
import { checkUsername } from "@tables/utils";

export const createUser: IMiddleware = async (ctx) => {
  const req = ctx.request.body as ReqCreateUser;
  const checkUsernameRes = checkUsername(req.name);
  if (checkUsernameRes) {
    ctx.body = {
      status: 403,
      msg: checkUsernameRes,
    };
    return;
  }

  const users = db.collection<ReqCreateUser>("users");
  const user = await users.insertOne({
    name: req.name,
    pw: req.pw,
  });
  const ret: ResCommon<ResCreateUser> = {
    status: 200,
    msg: "ok",
    data: user.insertedId.toString(),
  };

  ctx.body = ret;
};
