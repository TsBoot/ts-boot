import Router from "@koa/router";
import MetaRouterClass from "koa-metarouter";
const router = new Router();

const metaRouter : MetaRouterClass = new MetaRouterClass(router);

export default metaRouter;
