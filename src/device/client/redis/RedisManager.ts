import "../../../utils/dotenv";
import Redis from "ioredis";
import { Service } from "typedi";

@Service()
export default class RedisManager {

  private connection! : Redis.Redis;

  async initialize () : Promise<Redis.Redis> {
    // const config = Object.assign();
    const config : Redis.RedisOptions = {
      port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379, // Redis port
      host: process.env.REDIS_HOST ? process.env.REDIS_HOST : "127.0.0.1", // Redis host
      family: process.env.REDIS_FAMILY ? parseInt(process.env.REDIS_FAMILY) : 4, // 4 (IPv4) or 6 (IPv6)
      password: process.env.REDIS_PASSWORD ? process.env.REDIS_PASSWORD : "",
      db: process.env.REDIS_DB ? parseInt(process.env.REDIS_DB) : 0,
    };
    this.connection = new Redis(config);

    return this.connection;
  }

  async dispose () : Promise<void> {
    await this.connection.disconnect();
  }
  getConnection () : Redis.Redis {
    return this.connection;
  }
}
