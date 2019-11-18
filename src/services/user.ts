import request from '@/utils/request';
import {API} from "@/services/apis";
import PathToRegexp from 'path-to-regexp';


export async function query(): Promise<any> {
  return request('/api/users');
}

export async function queryCurrent(): Promise<any> {
  return request('/api/currentUser');
}

export async function queryNotices(): Promise<any> {
  return request('/api/notices');
}


export interface getUserPayloadType{
  id: number,
}
export async function getUser(payload: getUserPayloadType): Promise<any> {
  const pattern = PathToRegexp.compile(API.USER.CURD);
  return request(pattern({ aid: payload.id }), {
    method: 'get',
  })
}
