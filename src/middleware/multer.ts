import multer from "@koa/multer";
import os from "os";
import { uniqueIdFactory } from "../utils/uniqueId";

const storage = multer.diskStorage({ // multer调用diskStorage可控制磁盘存储引擎
  destination: function (req, file, cb) {
    cb(null, os.tmpdir());
  },
  filename: function (req, file, cb) {
    cb(null, uniqueIdFactory()); // 文件名使用cb回调更改，参数二是文件名，为了保证命名不重复，使用时间戳
  },
});
const limits = {
  fields: 10, // 非文件字段的数量
  fileSize: 500 * 1024 * 1024, // 文件大小 单位 b
  files: 1, // 文件数量
};
const upload = multer({
  storage,
  limits,
});
export default upload;
