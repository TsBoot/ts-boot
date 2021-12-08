import { mapToObj } from "../../../utils/helper";
import BaseController from "../../BaseController";
import Container from "typedi";
import crypto, { createDiffieHellman } from "crypto";
import multer from "../../../middleware/multer";
import { aesDecrypt, aesEncrypt } from "../../../utils/crypto";
import { base64ToBuffer, base64ToDataUrl, dataUrlToBase64, toBase64 } from "../../../utils/base64";
import { readFile, writeFile } from "../../../utils/files";
import { snowflakeGenerator } from "../../../utils/snowflake";
import metaRouter from "../../../router/metaRouter";
import getBilibiliRoomInfo from "../../../device/request/platform_1/list/getBilibiliRoomInfo";
import RedisManager from "../../../device/client/redis/RedisManager";

const { Post, Get, Controller } = metaRouter;

@Controller({ path: "/public" })
export default class DemoController extends BaseController {

  /**
  * 接收请求参数示例
  */
  @Post(multer.single("avatar"))
  async requestArgument () : Promise<any> {
    const { token } = this.ctx.state;

    // 文档参考（中文）：https://koa.bootcss.com/#request
    // 文档参考（英文）：https://koajs.com/#request
    const {
      body,
      file,
      query,
      method,
      length,
      url,
      originalUrl,
      origin,
      href,
      path,
      querystring,
      search,
      host,
      hostname,
      URL,
      type,
      fresh,
      stale,
      protocol,
      secure,
      ip,
      ips,
      subdomains,
      idempotent,
      socket,
    } = this.ctx.request;
    const { params, header } = this.ctx;

    const map = new Map();
    map.set("header", header);
    map.set("token", token);
    map.set("body", body);
    map.set("file", file);
    map.set("params", params);
    map.set("method", method);
    map.set("length", length);
    map.set("url", url);
    map.set("originalUrl", originalUrl);
    map.set("origin", origin);
    map.set("href", href);
    map.set("path", path);
    map.set("querystring", querystring);
    map.set("search", search);
    map.set("host", host);
    map.set("hostname", hostname);
    map.set("URL", URL);
    map.set("type", type);
    map.set("query", query);
    map.set("fresh", fresh);
    map.set("stale", stale);
    map.set("protocol", protocol);
    map.set("secure", secure);
    map.set("ip", ip);
    map.set("subdomains", subdomains);
    map.set("idempotent", idempotent);
    map.set("ips", ips);
    console.warn("socket", socket);
    console.table(map);
    return this.success(mapToObj(map), "文档参考（中文）：https://koa.bootcss.com/#request");
  }

  /**
  * redis 使用示例
  * @returns
  */
  @Get()
  async redisCache () : Promise<any> {
    const redis = Container.get(RedisManager).getConnection();
    redis.set("aaa", 111);
    return this.success({
      aaa: await redis.get("aaa"),
    });
  }

  /**
  * 服务端网络请求使用示例
  * @returns
  */
  @Get()
  async getBilibiliRoomInfo () : Promise<any> {
    const { query } = this.ctx.request;
    const res = await getBilibiliRoomInfo(Number(query.id));
    return this.success(res);
  }

  /**
  * base64
  * @returns
  */
  @Get()
  async base64 () : Promise<any> {
    const str_2_base64 = toBase64("test-string");
    const base64_2_str = base64ToBuffer(str_2_base64).toString();
    return this.success({
      str_2_base64,
      base64_2_str,
    });
  }

  // 图片转base64
  @Get()
  async image_2_base64 () : Promise<any> {
    // 读取图片文件
    const buf1 = await readFile("../../public/github.jpg");
    // 图片buffer转为base64字符串
    const base64 = toBase64(buf1);
    // 字符串转为dataUrl
    const dataUrl = base64ToDataUrl("image/jpeg", base64);
    // 将dataUrl转为base64
    const base64_2 = dataUrlToBase64(dataUrl);
    // 将base64转为buffer
    const buffer = base64ToBuffer(base64_2);
    // 将文件写入磁盘
    const firePath = await writeFile("../../public/github_copy.jpg", buffer);
    return this.success({
      firePath,
      base64_2,
      dataUrl,
    });
  }
  /**
  * 加解密
  * @returns
  */
  @Get()
  async crapy () : Promise<any> {

    const str = "123456";
    const secret = "a secret";

    const md5 = crypto.createHash("md5").update(str).digest("hex");
    const sha1 = crypto.createHash("sha1").update(str).digest("hex");
    const sha256 = crypto.createHmac("sha256", secret).update(str).digest("hex");
    const sha512 = crypto.createHmac("sha512", secret).update(str).digest("hex");

    const data = {
      md5,
      sha1,
      sha256,
      sha512,
    };

    // RSA
    // 非对称加密的经典，除了可用于非对称加密，也可用于数字签名

    // ECC
    // 椭圆加密算法
    return this.success(data);
  }


