import type { Context, Next } from "koa";
import { TokenData, deocdeToken } from "../utils/token";
import { AppError } from "./errorHandler";

// 路由级中间件
export default async (ctx : Context, next : Next) : Promise<void> => {
  let data;
  try {
    data = deocdeToken(String(ctx.header.token)) as unknown as { data : TokenData };
  } catch (error) {
    throw new AppError("Token 验证失败", 403);
  }
  ctx.state.token = data.data;
  await next();
};
