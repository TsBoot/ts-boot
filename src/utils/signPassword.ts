import bcrypt from "bcrypt";

const saltRounds = 10;

export function signPasswordHash (password : string) : string {
  const salt = bcrypt.genSaltSync(saltRounds);
  const hash = bcrypt.hashSync(password, salt);
  return hash;
}

export function verifyPassword (password : string | Buffer, hash : string | undefined) : string | boolean {
  if (password && hash) {
    return bcrypt.compareSync(password.toString(), hash);
  }
  return false;
}
