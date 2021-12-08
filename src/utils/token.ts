import "./dotenv";
// import Users from "../entity/Users";
import jwt from "jsonwebtoken";
import { UserStatus } from "../device/client/mysql/entity/enum";
import User from "../device/client/mysql/entity/User";

const srcret = process.env.JWT_SRCRET ? process.env.JWT_SRCRET : "";
const expiresIn = "15d";

export type TokenPayload = {
  id : number,
  userName : string,
  nickName : string,
  status : UserStatus,
  createTime : Date
};
export interface TokenData {
  data : TokenPayload,
  iat : number,
  exp : number
}
export function deocdeToken (token : string) : TokenData {
  return jwt.verify(token, srcret) as TokenData;
}

export function signToken (user : User) : string {
  user.password = undefined;
  const token = jwt.sign({
    data: user,
  }, srcret, { expiresIn });
  return token;
}
