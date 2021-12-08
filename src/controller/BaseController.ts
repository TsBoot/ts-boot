import { Context } from "koa";
import type App from "../App";
export default class BaseController {
  ctx : Context;
  app : App | undefined;
  constructor (ctx : Context) {
    this.app = ctx.state.app;
    this.ctx = ctx;
  }
  success (body : unknown, msg = "success") : void {
    this.ctx.body = {
      code: 200,
      data: body,
      msg,
    };
  }
}
