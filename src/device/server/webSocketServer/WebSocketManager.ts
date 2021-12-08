import WebsocketEvent from "./WebsocketEvent";
import WebServerManger from "../webServer/WebServerManger";

import WebSocket from "ws";
const Server = WebSocket.Server;

export default class WebSocketManager {

  static serversMap : Map<number, WebSocket.Server> = new Map();

  static async createServer (port : number) : Promise<void> {
    const server = WebServerManger.serverMap.get(port);
    if (server) {
      WebSocketManager.serversMap.set(port, new Server({ server }));
    } else {
      WebSocketManager.serversMap.set(port, new Server({ port }));
    }
    const wss = WebSocketManager.serversMap.get(port);
    if (wss) {
      WebSocketManager.onWebsocketEvent(wss);
    }
    console.info(`WebSocket started ws://localhost:${port}`);
  }

  private static onWebsocketEvent (wss : WebSocket.Server) : void {
    WebsocketEvent(wss);
  }

}
