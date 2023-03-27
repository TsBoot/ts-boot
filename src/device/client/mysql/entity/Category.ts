import {
  BaseEntity, Entity, PrimaryGeneratedColumn, Column,
} from "typeorm";


@Entity()
export default class Category extends BaseEntity {
  @PrimaryGeneratedColumn({ unsigned: true, comment: "文章id(主键、无符号、自增)" })
  id ?: number = 0;

  @Column({ length: 50, comment: "分类名称（50）" })
  name : string = "";

  @Column({ length: 255, comment: "字符串名称，可能将来用于匹配url，预留(长度255)", unique: true, nullable: true })
  string_id ?: string;



}
