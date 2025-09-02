// +----------------------------------------------------------------------
// | CRMEB [ CRMEB赋能开发者，助力企业发展 ]
// +----------------------------------------------------------------------
// | Copyright (c) 2016~2024 https://www.crmeb.com All rights reserved.
// +----------------------------------------------------------------------
// | Licensed CRMEB并不是自由软件，未经许可不能去掉CRMEB相关版权
// +----------------------------------------------------------------------
// | Author: CRMEB Team <admin@crmeb.com>
// +----------------------------------------------------------------------

import {
	getUserInfo
} from "../../api/user.js";
import {
	LOGIN_STATUS,
	UID,
	USER_INFO,
	SITE_INFO
} from '../../config/cache';
import Cache from '../../utils/cache';

const state = {
	token: Cache.get(LOGIN_STATUS) || false,
	backgroundColor: "#fff",
	userInfo: {},
	uid: Cache.get(UID) || 0,
	homeActive: false,
	phoneStatus: true,
	pageFooter: uni.getStorageSync('pageFoot') || {},
	activityTab: '',
	// 站点信息
	siteInfo: Cache.get(SITE_INFO) || {
		name: '',
		location: '',
		deliveryTime: '',
		type: ''
	}
};

const mutations = {
	SETPHONESTATUS(state, val) {
		state.phoneStatus = val;
	},
	LOGIN(state, opt) {
		state.token = opt.token;
		Cache.set(LOGIN_STATUS, opt.token, opt.time);
	},
	SETUID(state, val) {
		state.uid = val;
		Cache.set(UID, val);
	},
	UPDATE_LOGIN(state, token) {
		state.token = token;
	},
	ACTIVITYTAB(state, tab) {
		state.activityTab = tab;
	},
	LOGOUT(state) {
		state.token = false;
		state.uid = 0
		Cache.clear(LOGIN_STATUS);
		Cache.clear(USER_INFO);
		Cache.clear(UID);
		Cache.clear('snsapiCode');
	},
	BACKGROUND_COLOR(state, color) {
		state.color = color;
		document.body.style.backgroundColor = color;
	},
	UPDATE_USERINFO(state, userInfo) {
		state.userInfo = userInfo;
		Cache.set(USER_INFO, userInfo);
	},
	OPEN_HOME(state) {
		state.homeActive = true;
	},
	CLOSE_HOME(state) {
		state.homeActive = false;
	},
	FOOT_UPLOAD(state, data) {
		state.pageFooter = data
	},
	// 更新站点信息
	UPDATE_SITEINFO(state, siteInfo) {
		state.siteInfo = siteInfo;
		Cache.set(SITE_INFO, siteInfo, 0); // 0表示永不过期
	}
};

const actions = {

	USERINFO({
		state,
		commit
	}, force) {
		if (state.userInfo !== null && !force)
			return Promise.resolve(state.userInfo);
		else
			return new Promise(reslove => {
				getUserInfo().then(res => {
					commit("UPDATE_USERINFO", res.data);
					Cache.set(USER_INFO, res.data);
					reslove(res.data);
				});
			}).catch(() => {

			});
	},

	// 全局刷新用户信息
	REFRESH_USERINFO({
		state,
		commit
	}) {
		return new Promise((resolve, reject) => {
			if (!state.token) {
				// 未登录状态，清空用户信息
				commit("UPDATE_USERINFO", {});
				resolve({});
				return;
			}

			getUserInfo().then(res => {
				commit("UPDATE_USERINFO", res.data);
				Cache.set(USER_INFO, res.data);
				// console.log('全局用户信息已刷新:', res.data);
				resolve(res.data);
			}).catch(error => {
				console.error('刷新用户信息失败:', error);
				// 如果是登录相关错误，清空用户信息
				if (error && (error.status === 110002 || error.isLoginError)) {
					commit("UPDATE_USERINFO", {});
					commit("LOGOUT");
				}
				reject(error);
			});
		});
	},

	// 登录后自动获取用户信息
	LOGIN_AND_GET_INFO({
		state,
		commit,
		dispatch
	}, loginData) {
		return new Promise((resolve, reject) => {
			// 先设置登录状态
			commit('LOGIN', loginData);
			commit('SETUID', loginData.uid || 0);

			// 然后获取用户信息
			dispatch('REFRESH_USERINFO').then(userInfo => {
				resolve({
					loginData,
					userInfo
				});
			}).catch(error => {
				console.error('登录后获取用户信息失败:', error);
				// 即使获取用户信息失败，登录状态仍然有效
				resolve({
					loginData,
					userInfo: {}
				});
			});
		});
	},
	
	// 设置站点信息
	SET_SITEINFO({ commit }, siteInfo) {
		commit('UPDATE_SITEINFO', siteInfo);
	}
};

export default {
	state,
	mutations,
	actions
};
