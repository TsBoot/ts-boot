import { Service } from "typedi";
import { Raw } from "typeorm";
import Article from "../device/client/mysql/entity/Article";
import Category from "../device/client/mysql/entity/Category";
import { ArticleType, ArticleStatus } from "../device/client/mysql/entity/enum/index";

@Service()
export default class ArticleService {

  async save (article : {
    id ?: number,
    title : string,
    description : string,
    content : string,
    cover_img : string
    type : ArticleType
    user_id : number
    categorys : Category[]
    status : ArticleStatus
    create_time : Date
    publish_time : Date
  }) : Promise<Article> {
    const repo = Article.getRepository();





    return repo.save(article);
  }

  async findOne (
    article : {
      id : number,
      status : ArticleStatus
      publish_time : Date
    },
    relations : string[] = [],
  ) : Promise<Article | undefined> {


    const repo = Article.getRepository();
    return repo.findOne(
      {
        relations,
        where: {
          id: article.id,
          status: article.status,
          publish_time: Raw((alias) => `${alias} < :date`, { date: article.publish_time }),
        },
      },
    );
  }

}

