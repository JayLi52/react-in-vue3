import axios from 'axios';

const DEFAULE_CONFIG = {};

export const axiosInstance: any = axios.create(DEFAULE_CONFIG);

const requestModal = async function (options?: any): Promise<any> {
  return await axiosInstance(options);
};

export function request(...params: any[]) {
  return requestModal(...params);
}

export function registerRequest(instance: any, sandbox?: any) {
  const globalWindow = sandbox?.getSandbox() || window;
  if (globalWindow.TeamixInterceptor) {
    const {
      requestInterceptor,
      responseInterceptor,
      networkInterceptor,
    } = globalWindow.TeamixInterceptor.default;
    instance.interceptors.request.clear?.();
    instance.interceptors.response.clear?.();
    instance.interceptors.request.use(requestInterceptor);
    instance.interceptors.response.use((response: any) => {
      if (response?.config?.data && typeof response.config.data.get !== 'function') {
        response.config.data.get = (key: any) => {
          return (response.config.oldParams || {})[key];
        };
      }
      return responseInterceptor(response);
    }, networkInterceptor);
    globalWindow.request = request;
  }
  if (globalWindow.TeamixPro) {
    globalWindow.TeamixPro.setGlobalConfig?.({ request: { requestMethod: request } });
  }
  if (globalWindow.TeamixAsCommon) {
    globalWindow.TeamixAsCommon.default?.utils?.init?.(request);
    globalWindow.TeamixAsCommon.utils?.init?.(request);
  }
  if (globalWindow.AscmBuyComponents) {
    globalWindow.AscmBuyComponents.setRequest?.(request);
  }
}

export function registerInnerRequest(sandbox?: any) {
  return registerRequest(axiosInstance, sandbox);
}