  /**
  * AES加解密
  *
  * @returns
  */
  @Get()
  async AesCrapy () : Promise<any> {

    const data = aesEncrypt("123456");
    return this.success({
      aesEncrypt: data,
      aesDecrypt: aesDecrypt(data),
    });
  }


  @Get()
  async getCiphers () : Promise<any> {
    const ciphers = crypto.getCiphers();
    return this.success(ciphers);
  }
  @Get()
  async getCurves () : Promise<any> {
    const curves = crypto.getCurves();// ['Oakley-EC2N-3', 'Oakley-EC2N-4', ...]
    return this.success(curves);
  }

  /**
  * Oakley 秘钥分发方案示例
  */
  @Get()
  async createECDH () : Promise<any> {
    const alice = crypto.createECDH("Oakley-EC2N-4");
    const aliceKey = alice.generateKeys("base64");
    const alicePublicKey = alice.getPublicKey("base64");
    const alicePrivateKey = alice.getPrivateKey("base64");

    const bob = crypto.createECDH("Oakley-EC2N-4");
    bob.setPrivateKey(alicePrivateKey, "base64");
    const bobKey = bob.generateKeys("base64");
    const bobPublicKey = bob.getPublicKey("base64");
    const bobPrivateKey = bob.getPrivateKey("base64");

    const key1 = alice.computeSecret(bobPublicKey, "base64", "base64");
    const key2 = bob.computeSecret(alicePublicKey, "base64", "base64");

    return this.success({
      aliceKey,
      alicePublicKey,
      alicePrivateKey,
      key1,
      bobKey,
      bobPrivateKey,
      bobPublicKey,
      key2,
    });
  }

  /**
  * DiffieHellman 秘钥分发方案示例
  */
  @Get()
  async diffieHellman () : Promise<any> {
    // Generate Alice's keys...
    const length = 256;
    const alice = createDiffieHellman(length);
    const aliceKey = alice.generateKeys().toString("base64");
    const prime = alice.getPrime("base64"), generator = alice.getGenerator("base64");

    // Generate Bob's keys...
    const bob = createDiffieHellman(prime, "base64", generator, "base64");
    const bobKey = bob.generateKeys().toString("base64");

    // Exchange and generate the secret...
    const aliceSecret = alice.computeSecret(bobKey, "base64", "base64");
    const bobSecret = bob.computeSecret(aliceKey, "base64", "base64");

    return this.success({
      aliceSecret,
      bobSecret,
    });
  }


  @Get()
  async getHashes () : Promise<any> {
    const hashes = crypto.getHashes();
    return this.success(hashes);
  }

  /**
   * 设置cookies示例
   */
  @Get()
  async setCookies () : Promise<any> {
    this.ctx.cookies.set("username", "alice", {
      domain: "localhost",
      path: "*",
      // maxAge: 1000 * 60 * 60 * 1, // 过期时间-相对于请求时间
      expires: new Date("2022-09-30"), // 过期时间-绝对时间
      httpOnly: false,
      overwrite: false,
      secure: false,
    });
    return this.success({});
  }

  /**
 * 获取cookies示例
 */
  @Get()
  async getCookies () : Promise<any> {
    let cookie = this.ctx.cookies.get("username");
    if (!cookie) {
      cookie = "";
    }
    return this.success({ cookie: cookie });
  }


  /**
   * 雪花id
   */
  @Get()
  async snowflake () : Promise<any> {
    const res = [];
    for (let index = 0; index < 20; index++) {
      const big_int = snowflakeGenerator();
      const id = big_int.toString(2);
      res.push(big_int.toString());
      const arr = [];
      arr.push("0");
      arr.push(id.slice(0, 41));
      arr.push(id.slice(41, 46));
      arr.push(id.slice(46, 51));
      arr.push(id.slice(51, 63));
      res.push(arr.join("|"));
    }
    return this.success(res);
  }


}

