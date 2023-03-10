import { IMiddleware } from "koa-router";
import { users } from "../../db";
import { ReqCreateUser, ResCommon, ResCreateUser } from "@tables/types";
import { checkUsername } from "@tables/utils";
import { ObjectId } from "mongodb";

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

  const duplicateUser = await users.findOne({ name: req.name });
  if (duplicateUser) {
    ctx.body = {
      status: 403,
      msg: "用户名已存在",
    };
    return;
  }

  const _id = new ObjectId().toString();

  await users.insertOne({
    name: req.name,
    pw: req.pw,
    _id,
  });
  const res: ResCommon<ResCreateUser> = {
    status: 200,
    msg: "ok",
    data: _id,
  };

  ctx.body = res;
};
