import "../../../utils/dotenv";
import BaseController from "../../BaseController";
import metaRouter from "../../../router/metaRouter";
import { AppError } from "../../../middleware/errorHandler";
import wxpay from "../../../utils/pay/wxPay/wxPaySDK";
import alipaySdk from "../../../utils/pay/aliPay/aliPaySDK";

const { All, Controller } = metaRouter;

@Controller({ path: "/ucenter" })
export default class OrderController extends BaseController {
  @All()
  async wxpay_order () : Promise<any> {
    try {
      const res = await wxpay.v3.pay.transactions.native
        .post({
          mchid: process.env.WXPAY_MERCHANT_ID,
          out_trade_no: "native12177525012014070332333",
          appid: process.env.WXPAY_APPID,
          description: "Image形象店-深圳腾大-QQ公仔",
          notify_url: "https://weixin.qq.com/",
          amount: {
            total: 1,
            currency: "CNY",
          },
        });
      return this.success(res);
    } catch (error : any) {
      this.success(error);
      this.success(error.response);
    }

  }
  @All()
  async alipay_order () : Promise<any> {
    const order = {
      orderNumber: "alipay_123456",
      totalAmount: 1,
      productName: "测试商品",
      notify_url: "https://alipay.com/Pay/Alipay/receiveNotify", // 回调通知地址
    };
    try {
      // 需要AES加解密的接口
      await alipaySdk.exec("alipay.trade.wap.pay", {
        bizContent: {
          out_trade_no: order.orderNumber, // 商户订单号。64 个字符以内的大小，可包含字母、数字、下划线。需保证该参数在商户端不重复
          product_code: "FAST_INSTANT_TRADE_PAY", // 销售产品码，与支付宝签约的产品码名称。注：目前电脑支付场景下仅支持FAST_INSTANT_TRADE_PAY
          total_amount: order.totalAmount / 100, // 订单总金额，单位为元，精确到小数点后两位，取值范围为 [0.01,100000000]。金额不能为0。
          subject: order.productName, // 订单标题
        },
        notify_url: order.notify_url,
        // 自动AES加解密
        needEncrypt: false,
      });

    } catch (error : any) {
      if (error?.serverResult?.status === 302) {
        // 重定向,将重定向的url生成qrcode手机扫码支付
        return this.success({ url: error.serverResult.headers.location });
      } else {
        console.error("createAliPay error:", error);
        throw new AppError("订单创建失败,请重试.");
      }
    }

  }
}
