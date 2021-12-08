import { v4 as uuidv4, v5 as uuidv5, parse as parse } from "uuid";
import "./dotenv";
const UUID_NAMESPACE = process.env.UUID_NAMESPACE as string;

export function uuidFactory () : string {
  return uuidv5(uuidv4(), UUID_NAMESPACE);
}

export function compressUuid (v5uuid : string) : string {
  const arr = parse(v5uuid);

  let dataString = "";
  let cache = 0;
  for (let i = 0; i < arr.length; i++) {
    if (i % 2 === 0) {
      // 偶数
      cache = arr[ i ];
    } else {
      // 奇数
      let value = (arr[ i ] + cache).toString(32); // 2~36进制
      if (value.length === 1) {
        value = "0" + value;
      }
      dataString += value;
    }
  }
  return dataString;
}

export function getCompressTimestamp (timestamp : number = Date.now()) : string {
  return timestamp.toString(36);
}

// 不建议使用该id作为数据库主键和索引,这里仅用于文件名
export function uniqueIdFactory () : string {
  const v5uuid = uuidFactory();
  const compressUuidstr = compressUuid(v5uuid);
  const compressTimestamp = getCompressTimestamp();
  return `${compressTimestamp}-${compressUuidstr}`;
}
