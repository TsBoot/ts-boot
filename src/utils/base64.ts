type Base64ToTpye = Buffer | string;

// 将buffer或字符串转为base64字符串
export function toBase64 (target : Base64ToTpye, encoding ?: BufferEncoding | undefined) : string {
  if (Buffer.isBuffer(target)) {
    return target.toString("base64");
  } else {
    return Buffer.from(target, encoding).toString("base64");
  }
}

// 将base64字符串转为dataUrl
export function base64ToDataUrl (header : string, base64String : string) : string {
  return `data:${header};base64,${base64String}`;
}

// 将base64转为buffer
export function base64ToBuffer (str : string) : Buffer | never {
  return Buffer.from(str, "base64");
}

// 将dataUrl转为base64
export function dataUrlToBase64 (dataUrl : string) : string {
  return dataUrl.replace(/^data:[a-z]+\/\w+;base64,/, "");
}
