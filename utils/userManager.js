// +----------------------------------------------------------------------
// | CRMEB [ CRMEB赋能开发者，助力企业发展 ]
// +----------------------------------------------------------------------
// | Copyright (c) 2016~2024 https://www.crmeb.com All rights reserved.
// +----------------------------------------------------------------------
// | Licensed CRMEB并不是自由软件，未经许可不能去掉CRMEB相关版权
// +----------------------------------------------------------------------
// | Author: CRMEB Team <admin@crmeb.com>
// +----------------------------------------------------------------------

import store from '@/store'
import { checkLogin } from '@/libs/login'

/**
 * 全局用户信息管理工具
 */
export class UserManager {
    
    // 用户信息刷新间隔（毫秒）
    static REFRESH_INTERVAL = 5 * 60 * 1000; // 5分钟
    
    // 定时器ID
    static refreshTimer = null;
    
    // 是否正在刷新
    static isRefreshing = false;
    
    // 上次刷新时间
    static lastRefreshTime = 0;
    
    /**
     * 初始化用户管理器
     * 在App.vue的onLaunch中调用
     */
    static init() {
        // console.log('UserManager: 初始化用户管理器');

        // 检查登录状态并获取用户信息
        this.checkAndRefreshUserInfo();

        // 启动定时刷新
        this.startAutoRefresh();

        // 监听登录状态变化
        this.watchLoginStatus();
    }
    
    /**
     * 检查登录状态并刷新用户信息
     */
    static async checkAndRefreshUserInfo() {
        if (checkLogin()) {
            // console.log('UserManager: 用户已登录，刷新用户信息');
            await this.refreshUserInfo();
        } else {
            // console.log('UserManager: 用户未登录，清空用户信息');
            this.clearUserInfo();
        }
    }
    
    /**
     * 刷新用户信息
     * @param {boolean} force 是否强制刷新
     * @returns {Promise}
     */
    static async refreshUserInfo(force = false) {
        // 防止重复刷新
        if (this.isRefreshing && !force) {
            // console.log('UserManager: 正在刷新中，跳过本次刷新');
            return;
        }

        // 检查刷新间隔
        const now = Date.now();
        if (!force && (now - this.lastRefreshTime) < 30000) { // 30秒内不重复刷新
            // console.log('UserManager: 刷新间隔太短，跳过本次刷新');
            return;
        }

        this.isRefreshing = true;
        this.lastRefreshTime = now;

        try {
            // console.log('UserManager: 开始刷新用户信息');
            const userInfo = await store.dispatch('REFRESH_USERINFO');
            // console.log('UserManager: 用户信息刷新成功', userInfo);
            
            // 触发全局事件
            uni.$emit('userInfoUpdated', userInfo);
            
            return userInfo;
        } catch (error) {
            console.error('UserManager: 用户信息刷新失败', error);
            throw error;
        } finally {
            this.isRefreshing = false;
        }
    }
    
    /**
     * 清空用户信息
     */
    static clearUserInfo() {
        // console.log('UserManager: 清空用户信息');
        store.commit('UPDATE_USERINFO', {});
        uni.$emit('userInfoCleared');
    }
    
    /**
     * 启动自动刷新
     */
    static startAutoRefresh() {
        // 清除之前的定时器
        this.stopAutoRefresh();
        
        // console.log('UserManager: 启动自动刷新，间隔:', this.REFRESH_INTERVAL / 1000, '秒');

        this.refreshTimer = setInterval(() => {
            if (checkLogin()) {
                // console.log('UserManager: 定时刷新用户信息');
                this.refreshUserInfo();
            }
        }, this.REFRESH_INTERVAL);
    }
    
    /**
     * 停止自动刷新
     */
    static stopAutoRefresh() {
        if (this.refreshTimer) {
            // console.log('UserManager: 停止自动刷新');
            clearInterval(this.refreshTimer);
            this.refreshTimer = null;
        }
    }
    
