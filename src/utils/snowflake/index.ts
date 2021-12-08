import FlakeId from "flake-idgen";

export function BigIntToBuffer (bn : bigint) : string {
  return "0x" + bn.toString(16);
}

export function BufferToBigInt (buf : Buffer) : bigint {
  return BigInt("0x" + buf.toString("hex"));
}

// 配置有以下两种定义方式

// export const config = { id: 0 }; // id的范围0-1023

export const config = { datacenter: 0, worker: 256, epoch: 1394000000000 }; // datacenter 和 worker的范围是0-255

const flakeIdGen = new FlakeId(config);

export function snowflakeGenerator () : BigInt {
  const buf = flakeIdGen.next();
  return BufferToBigInt(buf);
}

