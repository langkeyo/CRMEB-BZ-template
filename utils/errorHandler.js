// +----------------------------------------------------------------------
// | CRMEB [ CRMEB赋能开发者，助力企业发展 ]
// +----------------------------------------------------------------------
// | Copyright (c) 2016~2024 https://www.crmeb.com All rights reserved.
// +----------------------------------------------------------------------
// | Licensed CRMEB并不是自由软件，未经许可不能去掉CRMEB相关版权
// +----------------------------------------------------------------------
// | Author: CRMEB Team <admin@crmeb.com>
// +----------------------------------------------------------------------

import i18n from './lang.js';

/**
 * 统一的错误处理工具
 */
export default {
	/**
	 * 处理API请求错误
	 * @param {Object|String} error - 错误对象或错误信息
	 * @param {Object} options - 配置选项
	 * @param {Boolean} options.showToast - 是否显示Toast提示，默认true
	 * @param {String} options.defaultMsg - 默认错误信息
	 * @param {Boolean} options.silent - 是否静默处理（不显示任何提示），默认false
	 */
	handleApiError(error, options = {}) {
		const {
			showToast = true,
			defaultMsg = i18n.t(`网络错误，请稍后重试`),
			silent = false
		} = options;

		// 如果是静默处理，直接返回
		if (silent) {
			return;
		}

		// 如果是登录相关错误，不显示错误提示（因为request.js中已经显示了提示并跳转）
		if (error && (error.isLoginError || error.needLogin)) {
			console.log('登录状态失效，已显示提示并准备跳转到登录页面');
			return;
		}

		// 获取错误信息
		let errorMsg = '';
		if (typeof error === 'string') {
			errorMsg = error;
		} else if (error && error.msg) {
			errorMsg = error.msg;
		} else if (error && error.message) {
			errorMsg = error.message;
		} else {
			errorMsg = defaultMsg;
		}

		// 显示错误提示
		if (showToast && errorMsg) {
			uni.showToast({
				title: errorMsg,
				icon: 'none',
				duration: 2000
			});
		}

		return errorMsg;
	},

	/**
	 * 处理网络请求失败
	 * @param {Object} options - 配置选项
	 */
	handleNetworkError(options = {}) {
		const {
			showToast = true,
			defaultMsg = i18n.t(`网络连接失败，请检查网络设置`)
		} = options;

		if (showToast) {
			uni.showToast({
				title: defaultMsg,
				icon: 'none',
				duration: 2000
			});
		}

		return defaultMsg;
	},

	/**
	 * 检查是否为登录相关错误
	 * @param {Object} error - 错误对象
	 * @returns {Boolean}
	 */
	isLoginError(error) {
		if (!error) return false;
		
		return !!(error.isLoginError || 
				 error.needLogin || 
				 error.status === 110002 || 
				 error.status === 110003 || 
				 error.status === 110004);
	},

	/**
	 * 获取友好的错误信息
	 * @param {Object|String} error - 错误对象或错误信息
	 * @param {String} defaultMsg - 默认错误信息
	 * @returns {String}
	 */
	getFriendlyErrorMsg(error, defaultMsg = i18n.t(`操作失败，请稍后重试`)) {
		// 如果是登录相关错误
		if (this.isLoginError(error)) {
			return i18n.t(`请先登录`);
		}

		// 获取错误信息
		if (typeof error === 'string') {
			return error;
		} else if (error && error.msg) {
			return error.msg;
		} else if (error && error.message) {
			return error.message;
		}

		return defaultMsg;
	}
};
