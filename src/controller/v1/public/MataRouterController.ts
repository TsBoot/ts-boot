import BaseController from "../../BaseController";
import metaRouter from "../../../router/metaRouter";

const { All, Get, MetaRouter, Controller } = metaRouter;



const test1Middleware = (ctx : any, next : any) => {
  console.warn(1);
  next();
};
const test2Middleware = (ctx : any, next : any) => {
  console.warn(2);
  next();
};

@Controller({ path: "" }, test1Middleware)
export default class MataRouterController extends BaseController {
  @All(test2Middleware)
  async testaaa () : Promise<any> {
    return this.success({
      aaa: 2,
    });
  }

  @Get({ path: "/MataRouterController/test2" }, test1Middleware, test2Middleware)
  async test2 () : Promise<any> {
    return this.success({
      aaa: 1,
      url: this.ctx.state.router.url("url_c", 3), // => "/v1/MataRouter/url_c/3"
    });
  }
  @Get({ path: "/MataRouterController/test2" }, test1Middleware, test2Middleware)
  async test () : Promise<any> {
    return this.success({
      aaa: 1,
      url: this.ctx.state.router.url("url_c", 3), // => "/v1/MataRouter/url_c/3"
    });
  }

  @Get({ path: "/MataRouter/url_c/:id", name: "url_c" }, test1Middleware, test2Middleware)
  async url_c () : Promise<any> {
    console.warn(this.ctx.prames);
    this.ctx.body = { router: "c", parmes: this.ctx.prames, query: this.ctx.request.query };
  }

  @MetaRouter({ method: "purge", path: "/MataRouter/custom_a", name: "custom_a" }, test1Middleware)
  async custom_a () : Promise<any> {
    this.ctx.body = { router: "custom_a" };
  }

}

