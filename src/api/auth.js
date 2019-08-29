import { post, getFileUrl, postByForm } from '../utils/fetch'

export function login (params) {
  return post('system/mgr/login', params)
}

export function logout () {
  return post('system/mgr/logout')
}

/**
 * 获取验证码
 * @export
 * @param {any} time 时间戳
 */
export function validCodeUrl (time) {
  return getFileUrl('system/kaptcha', { time })
}

/**
 * 修改密码
 * @param {*} params 参数
 */
export function changePwd (params) {
  return postByForm('system/user/modifyPwd', params)
}
