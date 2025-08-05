// +----------------------------------------------------------------------
// | CRMEB [ CRMEB赋能开发者，助力企业发展 ]
// +----------------------------------------------------------------------
// | Copyright (c) 2016~2024 https://www.crmeb.com All rights reserved.
// +----------------------------------------------------------------------
// | Licensed CRMEB并不是自由软件，未经许可不能去掉CRMEB相关版权
// +----------------------------------------------------------------------
// | Author: CRMEB Team <admin@crmeb.com>
// +----------------------------------------------------------------------

import { checkLogin } from '@/libs/login'
import store from '@/store'

/**
 * 登录状态处理工具类
 */
export class LoginHandler {
    
    /**
     * 检查是否已登录
     * @returns {boolean} 是否已登录
     */
    static isLoggedIn() {
        return store.state.app.token && checkLogin();
    }
    
    /**
     * 处理API调用错误，特别是登录相关错误
     * @param {Object} error 错误对象
     * @param {string} defaultMessage 默认错误消息
     * @returns {boolean} 是否是登录错误（true表示已处理，false表示需要继续处理）
     */
    static handleApiError(error, defaultMessage = '操作失败') {
        console.error('API调用错误:', error);
        
        // 检查是否是登录相关错误
        if (error && (error.isLoginError || error.needLogin || error.status === 110002)) {
            // 登录相关错误已经由request.js自动处理，这里不需要额外操作
            console.log('登录状态失效，已自动跳转到登录页面');
            return true; // 表示已处理
        }
        
        // 其他错误显示提示
        const message = error?.msg || error?.message || defaultMessage;
        uni.showToast({
            title: message,
            icon: 'none',
            duration: 2000
        });
        
        return false; // 表示不是登录错误
    }
    
    /**
     * 安全的API调用包装器
     * @param {Function} apiCall API调用函数
     * @param {Object} options 选项
     * @param {string} options.loadingText 加载提示文字
     * @param {string} options.errorMessage 错误提示文字
     * @param {boolean} options.showLoading 是否显示加载提示
     * @returns {Promise} API调用结果
     */
    static async safeApiCall(apiCall, options = {}) {
        const {
            loadingText = '加载中...',
            errorMessage = '操作失败',
            showLoading = true
        } = options;
        
        if (showLoading) {
            uni.showLoading({
                title: loadingText,
                mask: true
            });
        }
        
        try {
            const result = await apiCall();
            
            if (showLoading) {
                uni.hideLoading();
            }
            
            return result;
        } catch (error) {
            if (showLoading) {
                uni.hideLoading();
            }
            
            // 使用统一的错误处理
            this.handleApiError(error, errorMessage);
            
            // 重新抛出错误，让调用者可以进一步处理
            throw error;
        }
    }
    
    /**
     * 检查登录状态并执行操作
     * @param {Function} callback 需要登录后执行的回调函数
     * @param {Object} options 选项
     * @param {string} options.loginTip 未登录提示文字
     * @returns {Promise|void}
     */
    static requireLogin(callback, options = {}) {
        const { loginTip = '请先登录' } = options;
        
        if (!this.isLoggedIn()) {
            uni.showToast({
                title: loginTip,
                icon: 'none'
            });
            
            // 延迟跳转到登录页面
            setTimeout(() => {
                uni.navigateTo({
                    url: '/pages/authorization/index'
                });
            }, 1500);
            
            return Promise.reject(new Error('未登录'));
        }
        
        return callback();
    }
    
    /**
     * 批量处理API错误的高阶函数
     * @param {Object} methods 包含多个方法的对象
     * @returns {Object} 包装后的方法对象
     */
    static wrapMethods(methods) {
        const wrappedMethods = {};
        
        Object.keys(methods).forEach(key => {
            const originalMethod = methods[key];
            
            wrappedMethods[key] = async function(...args) {
                try {
                    return await originalMethod.apply(this, args);
                } catch (error) {
                    LoginHandler.handleApiError(error);
                    throw error;
                }
            };
        });
        
        return wrappedMethods;
    }
}

/**
 * 装饰器函数：为方法添加登录状态检查
 * @param {Function} method 原始方法
 * @param {Object} options 选项
 * @returns {Function} 包装后的方法
 */
export function withLoginCheck(method, options = {}) {
    return function(...args) {
        return LoginHandler.requireLogin(() => {
            return method.apply(this, args);
        }, options);
    };
}

/**
 * 装饰器函数：为方法添加错误处理
 * @param {Function} method 原始方法
 * @param {Object} options 选项
 * @returns {Function} 包装后的方法
 */
export function withErrorHandler(method, options = {}) {
    return async function(...args) {
        try {
            return await method.apply(this, args);
        } catch (error) {
            LoginHandler.handleApiError(error, options.errorMessage);
            throw error;
        }
    };
}

// 默认导出
export default LoginHandler;
