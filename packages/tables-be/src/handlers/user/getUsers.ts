import { IMiddleware } from "koa-router";

import { ReqGetUsers, ResCommon, ResGetUsers } from "@tables/types";

import { users } from "../../db";

const LIMIT_USERS = 10;

export const getUsers: IMiddleware = async (ctx) => {
  const req = ctx.request.body as ReqGetUsers;
  const userCursor = users.find({ name: { $regex: new RegExp(req.name) } });
  const usersRes = await userCursor
    .skip((req.page ?? 0) * LIMIT_USERS)
    .limit(LIMIT_USERS)
    .toArray();

  const res: ResCommon<ResGetUsers> = {
    status: 200,
    msg: "ok",
    data: usersRes.map((user) => ({ _id: user._id, name: user.name })),
  };

  ctx.body = res;
};
