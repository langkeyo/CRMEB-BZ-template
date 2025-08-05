// +----------------------------------------------------------------------
// | CRMEB [ CRMEB赋能开发者，助力企业发展 ]
// +----------------------------------------------------------------------
// | Copyright (c) 2016~2024 https://www.crmeb.com All rights reserved.
// +----------------------------------------------------------------------
// | Licensed CRMEB并不是自由软件，未经许可不能去掉CRMEB相关版权
// +----------------------------------------------------------------------
// | Author: CRMEB Team <admin@crmeb.com>
// +----------------------------------------------------------------------

import errorHandler from '@/utils/errorHandler.js';

/**
 * 错误处理混入
 * 为所有页面提供统一的错误处理方法
 */
export default {
	methods: {
		/**
		 * 处理API请求错误
		 * @param {Object|String} error - 错误对象或错误信息
		 * @param {Object} options - 配置选项
		 */
		$handleError(error, options = {}) {
			return errorHandler.handleApiError(error, options);
		},

		/**
		 * 处理网络错误
		 * @param {Object} options - 配置选项
		 */
		$handleNetworkError(options = {}) {
			return errorHandler.handleNetworkError(options);
		},

		/**
		 * 检查是否为登录相关错误
		 * @param {Object} error - 错误对象
		 * @returns {Boolean}
		 */
		$isLoginError(error) {
			return errorHandler.isLoginError(error);
		},

		/**
		 * 获取友好的错误信息
		 * @param {Object|String} error - 错误对象或错误信息
		 * @param {String} defaultMsg - 默认错误信息
		 * @returns {String}
		 */
		$getFriendlyErrorMsg(error, defaultMsg) {
			return errorHandler.getFriendlyErrorMsg(error, defaultMsg);
		},

		/**
		 * 安全的API调用包装器
		 * @param {Promise} apiCall - API调用Promise
		 * @param {Object} options - 配置选项
		 * @param {String} options.loadingText - 加载提示文字
		 * @param {String} options.errorMsg - 错误提示信息
		 * @param {Boolean} options.showLoading - 是否显示加载提示
		 * @param {Boolean} options.silent - 是否静默处理错误
		 * @returns {Promise}
		 */
		async $safeApiCall(apiCall, options = {}) {
			const {
				loadingText = '加载中...',
				errorMsg = '操作失败，请稍后重试',
				showLoading = false,
				silent = false
			} = options;

			try {
				if (showLoading) {
					uni.showLoading({ title: loadingText });
				}

				const result = await apiCall;
				
				if (showLoading) {
					uni.hideLoading();
				}

				return result;
			} catch (error) {
				if (showLoading) {
					uni.hideLoading();
				}

				// 使用统一的错误处理
				this.$handleError(error, {
					defaultMsg: errorMsg,
					silent: silent
				});

				throw error; // 重新抛出错误，让调用方可以进一步处理
			}
		}
	}
};
