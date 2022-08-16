import { Service, AdaptorConfig } from "../typing";

export function adaptor<T, R = any>(
  fn: Service<T>,
  config?: AdaptorConfig<T, R>
) {
  const adaptorConfig: AdaptorConfig<T, R> = {
    success: true,
    reason: "Rejected" as unknown as R,
    coverService: false as any,
    ...config,
  };

  const { success, reason, result, coverService } = adaptorConfig;
  return () =>
    new Promise((resolve, reject) => {
      // 重写请求响应
      if (coverService) {
        return fn().then(
          (data) => {
            const response =
              typeof coverService === "function"
                ? coverService(data, null as any)
                : coverService;
            resolve(response);
          },
          (err) => {
            const response =
              typeof coverService === "function"
                ? coverService(null as any, err)
                : coverService;
            reject(response);
          }
        );
      } else if (success) {
        resolve(result);
      } else {
        reject(reason);
      }
    });
}
