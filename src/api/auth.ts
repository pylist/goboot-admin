import request from '@/utils/request';
import type { UserInfo } from '@/stores/user';

export interface LoginParams {
  account: string;
  password: string;
}

export interface LoginResult {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: UserInfo;
}

/** 登录：account 可以是用户名或邮箱 */
export function loginApi(data: LoginParams) {
  return request.post<unknown, LoginResult>('/auth/login', data);
}

/** 退出登录（带 refreshToken 让后端拉黑） */
export function logoutApi(refreshToken?: string) {
  return request.post('/auth/logout', { refreshToken });
}

/** 拉当前登录用户资料 */
export function getProfileApi() {
  return request.get<unknown, UserInfo>('/user/profile');
}
