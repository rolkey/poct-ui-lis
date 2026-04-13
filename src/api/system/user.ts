import request from '@/utils/request';

export function getUserInfo() {
  return request({
    url: '/system/user/getInfo',
    method: 'get'
  });
}

export function updateUser(user: any) {
  return request({
    url: '/system/user',
    method: 'put',
    data: user
  });
}

export function resetPwd(userId: number, password: string) {
  return request({
    url: '/system/user/resetPwd',
    method: 'put',
    data: { userId, password }
  });
}
