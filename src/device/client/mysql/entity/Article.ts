import {
  BaseEntity, Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
} from "typeorm";
import { ArticleType, ArticleStatus } from "./enum";


@Entity()
export default class Article extends BaseEntity {
  @PrimaryGeneratedColumn({ unsigned: true, comment: "文章id(主键、无符号、自增)" })
  id ?: number = 0;

  @Column({ length: 255, comment: "标题(长度255)" })
  title : string = "";

  @Column({ length: 255, comment: "文章描述(长度255)" })
  description : string = "";

  @Column({ type: "longtext", comment: "正文内容" })
  content : string = "";

  @Column({ type: "json", comment: "封面图" })
  cover_img : string = "";

  @Column({ type: "enum", enum: ArticleType, comment: "文章类型" })
  type : string = "";

  @Column({ unsigned: true, comment: "作者id" })
  user_id : number = 0;

  @Column({ type: "enum", enum: ArticleStatus, comment: "文章状态" })
  status : ArticleStatus = ArticleStatus.Draft;

  @CreateDateColumn({ length: 0, comment: "创建时间" })
  create_time! : Date;

  @CreateDateColumn({ length: 0, comment: "发布时间" })
  publish_time! : Date;
}