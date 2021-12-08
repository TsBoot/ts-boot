import WebSocket from "ws";
import { deocdeToken, TokenData } from "../../../utils/token";

type LoginMessage = {
  "type" : "Login",
  "token" : string | TokenData
};
type TransmitMessage = {
  "type" : "Transmit",
  "toUserId" : number,
  "fromUserId" : number,
  "fromNickName" : string,
  "data" : any,
  "dataType" : string
};

type GetOnlineListMessage = {
  "type" : "GetOnlineList"
};
type Message = LoginMessage | TransmitMessage | GetOnlineListMessage;

export default (server : WebSocket.Server) : void => {
  const clientTokenMap : Map<WebSocket, TokenData> = new Map();
  server.on("connection", (ws : WebSocket & { token : TokenData | undefined }) => {
    ws.on("close", () => {
      clientTokenMap.delete(ws);
    });
    ws.on("message", (msg) => {
      let message : Message | undefined;
      try {
        message = JSON.parse(msg.toString());
      } catch (error) {
        console.error(error);
      }
      const myToken = clientTokenMap.get(ws);
      // 如果没有消息，没有token且不是来登录的，强行关闭链接
      if (!message || (!myToken && message.type !== "Login")) {
        ws.terminate();
        return;
      }

      switch (message.type) {
        case "Login":
          try {
            if (typeof message.token === "string") {
              clientTokenMap.set(ws, deocdeToken(message.token));
            } else {
              throw new Error("token type error");
            }
            ws.send(JSON.stringify({
              type: "LoginRes",
              code: 0,
              msg: "success",
            }));
          } catch (error : any) {
            ws.send(JSON.stringify({
              type: "LoginRes",
              code: 403,
              msg: error.message ? error.message : "token error",
            }));
            ws.terminate();
          }
          break;
        case "Transmit":
          switch (message.dataType) {
            case "text":
              clientTokenMap.forEach((tk, client) => {
                if (message?.type === "Transmit" && message.toUserId === tk.data.id) {
                  if (myToken) {
                    message.fromUserId = myToken.data.id;
                    message.fromNickName = myToken.data.nickName;
                    message.data = String(message.data);
                    client.send(JSON.stringify(message));
                  }
                }
              });
              break;

            default:
              break;
          }
          break;
        case "GetOnlineList": {
          const list : Array<{ id : number, nickName : string }> = [];
          clientTokenMap.forEach((tk) => {
            if (tk.data.id) {
              if (!tk.data.nickName) {
                tk.data.nickName = "";
              }
              list.push({
                id: tk.data.id,
                nickName: tk.data.nickName,
              });
            }
          });
          ws.send(JSON.stringify({
            type: "GetOnlineListRes",
            list,
          }));
          break;
        }
        default:
          break;
      }
    });
  });
};
