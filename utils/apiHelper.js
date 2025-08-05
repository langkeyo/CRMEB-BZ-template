/**
 * API响应处理工具
 * 统一处理API调用的成功/失败情况，避免显示技术性信息给用户
 */

/**
 * 处理API响应
 * @param {Object} response - API响应
 * @returns {Object} 标准化的结果对象
 */
export function handleApiResponse(response) {
	let status, message, data;

	// console.log('API响应原始数据:', response);

	// 优先检查嵌套的data.status（购物车API的情况）
	if (response.data && typeof response.data === 'object' && response.data.status !== undefined) {
		status = response.data.status;
		message = response.data.msg || '';
		data = response.data;
		// console.log('检测到嵌套状态码:', status);
	}
	// 检查顶层status
	else if (response.status !== undefined) {
		status = response.status;
		message = response.msg || response.message || '';
		data = response.data;
	}
	// 特殊处理：如果有data数组且数组不为空，优先认为是成功的
	else if (response.data && Array.isArray(response.data) && response.data.length > 0) {
		status = 200; // 有数据就认为成功
		message = ''; // 忽略警告信息
		data = response.data;
		// console.log('检测到有效数据，忽略警告信息');
	}
	// 只有data字段，且没有错误消息，认为是成功响应
	else if (response.data !== undefined && !response.msg) {
		status = 200;
		message = '';
		data = response.data;
	}
	// 兜底处理
	else {
		status = response.status || 200;
		message = response.msg || response.message || '';
		data = response.data;
	}

	const result = {
		success: status === 200,
		status,
		message,
		data,
		isEmpty: !data || (Array.isArray(data) && data.length === 0)
	};

	// console.log('处理后的结果:', result);
	return result;
}

/**
 * 显示API操作结果
 * @param {Object} result - 处理后的结果对象
 * @param {Object} options - 显示选项
 * @param {string} options.successMsg - 成功消息
 * @param {string} options.errorMsg - 失败消息
 * @param {string} options.emptyMsg - 空数据消息
 * @param {boolean} options.showSuccess - 是否显示成功提示
 * @param {boolean} options.showEmpty - 是否显示空数据提示
 */
export function showApiResult(result, options = {}) {
	const {
		successMsg = '操作成功',
		errorMsg = '操作失败',
		emptyMsg = '暂无数据',
		showSuccess = true,
		showEmpty = false
	} = options;

	if (result.success) {
		// 数据为空的情况
		if (result.isEmpty && showEmpty) {
			uni.showToast({
				title: emptyMsg,
				icon: 'none',
				duration: 2000
			});
		}
		// 成功且有数据，且不是技术性的"success"消息
		else if (showSuccess && result.message && result.message !== 'success') {
			uni.showToast({
				title: result.message || successMsg,
				icon: 'success',
				duration: 2000
			});
		}
	} else {
		// 处理登录状态
		if (result.status === 110002) {
			uni.showToast({
				title: '请先登录',
				icon: 'none'
			});
			setTimeout(() => {
				uni.navigateTo({
					url: '/pages/login/index'
				});
			}, 1500);
		} else {
			uni.showToast({
				title: result.message || errorMsg,
				icon: 'none'
			});
		}
	}
}

/**
 * 静默处理API结果（只处理登录跳转，不显示提示）
 * @param {Object} result - 处理后的结果对象
 * @returns {boolean} 是否成功
 */
export function handleApiSilently(result) {
	// 只处理登录状态，不显示其他提示
	if (!result.success && result.status === 110002) {
		setTimeout(() => {
			uni.navigateTo({
				url: '/pages/login/index'
			});
		}, 1000);
	}
	return result.success;
}

/**
 * 处理列表类API（如商品列表、推荐商品等）
 * @param {Object} response - API响应
 * @param {Object} options - 处理选项
 * @param {boolean} options.showErrorToast - 是否显示错误提示
 * @returns {Object} 处理结果
 */
export function handleListApi(response, options = {}) {
	const {
		showErrorToast = false
	} = options;

	const result = handleApiResponse(response);

	// 列表类API完全静默处理成功情况
	if (result.success) {
		// 成功时什么都不显示，包括空数据
		return result;
	} else {
		// 错误情况的处理
		if (result.status === 110002) {
			// 未登录，静默跳转
			handleApiSilently(result);
		} else if (showErrorToast) {
			// 只有明确要求显示错误时才显示
			uni.showToast({
				title: result.message || '获取数据失败',
				icon: 'none'
			});
		}
	}

	return result;
}

/**
 * 处理操作类API（如添加购物车、删除等）
 * @param {Object} response - API响应
 * @param {Object} options - 处理选项
 * @returns {Object} 处理结果
 */
export function handleActionApi(response, options = {}) {
	const {
		successMsg = '操作成功',
		errorMsg = '操作失败'
	} = options;

	const result = handleApiResponse(response);
	
	showApiResult(result, {
		successMsg,
		errorMsg,
		showSuccess: true,
		showEmpty: false
	});

	return result;
}

/**
 * 创建API调用包装器
 * @param {Function} apiFunction - API函数
 * @param {Object} defaultOptions - 默认选项
 * @returns {Function} 包装后的API函数
 */
export function createApiWrapper(apiFunction, defaultOptions = {}) {
	return async function(...args) {
		try {
			const response = await apiFunction(...args);
			const result = handleApiResponse(response);
			
			// 根据API类型选择处理方式
			if (defaultOptions.type === 'list') {
				return handleListApi(response, defaultOptions);
			} else if (defaultOptions.type === 'action') {
				return handleActionApi(response, defaultOptions);
			} else {
				// 默认静默处理
				handleApiSilently(result);
				return result;
			}
		} catch (error) {
			const result = handleApiResponse(error);
			
			if (defaultOptions.type === 'action') {
				showApiResult(result, {
					errorMsg: defaultOptions.errorMsg || '操作失败'
				});
			}
			
			return result;
		}
	};
}

/**
 * 常用的API处理预设
 */
export const ApiPresets = {
	// 商品列表类
	productList: {
		type: 'list',
		emptyMsg: '暂无商品',
		showEmptyToast: false
	},
	
	// 购物车操作类
	cartAction: {
		type: 'action',
		successMsg: '操作成功',
		errorMsg: '操作失败'
	},
	
	// 静默获取数据类
	silentFetch: {
		type: 'silent'
	}
};
