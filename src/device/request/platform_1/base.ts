import axios from "axios";
const instance = axios.create(); // 务必创建一个实例，以免修改全局配置污染到其他请求
const retry = 2; // 重试次数
const retryDelay = 1000;// 重试延时
const shouldRetry = (_error : any) => true; // 重试条件，默认只要是错误都需要重试

// 添加请求拦截器
instance.interceptors.request.use(function (options) {
  options.baseURL = "https://api.live.bilibili.com";
  options.timeout = 10000;
  options.responseType = "json";
  return options;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});

instance.interceptors.response.use(undefined, (err) => {
  const { config, response } = err;
  const data = response ? response.data : {};
  // 判断是否配置了重试
  if (!config || !retry) return Promise.reject(err);
  if (!shouldRetry || typeof shouldRetry !== "function") {
    return Promise.reject(err);
  }
  // 判断是否满足重试条件
  if (!shouldRetry(err)) {
    return Promise.reject(err);
  }

  try {
    const res = JSON.parse(data);
    if (res.result !== 1) {
      // throw new Error("请求重试")
    }
    return Promise.reject(err);
  // eslint-disable-next-line no-empty
  } catch (error) {}

  // 设置重置次数，默认为0
  config.__retryCount = config.__retryCount || 0;

  // 判断是否超过了重试次数

  if (config.__retryCount >= retry) {
    return Promise.reject(err);
  }
  // 重试次数自增
  config.__retryCount += 1;
  // 延时处理
  const backoff = new Promise<void>(function (resolve) {
    setTimeout(function () {
      resolve();
    }, retryDelay || 1);
  });

  // 重新发起axios请求
  return backoff.then(function () {
    return instance(config);
  });
});

export default instance;
