// +----------------------------------------------------------------------
// | CRMEB [ CRMEB赋能开发者，助力企业发展 ]
// +----------------------------------------------------------------------
// | Copyright (c) 2016~2024 https://www.crmeb.com All rights reserved.
// +----------------------------------------------------------------------
// | Licensed CRMEB并不是自由软件，未经许可不能去掉CRMEB相关版权
// +----------------------------------------------------------------------
// | Author: CRMEB Team <admin@crmeb.com>
// +----------------------------------------------------------------------

import { HTTP_REQUEST_URL, HEADER, TOKENNAME, TIMEOUT } from '@/config/app'
import { toLogin, checkLogin } from '../libs/login'
import store from '../store'
import i18n from './lang.js'

// 防止重复显示登录提示
let isShowingLoginModal = false

/**
 * 发送请求
 */
function baseRequest(
  url,
  method,
  data,
  { noAuth = false, noVerify = false, showToast = true }
) {
  let Url = HTTP_REQUEST_URL,
    header = HEADER

  if (!noAuth) {
    //登录过期自动登录
    if (!store.state.app.token && !checkLogin()) {
      toLogin()
      return Promise.reject({
        msg: i18n.t(`未登录`)
      })
    }
  }
  if (store.state.app.token)
    header[TOKENNAME] = 'Bearer ' + store.state.app.token

  // 解决CORS问题，确保在H5环境下添加正确的跨域头
  // #ifdef H5
  header['X-Requested-With'] = 'XMLHttpRequest'
  // #endif

  return new Promise((resolve, reject) => {
    if (uni.getStorageSync('locale')) {
      header['Cb-lang'] = uni.getStorageSync('locale')
    }
    uni.request({
      url: Url + '/api/' + url,
      method: method || 'GET',
      header: header,
      data: data || {},
      timeout: TIMEOUT,
      success: (response) => {
        const res = response.data
        if ([110002, 110003, 110004].indexOf(res?.status) !== -1) {
          // 登录状态失效，显示友好提示并跳转到登录页面
          const loginMsg =
            res?.status === 110002
              ? i18n.t(`登录已过期，即将跳转到登录页面`)
              : res?.msg

          // 防止重复弹窗
          if (!isShowingLoginModal) {
            isShowingLoginModal = true
            uni.showModal({
              title: i18n.t(`提示`),
              content: loginMsg,
              showCancel: false,
              confirmText: i18n.t(`确定`),
              success: () => {
                // 用户点击确定后跳转
                isShowingLoginModal = false
                toLogin()
              },
              fail: () => {
                // 如果弹窗失败，也要重置状态
                isShowingLoginModal = false
                toLogin()
              }
            })
          }

          // 返回明确的登录提示，避免误导用户
          // 添加特殊标识，让页面知道这是登录失效错误
          reject({
            ...res.data,
            msg: loginMsg,
            isLoginError: true, // 标识这是登录相关错误
            needLogin: true // 标识需要登录
          })
        } else if (res.data?.status == 100103) {
          uni.showModal({
            title: i18n.t(`提示`),
            content: res.data.msg,
            showCancel: false,
            confirmText: i18n.t(`我知道了`)
          })
          return
        }
        const isSuccess =
          res?.status === 200 ||
          res.data?.status === 200 ||
          (res?.status === undefined && res?.data && Array.isArray(res?.data)) // 无状态但data为数组的情况
        if (isSuccess || noVerify) {
          resolve(res, response) // 统一使用正确的resolve
        }
        if (res?.status === 400 || res?.data?.status === 400) {
          // 4. 处理错误状态（包含400等其他错误）
          // 优先取具体错误信息，无则使用默认提示
          const errorMsg = res.msg || res.data?.msg || i18n.t('系统错误')
          uni.showToast({
            title: errorMsg,
            icon: 'none'
          })
          resolve({
            ...res,
            status: res?.status,
            code: res?.code || res?.status,
            msg: res.msg || res.data?.msg || i18n.t('系统错误'),
            message: res.msg || res.data?.msg || i18n.t('系统错误')
          })
        }
        // else {
        //   // 对于其他错误状态码，保留完整的错误信息
        //   reject({
        //     ...res.data,
        //     status: res.data.status,
        //     code: res.data.code || res.data.status,
        //     msg: res.data.msg || i18n.t(`系统错误`),
        //     message: res.data.msg || i18n.t(`系统错误`)
        //   })
        // }
      },
      fail: () => {
        let data = {
          mag: i18n.t(`请求失败`),
          status: 1 //1没网
        }
        // #ifdef APP-PLUS
        reject(data)
        // #endif
        // #ifndef APP-PLUS
        reject(i18n.t(`请求失败`))
        // #endif
      }
    })
  })
}

const request = {}

;[
  'options',
  'get',
  'post',
  'put',
  'head',
  'delete',
  'trace',
  'connect'
].forEach((method) => {
  request[method] = (api, data, opt) =>
    baseRequest(api, method, data, opt || {})
})

export default request
