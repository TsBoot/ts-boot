import bcrypt from "@node-rs/bcrypt";

export function signPasswordHash (password : string) : Promise<string> {
  return bcrypt.hash(password);
}

export function verifyPassword (password : string | Buffer, hash : string) : Promise<boolean> {
  return bcrypt.compare(password.toString(), hash);
}
