import Container from "typedi";
import BaseController from "../../BaseController";
import ArticleService from "../../../service/ArticleService";
import metaRouter from "../../../router/metaRouter";
import { AppError } from "../../../middleware/errorHandler";
import decodeToken from "../../../middleware/decodeToken";
import stringLength from "string-length";
import { ArticleType, ArticleStatus } from "../../../device/client/mysql/entity/enum";
import Category from "../../../device/client/mysql/entity/Category";
import CategoryService from "../../../service/CategoryService";
import isarray from "isarray";

const { Post, Controller } = metaRouter;

@Controller({ path: "/ucenter" }, decodeToken)
export default class ArticleController extends BaseController {
/**
 * 注：懒得用装饰验证器验证接口接口数据类型
 */
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
    console.log(body);


    if (!isarray(body.categories)) {
      throw new AppError("分类id必须是数组");
    }
    let flag = false;
    body.categories.forEach((item : unknown) => {
      if (typeof item !== "number" || isNaN(item)) {
        flag = true;
      }
    });
    if (flag) {
      throw new AppError("分类id必须是数字");
    }
    const categoryService = Container.get(CategoryService);
    const categories = await categoryService.findByIds(body.categories);
    body = {
      title: body.title.trim(),
      content: body.content,
      description: body.description.trim(),
      type: body.type.toUpperCase() === "MD" ? ArticleType.MarkDown : ArticleType.HTML,
      cover_img: {},
      user_id: token.id,
      categories: categories,
    };

    // 如果是未定义,则定义创建时间
    if (this.ctx.request.body.id === undefined) {
      body.create_time = new Date();
    } else {
      body.id = Number(this.ctx.request.body.id);
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


    const articleService = Container.get(ArticleService);
    const article = await articleService.save(body);
    if (!article) {
      throw new AppError("保存失败，请重试");
    }
    return this.success(article);
  }

}
