import "./utils/dotenv";

const { REDIS_ENABLE, WEB_SOCKET_ENABLE, WEB_SERVER_ENABLE, WEB_SERVER_PORT, WEB_SOCKET_PORT, MYSQL_ENABLE } = process.env;

import KoaBodyparser from "koa-bodyparser";
import KoaStatic from "koa-static";
import cors from "@koa/cors";
import Container from "typedi";
import MysqlManager from "./device/client/mysql/MysqlManager";
import RedisManager from "./device/client/redis/RedisManager";
import router from "./router";
import errorHandler from "./middleware/errorHandler";

import WebServerManger from "./device/server/webServer/WebServerManger";
import WebSocketManager from "./device/server/webSocketServer/WebSocketManager";
import assert from "assert";

assert(WEB_SERVER_PORT, Error("缺少http服务端口号"));
assert(WEB_SOCKET_PORT, Error("缺少websocket服务端口号"));

export default class App {
  constructor () {
    this.start();
  }

  async start () : Promise<void> {

    // 初始化数据库
    if (MYSQL_ENABLE === "true" || MYSQL_ENABLE === "1") {
      Container.get(MysqlManager).initialize();
    }

    // 初始化Redis
    if (REDIS_ENABLE === "true" || REDIS_ENABLE === "1") {
      Container.get(RedisManager).initialize();
    }

    // 初始化WebServer
    if (WEB_SERVER_ENABLE === "true" || WEB_SERVER_ENABLE === "1") {
      WebServerManger.createServer(Number(WEB_SERVER_PORT));
      this.loadMiddleware();
    }

    // 初始化WebSocket
    if (WEB_SOCKET_ENABLE === "true" || WEB_SOCKET_ENABLE === "1") {
      WebSocketManager.createServer(Number(WEB_SOCKET_PORT));
    }

  }

  loadMiddleware () : void {
    const koa = WebServerManger.koaMap.get(Number(WEB_SERVER_PORT));
    if (koa) {
      koa.use(errorHandler()); // 全局异常捕获
      koa.use(KoaStatic("public")); // 加载静态资源目录
      koa.use(KoaBodyparser()); // 解析请求的body
      koa.use(cors({})); // 处理全局跨域，
      koa.use(router.routes()); // 加载路由
      koa.use(router.allowedMethods());
    }
  }

  async stop () : Promise<void> {

    Container.get(MysqlManager).dispose();

    if (WEB_SOCKET_ENABLE === "true" || WEB_SOCKET_ENABLE === "1") {
      Container.get(RedisManager).dispose();
    }

    if (WEB_SOCKET_ENABLE === "true" || WEB_SOCKET_ENABLE === "1") {
      WebServerManger.serverStoper(Number(WEB_SERVER_PORT));
    }

  }
}
