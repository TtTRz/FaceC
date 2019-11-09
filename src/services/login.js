import request from '@/utils/request';

export async function accountLogin(params) {
  return request('/api/face_u/accounts/develop/login', {
    method: 'POST',
    data: {
      token: 'ojvAr5BMObkeP0aGzBor-W3sp8TQ',
    },
  });
}
