import { verify } from "jsonwebtoken";
import { RouterContext } from "koa-router";

import { UserToken } from "@tables/types";

import { TOKEN_SCRETE } from "../private";
import { TErrorToken } from "./errors";

export function checkToken(ctx: RouterContext | null, jwt?: string) {
  const token = ctx ? ctx.header.authorization : jwt;
  if (!token) throw new TErrorToken();
  try {
    const userInfo = verify(token.slice(7), TOKEN_SCRETE) as UserToken;
    if (typeof userInfo._id !== "string" || typeof userInfo.name !== "string") {
      throw new TErrorToken();
    }

    return userInfo;
  } catch (error) {
    throw new TErrorToken();
  }
}
