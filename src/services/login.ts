import request from '@/utils/request';
import {API} from "@/services/apis";

export interface LoginParamsType {
  userName: string;
  password: string;
}

export async function userLogin(): Promise<any> {
  return request(API.USER.DEV, {
    method: 'POST',
    data: {
      token: 'ojvAr5BMObkeP0aGzBor-W3sp8TQ',
    },
  });
}

export async function checkLoginStatus(): Promise<any> {
  return request(API.USER.LOGIN, {
    method: 'get',
  })
}

export async function userLogout(): Promise<any> {
  return request(API.USER.LOGOUT)
}
