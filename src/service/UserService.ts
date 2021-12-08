import { Service } from "typedi";
import User from "../device/client/mysql/entity/User";
import { OrderType } from "./enum";

@Service()
export default class UserService {
  async getListSort (
    findName : number | string = "id",
    findValue : number | string | undefined = undefined,
    orderName : string,
    orderType : OrderType,
    skip : number,
    take : number,
  ) : Promise<User[]> {
    const repo = User.getRepository();
    return repo.find({
      where: {
        [ findName ]: findValue,
      },
      order: {
        [ orderName ]: orderType,
      },
      skip,
      take,
    });
  }

  async getUserById (id : number) : Promise<User | undefined> {
    const repository = User.getRepository();
    return repository.findOne({
      where: {
        id,
      },
    });
  }

  async getUserByUserName (userName : string) : Promise<User | undefined> {
    const repository = User.getRepository();
    return repository.findOne({
      where: {
        userName,
      },
    });
  }

  async save (user : {
    userName : string,
    password : string,
    nickName : string
  }) : Promise<User> {
    const repo = User.getRepository();
    return repo.save(user);
  }
}

