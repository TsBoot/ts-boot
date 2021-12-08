import Dotenv from "dotenv";
import { getPath } from "./helper";

if (process.env.NODE_ENV === "production") {
  Dotenv.config(
    { path: getPath("config/.env") },
  );
} else {
  Dotenv.config(
    { path: getPath("config/.env.dev") },
  );
}
