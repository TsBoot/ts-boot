import { Service } from "typedi";
import { Raw } from "typeorm";
import Category from "../device/client/mysql/entity/Category";

@Service()
export default class CategoryService {

  async save (category : {
    id ?: number,
    name : string,
    string_id ?: string,
  }) : Promise<Category> {
    const repo = Category.getRepository();
    return repo.save(category);
  }

  async findByIds (category : number[]) : Promise<Category[]> {
    const repo = Category.getRepository();
    return repo.findByIds(category);
  }
}

