import Container from "typedi";
import BaseController from "../../BaseController";
import CategoryService from "../../../service/CategoryService";
import metaRouter from "../../../router/metaRouter";
import { AppError } from "../../../middleware/errorHandler";
import decodeToken from "../../../middleware/decodeToken";
import stringLength from "string-length";
const { Post, Controller } = metaRouter;

@Controller({ path: "/ucenter" }, decodeToken)
export default class CategoryController extends BaseController {
/**
 * 注：懒得用装饰验证器验证接口接口数据类型
 */
  @Post()
  async save () : Promise<any> {
    let body = this.ctx.request.body;
    if (!body.name) throw new AppError("分类名称不能为空");
    if (body.string_id !== undefined && typeof body.string_id !== "string") throw new AppError("string_id 类型错误");
    if (body.id !== undefined && isNaN(Number(body.id))) throw new AppError("ID格式有误");
    if (typeof body.name !== "string") throw new AppError("分类名称必须是字符串类型");
    if (typeof body.string_id !== "string" && body.string_id !== undefined) throw new AppError("string_id必须是字符串类型");
    if (typeof body.name === "string" && stringLength(body.name) > 50) throw new AppError("分类名称字数不能大于50");
    if (typeof body.string_id === "string" && stringLength(body.string_id) > 255) throw new AppError("string_id字数不能大于255");

    body = {
      name: body.name.trim(),
      string_id: body.string_id ? body.string_id.trim() : undefined,
    };

    // 如果是未定义,则定义创建时间
    if (this.ctx.request.body.id !== undefined) {
      body.id = Number(this.ctx.request.body.id);
    }

    const service = Container.get(CategoryService);
    const category = await service.save(body);
    if (!category) {
      throw new AppError("保存失败，请重试");
    }
    return this.success(category);
  }

}
