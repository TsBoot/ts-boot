import {
  BaseEntity, Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany,
} from "typeorm";
import Article from "./Article";
import { UserStatus } from "./enum";


@Entity()
export default class User extends BaseEntity {
  @PrimaryGeneratedColumn({ unsigned: true, comment: "用户id(主键、无符号、自增)" })
  id ?: number = 0;

  @Column({ length: 50, comment: "用户昵称(长度50)" })
  userName : string = "";

  @Column({ length: 50, comment: "用户昵称(长度50)" })
  nickName : string = "";

  @Column({ length: 255, comment: "密码（使用bcrypt,加密验证）" })
  password ?: string = "";

  @Column({ type: "enum", enum: UserStatus, comment: "用户状态" })
  status : UserStatus = UserStatus.Enabled;

  @CreateDateColumn({ length: 0, comment: "创建时间" })
  createTime! : Date;

  @OneToMany(() => Article, (article) => article.user)
  articles ! : Article[];
}
