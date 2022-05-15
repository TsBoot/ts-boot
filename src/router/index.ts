import metaRouter from "./metaRouter";
/**
 * 也可以使用import()方式引入路由，但是如果文件被打包压缩或名称路径发生变更,可能会导致获取不到文件
 */
// import("../controller/v1/public/DemoController");

import "../controller/v1/public/DemoController"; // 示例代码
import "../controller/v1/public/MataRouterController"; // 路由测试代码
import "../controller/v1/ucenter/LoginController"; // 登录控制器
// import "../controller/v1/ucenter/OrderController"; // 订单控制器
metaRouter.router.stack.forEach(i => {
  console.log(i.path);
});
export default metaRouter.router;
