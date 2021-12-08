import "reflect-metadata";
import "./utils/dotenv";
import killports from "killports";
import App from "./App";

const { WEB_SERVER_PORT, WEB_SOCKET_PORT } = process.env;

if (process.env.NODE_ENV !== "production") {
  // 解除报错栈道行数限制
  Error.stackTraceLimit = Infinity;
  // node --stack-trace-limit=1000 debug.js //命令行启动带参方式,默认10
}

const run = async () => {

  // 临时解决端口重复占用问题。有更优解决方案。
  await killports([ WEB_SOCKET_PORT ]);
  await killports([ WEB_SERVER_PORT ]);

  new App();
};

run();
