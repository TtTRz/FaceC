
const USER = {
  LOGIN: '/api/face_u/accounts/login',
  DEV: '/api/face_u/accounts/develop/login',
  CURD: '/api/face_u/accounts/:aid',
  LOGOUT: '/api/face_u/accounts/logout'
}

const GROUP = {
  LIST: '/api/face_u/groups/list',
  MGET: '/api/face_u/groups/_mget',
  CURD: '/api/face_u/groups/:gid',
  ADD: '/api/face_u/groups',
  MANAGE: {
    LIST: '/api/face_u/groups/:gid/manage',
    ADD: '/api/face_u/groups/:gid/manage',
    EDIT: '/api/face_u/groups/:gid/manage/:mid',
    MPOST: '/api/face_u/groups/:gid/manage/_mpost',
    DEL: '/api/face_u/groups/:gid/manage'
  }
}

export const API = {
  USER,
  GROUP,
}
