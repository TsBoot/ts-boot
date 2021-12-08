import fs from "fs";
import path from "path";

// 异步读取文件
export function readFile (filePath : string) : Promise<Buffer> {
  return new Promise<Buffer>((resolve, reject) => {
    fs.readFile(path.join(__dirname, filePath), "binary", function (err, data) {
      if (err) return reject(err);
      resolve(Buffer.from(data, "binary"));
    });
  });
}

// 异步保存文件
export function writeFile (filePath : string, file : Buffer) : Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const str = path.join(__dirname, filePath);
    fs.writeFile(str, file, function (err) {
      if (err) return reject(err);
      resolve(str);
    });
  });
}
