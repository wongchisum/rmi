/*
 * @Author: wangzhisen
 * @Date: 2022-08-16 14:57:38
 * @Last Modified by: wangzhisen
 * @Last Modified time: 2022-08-16 16:59:18
 *
 * 拦截xhr
 */
import { InterceptorConfig, InterceptorRule, Method } from "../typing";

const oldXHROpen = window.XMLHttpRequest.prototype.open;
const oldXHRSend = window.XMLHttpRequest.prototype.send;

function callback<T extends { method?: Method; url: string }>(
  item: T,
  method: Method,
  url: string
) {
  return (item.method ?? "GET") === method && url.toString().includes(item.url);
}

export class Interceptor {
  rules: InterceptorRule[] = [];
  mock = false;
  response: any = null;
  constructor(config: InterceptorConfig) {
    this.rules = config.rules;
    this.init();
  }
  init() {
    const context = this;
    // 重写xhr open
    window.XMLHttpRequest.prototype.open = function (
      url: string | URL,
      method: Method
    ) {
      const isMatch = context.rules.some((item) =>
        callback(item, method, url.toString())
      );
      if (isMatch) {
        context.mock = true;
        const cover = context.rules.find(item => callback(item, method, url.toString()))?.cover
        context.response = cover
      } else {
        context.mock = false;
        oldXHROpen.call(this, method, url, true);
      }
    };

    // 重写xhr send
    window.XMLHttpRequest.prototype.send = function (body) {
      const coverKeys = ["status", "statusText", "response", "readyState"];
      if (context.mock) {
        // 可读属性转为可写
        coverKeys.forEach((key) => {
          Object.defineProperty(this, key, {
            writable: true,
          });
        });
        const ctx = this as any;
        ctx.status = 200;
        ctx.readyState = 4;
        ctx.statusText = "OK";
        ctx.response = context.response;
        this.dispatchEvent(new Event("readystatechange"));
        return;
      }
      oldXHRSend.call(this, body);
    };
  }
}
