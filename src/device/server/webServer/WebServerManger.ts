import assert from "assert";
import Koa from "koa";
import http, { Server } from "http";

class WebServerManger {

  static serverMap : Map<number, Server> = new Map();

  static koaMap : Map<number, Koa> = new Map();

  static async createServer (port : number) : Promise<void> {
    port = Math.round(port);
    assert(port > 0 && port < 65535, new Error("端口号不能小于0或大于65535"));
    const koa = new Koa();
    WebServerManger.koaMap.set(port, koa);
    const httpServer = http.createServer(koa.callback());
    WebServerManger.serverMap.set(port, httpServer);

    httpServer.listen(port);
    console.info(`web server started http://localhost:${port}`);
  }

  static serverStoper (port : number) : void {
    const koa = WebServerManger.koaMap.get(port);
    const httpServer = WebServerManger.serverMap.get(port);
    if (koa) {
      koa.removeAllListeners();
    }
    if (httpServer) {
      httpServer.close();
      WebServerManger.serverMap.delete(port);
    }
  }
}

export default WebServerManger;