    /**
     * 监听登录状态变化
     */
    static watchLoginStatus() {
        // 监听登录事件
        uni.$on('userLogin', (loginData) => {
            // console.log('UserManager: 监听到用户登录事件', loginData);
            this.onUserLogin(loginData);
        });

        // 监听登出事件
        uni.$on('userLogout', () => {
            // console.log('UserManager: 监听到用户登出事件');
            this.onUserLogout();
        });

        // 监听页面显示事件（从后台切换回来时刷新）
        uni.$on('appShow', () => {
            // console.log('UserManager: 应用从后台切换回来，检查用户信息');
            this.checkAndRefreshUserInfo();
        });
    }
    
    /**
     * 用户登录后的处理
     * @param {Object} loginData 登录数据
     */
    static async onUserLogin(loginData) {
        try {
            // 使用新的登录action
            const result = await store.dispatch('LOGIN_AND_GET_INFO', loginData);
            // console.log('UserManager: 登录并获取用户信息成功', result);
            
            // 重启自动刷新
            this.startAutoRefresh();
            
            // 触发登录成功事件
            uni.$emit('loginSuccess', result);
            
        } catch (error) {
            console.error('UserManager: 登录后处理失败', error);
        }
    }
    
    /**
     * 用户登出后的处理
     */
    static onUserLogout() {
        // 停止自动刷新
        this.stopAutoRefresh();
        
        // 清空用户信息
        this.clearUserInfo();
        
        // 清空登录状态
        store.commit('LOGOUT');
        
        // console.log('UserManager: 用户登出处理完成');
    }
    
    /**
     * 获取当前用户信息
     * @param {boolean} refresh 是否刷新
     * @returns {Object} 用户信息
     */
    static async getUserInfo(refresh = false) {
        if (refresh || !store.state.app.userInfo || Object.keys(store.state.app.userInfo).length === 0) {
            if (checkLogin()) {
                return await this.refreshUserInfo(true);
            } else {
                return {};
            }
        }
        
        return store.state.app.userInfo;
    }
    
    /**
     * 检查用户是否已登录
     * @returns {boolean}
     */
    static isLoggedIn() {
        return checkLogin() && store.state.app.token;
    }
    
    /**
     * 销毁用户管理器
     * 在应用退出时调用
     */
    static destroy() {
        // console.log('UserManager: 销毁用户管理器');
        
        // 停止自动刷新
        this.stopAutoRefresh();
        
        // 移除事件监听
        uni.$off('userLogin');
        uni.$off('userLogout');
        uni.$off('appShow');
    }
}

/**
 * 全局混入，为所有页面提供用户信息管理功能
 */
export const userManagerMixin = {
    data() {
        return {
            // 用户信息加载状态
            userInfoLoading: false
        };
    },
    
    computed: {
        // 当前用户信息
        currentUserInfo() {
            return this.$store.state.app.userInfo || {};
        },
        
        // 是否已登录
        isUserLoggedIn() {
            return UserManager.isLoggedIn();
        }
    },
    
    methods: {
        // 刷新用户信息
        async refreshCurrentUserInfo(force = false) {
            this.userInfoLoading = true;
            try {
                const userInfo = await UserManager.refreshUserInfo(force);
                return userInfo;
            } catch (error) {
                console.error('页面刷新用户信息失败:', error);
                throw error;
            } finally {
                this.userInfoLoading = false;
            }
        },
        
        // 获取用户信息
        async getCurrentUserInfo(refresh = false) {
            return await UserManager.getUserInfo(refresh);
        }
    },
    
    // 页面显示时检查用户信息
    onShow() {
        if (this.isUserLoggedIn && (!this.currentUserInfo || Object.keys(this.currentUserInfo).length === 0)) {
            // console.log('页面显示时检测到用户信息缺失，自动刷新');
            UserManager.refreshUserInfo();
        }
    }
};

// 默认导出
export default UserManager;
