import request from '@/utils/request';
import PathToRegexp from 'path-to-regexp';
export async function query() {
  return request('/api/users');
}
export async function queryCurrent() {
  return request('/api/face_u/accounts/4');
}
export async function queryNotices() {
  return request('/api/notices');
}

export async function editUser(payload) {
  const pattern = PathToRegexp.compile('/api/face_u/accounts/:aid');
  console.log()
  return request(pattern({ aid: payload.userId }), {
    method: 'PUT',
    data: {
      sex: payload.sex,
      phone: payload.phone,
      motto: payload.motto,
      nickname: payload.nickname,
    },
  })
}
