import "../../../utils/dotenv";
import { Connection, ConnectionOptions, createConnection, getConnectionOptions } from "typeorm";
import { Service } from "typedi";

import User from "./entity/User";
import Article from "./entity/Article";
import Category from "./entity/Category";

@Service()
export default class MysqlManager {
  private connection! : Connection;

  async initialize () : Promise<void> {
    const connectionOptions = await getConnectionOptions();
    const config = Object.assign(
      connectionOptions,
      {
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        entities: [
          User,
          Article,
          Category,
        ],
      },
    ) as ConnectionOptions;

    this.connection = await createConnection(config);
  }

  async dispose () : Promise<void> {
    await this.connection.close();
  }

  getConnection () : Connection {
    return this.connection;
  }
}
