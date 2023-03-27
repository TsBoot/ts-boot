import Container from "typedi";
import BaseController from "../../BaseController";
import ArticleService from "../../../service/ArticleService";
import metaRouter from "../../../router/metaRouter";
import { AppError } from "../../../middleware/errorHandler";
import { ArticleStatus } from "../../../device/client/mysql/entity/enum";
const { Get, Controller } = metaRouter;


/**
 * 注：懒得用装饰验证器验证接口接口数据类型
 */
@Controller()
export default class ArticleController extends BaseController {

  @Get()
  async getOne () : Promise<any> {
    const query = this.ctx.request.query;
    if (query.id === undefined || isNaN(Number(query.id))) throw new AppError("ID不能为空");

    const service = Container.get(ArticleService);
    /**
     * 早于当前时间的
     * 状态为已发布的文章
     */
    const article = await service.findOne(
      {
        id: Number(query.id),
        status: ArticleStatus.Published,
        publish_time: new Date(),
      },
      [ "categories" ],
    );

    if (!article) {
      throw new AppError("文章不存在", 404);
    }
    return this.success(article);
  }

  /**
  * 不区分类型的文章列表
  */
  @Get()
  async getList () : Promise<any> {
    /**
     * pageSizes
     * currentPage
     */
    const query = this.ctx.request.query;


    // if (query.id === undefined || isNaN(Number(query.id))) throw new AppError("ID不能为空");
  }

  /**
   * 根据类型查询文章列表
   */

}
