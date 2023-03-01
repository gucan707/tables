import { UserToken } from "@tables/types";
import { verify } from "jsonwebtoken";
import { RouterContext } from "koa-router";
import { TOKEN_SCRETE } from "../private";

export function checkToken(ctx: RouterContext) {
  const token = ctx.header.authorization;
  if (!token) return null;
  try {
    const userInfo = verify(token, TOKEN_SCRETE) as UserToken;
    if (typeof userInfo._id !== "string" || typeof userInfo.name !== "string") {
      return null;
    }

    return userInfo;
  } catch (error) {
    return null;
  }
}
