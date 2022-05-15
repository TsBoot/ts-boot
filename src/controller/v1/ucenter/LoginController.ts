import Container from "typedi";
import BaseController from "../../BaseController";
import UserService from "../../../service/UserService";
import { signToken } from "../../../utils/token";
import { signPasswordHash, verifyPassword } from "../../../utils/signPassword";
import metaRouter from "../../../router/metaRouter";
import { AppError } from "../../../middleware/errorHandler";

const { Post, Controller } = metaRouter;

@Controller({ path: "/ucenter" })
export default class LoginController extends BaseController {

  @Post()
  async login () : Promise<any> {
    let body = this.ctx.request.body;
    if (!body.userName) throw new AppError("用户名必须填写");
    if (!body.password) throw new AppError("密码必须填写");
    body = {
      userName: body.userName,
      password: body.password,
    };

    if (!body.userName) throw new AppError("用户名必须填写");
    if (!body.password) throw new AppError("密码必须填写");

    const service = Container.get(UserService);
    const user = await service.getUserByUserName(body.userName);
    if (!user) {
      throw new AppError("用户不存在");
    }
    if (!user.password) {
      throw new AppError("用户没有设置密码，请通过其它方式登陆，或设置密码后重试");
    }
    if (await verifyPassword(body.password, user.password)) {
      const token = signToken(user);
      return this.success({ token });
    } else {
      throw new AppError("密码错误");
    }
  }

  @Post()
  async register () : Promise<any> {
    let body = this.ctx.request.body;
    if (!body.userName) throw new AppError("用户名必须填写");
    if (!body.password) throw new AppError("密码必须填写");
    if (!body.nickName) {
      this.ctx.request.body.nickName = "";
    }
    body = {
      userName: body.userName,
      password: body.password,
      nickName: body.nickName,
    };

    if (!body.userName) throw new AppError("用户名必须填写");
    if (!body.password) throw new AppError("密码必须填写");
    const service = Container.get(UserService);
    let user = await service.getUserByUserName(body.userName);
    if (user) {
      throw new AppError("用户已经注册");
    }
    body.password = await signPasswordHash(body.password);

    const userService = Container.get(UserService);
    user = await userService.save(body);
    user.password = undefined;
    const token = signToken(user);
    return this.success({ ...user, token });
  }
}
