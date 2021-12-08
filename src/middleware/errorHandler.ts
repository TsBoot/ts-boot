import type { Context, Next } from "koa";

export class AppError extends Error {
  code : number;
  statusCode : number;
  constructor (message ?: string, code = 500, statusCode = 500) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;
  }
}

// 这里定义了一个公共中间件
export default () => async (ctx : Context, next : Next) : Promise<void> => {
  try {
    await next();
    if (ctx.response.status === 404 && ctx.response.message === "Not Found") {
      throw new AppError("Not Found", 404, 404);
    } else if (ctx.response.status === 405 && ctx.response.message === "Method Not Allowed") {
      throw new AppError(ctx.response.message, 405, 405);
    }
  } catch (error : any) {
    if (error instanceof AppError) {
      ctx.status = error.statusCode;
      ctx.body = {
        code: error.code,
        data: error.message,
        msg: "error",
        stack: process.env.NODE_ENV === "production" ? undefined : error.stack?.split("\n"),
      };
    } else {
      const err = error;
      ctx.body = {
        code: 500,
        data: err.message,
        msg: "error",
        stack: process.env.NODE_ENV === "production" ? undefined : err.stack?.split("\n"),
      };
      console.error(err);
    }
  }
};
