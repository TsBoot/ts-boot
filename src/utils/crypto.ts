import crypto, { } from "crypto";
const key = "tVMmDFwolfhmpHxSl+okLG+Ze2H0GZAf"; // 密钥
const iv = "5105044042186302"; // 偏移向量


export function aesEncrypt (data : string, k ?: crypto.CipherKey) : string {
  if (!k) k = key;

  const cipherChunks = [];
  const cipher = crypto.createCipheriv("aes-256-cbc", k, iv);
  cipher.setAutoPadding(true);
  cipherChunks.push(cipher.update(data, "utf8", "base64"));
  cipherChunks.push(cipher.final("base64"));

  return cipherChunks.join("");
}

export function aesDecrypt (encrypted : string, k ?: crypto.CipherKey) : string {
  if (!k) k = key;

  const cipherChunks = [];
  const decipher = crypto.createDecipheriv("aes-256-cbc", k, iv);
  decipher.setAutoPadding(true);
  cipherChunks.push(decipher.update(encrypted, "base64", "utf8"));
  cipherChunks.push(decipher.final("utf8"));

  return cipherChunks.join("");
}
