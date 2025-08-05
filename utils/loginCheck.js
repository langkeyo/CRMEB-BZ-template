/**
 * 登录状态检查工具
 */

import {
  LOGIN_STATUS,
  UID,
  USER_INFO
} from '@/config/cache.js'

/**
 * 检查用户是否已登录
 * @returns {boolean} 是否已登录
 */
export function checkLoginStatus() {
  try {
    const token = uni.getStorageSync(LOGIN_STATUS);
    const uid = uni.getStorageSync(UID);

    // 检查token和UID是否存在
    return !!(token && uid);
  } catch (e) {
    console.error('检查登录状态失败:', e);
    return false;
  }
}

/**
 * 需要登录时的处理逻辑
 * @param {string} redirectUrl - 登录成功后要跳转的页面
 * @param {string} message - 提示消息，默认为"请先登录"
 */
export function requireLogin(redirectUrl = '', message = '请先登录') {
  uni.showToast({
    title: message,
    icon: 'none',
    duration: 1500
  });
  
  setTimeout(() => {
    const loginUrl = redirectUrl 
      ? `/pages/users/login/index?redirect=${encodeURIComponent(redirectUrl)}`
      : '/pages/users/login/index';
      
    uni.navigateTo({
      url: loginUrl,
      fail: (err) => {
        console.error('跳转登录页面失败:', err);
        // 如果navigateTo失败，尝试使用switchTab（如果登录页是tabBar页面）
        uni.switchTab({
          url: '/pages/users/login/index',
          fail: (err2) => {
            console.error('跳转登录页面失败:', err2);
          }
        });
      }
    });
  }, 1500);
}

/**
 * 检查登录状态并执行相应操作
 * @param {Function} successCallback - 已登录时执行的回调
 * @param {string} redirectUrl - 未登录时登录成功后要跳转的页面
 * @param {string} message - 未登录时的提示消息
 */
export function checkLoginAndExecute(successCallback, redirectUrl = '', message = '请先登录') {
  if (checkLoginStatus()) {
    // 已登录，执行成功回调
    if (typeof successCallback === 'function') {
      successCallback();
    }
  } else {
    // 未登录，跳转到登录页面
    requireLogin(redirectUrl, message);
  }
}

/**
 * 在线咨询专用的登录检查
 * 检查登录状态，如果已登录则跳转到在线咨询页面，否则跳转到登录页面
 */
export function startOnlineConsultationWithLogin() {
  checkLoginAndExecute(
    () => {
      // 已登录，跳转到在线咨询页面
      uni.navigateTo({
        url: '/pages/users/online_chat/index',
        fail: (err) => {
          console.error('跳转在线咨询页面失败:', err);
          uni.showToast({
            title: '页面跳转失败',
            icon: 'none'
          });
        }
      });
    },
    '/pages/users/online_chat/index',
    '在线咨询需要登录，请先登录'
  );
}

/**
 * 获取用户信息
 * @returns {Object|null} 用户信息对象或null
 */
export function getUserInfo() {
  try {
    const userInfo = uni.getStorageSync(USER_INFO);
    return userInfo || null;
  } catch (e) {
    console.error('获取用户信息失败:', e);
    return null;
  }
}

/**
 * 获取用户token
 * @returns {string} 用户token
 */
export function getUserToken() {
  try {
    return uni.getStorageSync(LOGIN_STATUS) || '';
  } catch (e) {
    console.error('获取用户token失败:', e);
    return '';
  }
}

/**
 * 获取用户UID
 * @returns {number} 用户UID
 */
export function getUserUid() {
  try {
    return uni.getStorageSync(UID) || 0;
  } catch (e) {
    console.error('获取用户UID失败:', e);
    return 0;
  }
}

/**
 * 清除登录状态
 */
export function clearLoginStatus() {
  try {
    uni.removeStorageSync(LOGIN_STATUS);
    uni.removeStorageSync(USER_INFO);
    uni.removeStorageSync(UID);
  } catch (e) {
    console.error('清除登录状态失败:', e);
  }
}
