import Container from "typedi";
import BaseController from "../../BaseController";
import ArticleService from "../../../service/ArticleService";
import metaRouter from "../../../router/metaRouter";
import { AppError } from "../../../middleware/errorHandler";
import decodeToken from "../../../middleware/decodeToken";
import stringLength from "string-length";
import { ArticleType, ArticleStatus } from "../../../device/client/mysql/entity/enum";
const { Post, Controller } = metaRouter;

@Controller({ path: "/ucenter" }, decodeToken)
export default class ArticleController extends BaseController {

  @Post()
  async save () : Promise<any> {
    const { token } = this.ctx.state;

    let body = this.ctx.request.body;
    if (!body.title) throw new AppError("标题不能为空");
    if (!body.description) throw new AppError("文章描述不能为空");
    if (!body.content) throw new AppError("文章内容不能为空");
    if (stringLength(body.title) > 255) throw new AppError("标题字数不能大于255");
    if (stringLength(body.description) > 255) throw new AppError("文章简介字数不能大于255");
    if (body.id !== undefined && isNaN(Number(body.id))) throw new AppError("ID格式有误");
    body = {
      title: body.title.trim(),
      content: body.content,
      description: body.description.trim(),
      type: body.type.toUpperCase() === "MD" ? ArticleType.MarkDown : ArticleType.HTML,
      cover_img: {},
      user_id: token.id,
    };
    // 如果是未定义,则定义创建时间
    if (this.ctx.request.body.id === undefined) {
      body.create_time = new Date();
    }
    if (this.ctx.request.body.publish_time) {
      body.publish_time = new Date(this.ctx.request.body.publish_time);
    } else {
      body.publish_time = new Date();
    }

    if (!this.ctx.request.body.status) {
      body.status = ArticleStatus.Draft;
    } else {
      switch (this.ctx.request.body.status.toUpperCase()) {
        case "Published".toUpperCase(): {
          body.status = ArticleStatus.Published;
          break;
        }
        case "Deleted".toUpperCase(): {
          body.status = ArticleStatus.Deleted;
          break;
        }
        default: {
          body.status = ArticleStatus.Draft;
          break;
        }
      }
    }


    const service = Container.get(ArticleService);
    const article = await service.save(body);
    if (!article) {
      throw new AppError("保存失败，请重试");
    }
    return this.success(article);
  }

}
