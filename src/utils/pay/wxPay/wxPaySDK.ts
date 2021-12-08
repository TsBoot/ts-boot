import "../../dotenv";
import { Wechatpay } from "wechatpay-axios-plugin";
import { readFileSync } from "fs";
import { X509Certificate } from "crypto";
import path from "path";
import assert from "assert";

const rootPath = "../../../../certificate/wxPay/";
// 商户号
const merchantId = process.env.WXPAY_MERCHANT_ID;
// "平台证书序列号"
const platformCertificateSerial = process.env.WXPAY_PLATFORM_CERTIFICATE_SERIAL;

assert(merchantId, Error("缺少商户号 MERCHANT_ID"));
assert(platformCertificateSerial, Error("缺少平台证书序列号 PLATFORM_CERTIFICATE_SERIAL"));

const merchantPrivateKeyFilePath = path.join(__dirname, `${rootPath}apiclient_key.pem`);
const platformCertificateFilePath = path.join(__dirname, `${rootPath}apiclient_cert.pem`);

const merchantPrivateKeyInstance = readFileSync(merchantPrivateKeyFilePath);
const platformCertificateInstance = readFileSync(platformCertificateFilePath);

// 商户证书序列号
const merchantCertificateSerial = new X509Certificate(platformCertificateInstance).serialNumber;

const wxpay = new Wechatpay({
  mchid: merchantId,
  serial: merchantCertificateSerial,
  privateKey: merchantPrivateKeyInstance,
  certs: { [ platformCertificateSerial ]: platformCertificateInstance },
});

export default wxpay;
