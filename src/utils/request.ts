import axios, { type AxiosInstance, type AxiosResponse } from 'axios';

import { useAccessStore } from '@/stores/access';
import { getLocale } from '@/locales';

// 后端响应的统一壳：{ code, message, data }，code === 0 表示业务成功
interface ApiEnvelope<T> {
  code: number;
  message: string;
  data: T;
}

const request: AxiosInstance = axios.create({
  // 默认 '/api'：dev 由 vite proxy 转发，prod 由反代处理
  // 跨域部署时在 .env.production 改 VITE_API_BASE 为绝对 URL
  baseURL: import.meta.env.VITE_API_BASE || '/api',
  timeout: 15_000,
});

// 请求拦截：附加 Bearer Token + Accept-Language
request.interceptors.request.use((config) => {
  const access = useAccessStore();
  if (access.accessToken) {
    config.headers.Authorization = `Bearer ${access.accessToken}`;
  }
  // vue-i18n 用的是 zh-CN/en-US 这种带 region 的代码，后端 middleware 用 Accept-Language
  // 直接传过去；后端会用 Normalize 归一化
  config.headers['Accept-Language'] = getLocale();
  return config;
});

// 响应拦截：解包统一壳；非 0 抛业务错误（带 message）；401 清 token
request.interceptors.response.use(
  (response: AxiosResponse<ApiEnvelope<unknown>>) => {
    const body = response.data;
    if (body && typeof body === 'object' && 'code' in body) {
      if (body.code === 0) {
        // 直接把 data 返回，业务侧拿到的就是 data
        return body.data as any;
      }
      const error = new Error(body.message || 'Request failed') as Error & {
        code?: number;
      };
      error.code = body.code;
      throw error;
    }
    return body as any;
  },
  (error) => {
    const status = error?.response?.status;
    if (status === 401) {
      // Token 失效；先简单清掉，后续可加 refresh 流程
      const access = useAccessStore();
      access.clear();
      // 防止循环：当前不在 /login 才跳
      if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
        window.location.href = `/login?redirect=${encodeURIComponent(
          window.location.pathname + window.location.search,
        )}`;
      }
    }
    return Promise.reject(error);
  },
);

export default request;
