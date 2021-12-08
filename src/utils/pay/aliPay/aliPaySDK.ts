import "../../dotenv";
import AlipaySdk from "alipay-sdk";
import fs from "fs";
import path from "path";
import assert from "assert";

const rootPath = "../../../../certificate/aliPay/";

const { ALIPAY_APPID } = process.env;
assert(ALIPAY_APPID, Error("缺少支付宝APPID"));

// 证书模式
const alipaySdk = new AlipaySdk({
  appId: ALIPAY_APPID,
  privateKey: fs.readFileSync(path.join(__dirname, `${rootPath}private-key.pem`), "utf-8"),
  alipayRootCertPath: path.join(__dirname, `${rootPath}alipayRootCert.crt`),
  appCertPath: path.join(__dirname, `${rootPath}appCertPublicKey_2021002196686559.crt`),
  alipayPublicCertPath: path.join(__dirname, `${rootPath}alipayCertPublicKey_RSA2.crt`),
});

export default alipaySdk;

