import request from '@/utils/request.js';

/**
 * 团购购物车API模块
 * 基于API文档：api-doc/modules/购物车API.md
 */

/**
 * 1. 获取购物车信息
 * @description 获取用户购物车中的商品列表
 * @returns {Promise} API响应
 */
export function getGroupCart() {
	return request.get('group/cart/get');
}

/**
 * 2. 添加/更新商品到购物车
 * @description 添加商品到购物车或更新商品数量
 * @param {Object} data - 请求参数
 * @param {string} data.goods_id - 商品ID
 * @param {string} data.quantity - 商品数量（正数增加，负数减少）
 * @returns {Promise} API响应
 */
export function updateGroupCart(data) {
	return request.post('group/cart/update', data);
}

/**
 * 3. 从购物车移除商品
 * @description 从购物车中删除指定商品
 * @param {Object} data - 请求参数
 * @param {string} data.cart_ids - 购物车商品ID，多个用逗号分隔
 * @returns {Promise} API响应
 */
export function removeGroupCartItem(data) {
	return request.post('group/cart/remove', data);
}

/**
 * 4. 购物车结算
 * @description 对选中的购物车商品进行结算
 * @param {Object} data - 请求参数
 * @param {string} data.cart_ids - 购物车项ID列表，逗号分隔
 * @param {number} data.coupon_id - 优惠券ID（可选）
 * @returns {Promise} API响应
 */
export function checkoutCart(data) {
	return request.post('group/cart/checkout', data);
}

/**
 * 获取购物车数量（用于底部导航栏显示）
 * @returns {Promise} 购物车数量
 */
export function getGroupCartCount() {
	return getGroupCart().then(response => {
		const result = GroupCartManager.handleResponse(response);
		if (result.success && result.data) {
			// 根据实际API返回的数据结构计算总数量
			const cartItems = Array.isArray(result.data) ? result.data : [];
			return cartItems.reduce((total, item) => {
				return total + (item.quantity || 0);
			}, 0);
		}
		return 0;
	}).catch(() => 0); // 静默失败，返回0
}

/**
 * 更新Vuex中的购物车数量
 * @returns {Promise} 更新结果
 */
export async function updateStoreCartNum() {
	try {
		const count = await getGroupCartCount();
		// 获取Vue实例
		const app = getApp();
		if (app && app.$store) {
			app.$store.dispatch("indexData/setCartnumber", count);
		}
		return count;
	} catch (error) {
		console.error('更新购物车数量失败:', error);
		return 0;
	}
}

/**
 * 购物车操作工具类
 */
export class GroupCartManager {
	/**
	 * 获取购物车
	 */
	static async getCart() {
		try {
			const response = await getGroupCart();
			return response;
		} catch (error) {
			console.error('获取购物车失败:', error);
			throw error;
		}
	}

	/**
	 * 添加商品到购物车
	 * @param {string|number} goodsId - 商品ID
	 * @param {string|number} quantity - 数量
	 */
	static async addToCart(goodsId, quantity = 1) {
		try {
			const response = await updateGroupCart({
				goods_id: goodsId.toString(),
				quantity: quantity.toString()
			});

			// 特殊处理：检查是否包含成功信息
			if ((response.status === 200) ||
					(response.data && response.data.status === 200)) {
				// 这是一个成功的响应，即使有错误消息
				console.log('添加购物车成功:', response);
				// 添加成功后更新购物车数量
				await updateStoreCartNum();
				return response;
			}

			return response;
		} catch (error) {
			// 增强的错误处理：检查错误对象中可能包含的成功响应
			console.log('添加购物车捕获到异常，详细信息:', JSON.stringify(error));
			
			// 检查嵌套的成功状态
			if (error && error.data && error.data.status === 200) {
				console.log('添加购物车成功(从错误对象中提取):', error);
				// 构建一个新的成功响应对象，确保外层状态码也是200
				// 添加成功后更新购物车数量
				await updateStoreCartNum();
				return {
					status: 200,
					data: error.data,
					msg: error.data.msg || '商品已添加到购物车'
				};
			}
			
			// 检查错误对象中的其他成功指示
			if (error && error.data && 
				(error.data.msg && (error.data.msg.includes('已添加') || 
								  error.data.msg.includes('更新') || 
								  error.data.msg.includes('成功')))) {
				console.log('添加购物车成功(从错误消息中判断):', error);
				// 构建一个新的成功响应对象
				// 添加成功后更新购物车数量
				await updateStoreCartNum();
				return {
					status: 200,
					data: error.data,
					msg: error.data.msg
				};
			}

			console.error('添加购物车失败:', error);
			throw error;
		}
	}

	/**
	 * 更新商品数量
	 * @param {string|number} goodsId - 商品ID
	 * @param {string|number} quantity - 新数量
	 */
	static async updateQuantity(goodsId, quantity) {
		try {
			const response = await updateGroupCart({
				goods_id: goodsId.toString(),
				quantity: quantity.toString()
			});
			// 更新成功后更新购物车数量
			await updateStoreCartNum();
			return response;
		} catch (error) {
			// 检查是否是真正的错误
			const result = GroupCartManager.handleResponse(error);
			if (!result.success) {
				console.error('更新数量失败:', error);
			} else {
				// 更新成功后更新购物车数量
				await updateStoreCartNum();
			}
			throw error;
		}
	}

	/**
	 * 增加商品数量
	 * @param {string|number} goodsId - 商品ID
	 * @param {string|number} increment - 增加的数量
	 */
	static async increaseQuantity(goodsId, increment = 1) {
		try {
			const response = await updateGroupCart({
				goods_id: goodsId.toString(),
				quantity: `+${increment}`
			});
			return response;
		} catch (error) {
			console.error('增加数量失败:', error);
			throw error;
		}
	}

	/**
	 * 减少商品数量
	 * @param {string|number} goodsId - 商品ID
	 * @param {string|number} decrement - 减少的数量
	 */
	static async decreaseQuantity(goodsId, decrement = 1) {
		try {
			const response = await updateGroupCart({
				goods_id: goodsId.toString(),
				quantity: `-${decrement}`
			});
			return response;
		} catch (error) {
			console.error('减少数量失败:', error);
			throw error;
		}
	}

	/**
	 * 删除商品
	 * @param {string|Array} cartIds - 购物车ID，可以是单个ID或ID数组
	 */
	static async removeItem(cartIds) {
		try {
			// 处理数组或单个ID
			const idsString = Array.isArray(cartIds) ? cartIds.join(',') : cartIds.toString();
			const response = await removeGroupCartItem({
				cart_ids: idsString
			});

			// 特殊处理：检查是否包含成功信息
			if ((response.status === 200) ||
					(response.data && response.data.status === 200) ||
					(response.data && response.data.success_count !== undefined)) {
				// 这是一个成功的响应，即使有错误消息
				console.log('删除商品成功:', response);
				// 删除成功后更新购物车数量
				await updateStoreCartNum();
				return response;
			}

			return response;
		} catch (error) {
			// 特殊处理：检查错误对象中可能包含的成功响应
			if ((error && error.status === 200) ||
					(error && error.data && error.data.status === 200) ||
					(error && error.data && error.data.success_count !== undefined)) {
				// 这是一个成功的响应，但被当作错误处理了
				console.log('删除商品成功(从错误对象中提取):', error);
				// 删除成功后更新购物车数量
				await updateStoreCartNum();
				return error; // 返回错误对象作为成功响应
			}

			console.error('删除商品失败:', error);
			throw error;
		}
	}

	/**
	 * 购物车结算
	 * @param {Array} cartIds - 购物车项ID数组
	 * @param {number} couponId - 优惠券ID
	 */
	static async checkout(cartIds, couponId = 0) {
		try {
			const response = await checkoutCart({
				cart_ids: cartIds.join(','),
				coupon_id: couponId
			});
			return response;
		} catch (error) {
			console.error('购物车结算失败:', error);
			throw error;
		}
	}

	/**
	 * 处理API响应
	 * @param {Object} response - API响应
	 * @returns {Object} 处理后的结果
	 */
	static handleResponse(response) {
		// 处理不同的响应格式
		let status, msg, data;

		// console.log('API响应原始数据:', response);

		// 特殊处理：添加购物车的成功响应
		if (response.data && response.data.msg && response.data.msg.includes('已添加到购物车')) {
			status = 200; // 明确是添加购物车成功的消息
			msg = response.data.msg;
			data = response.data;
			// console.log('检测到添加购物车的成功响应');
		}
		// 特殊处理：删除购物车商品的成功响应
		else if (response.data && response.data.success_count !== undefined) {
			status = 200; // 有成功删除的商品就认为成功
			msg = response.data.msg || `批量删除完成：成功${response.data.success_count}个，失败${response.data.fail_count || 0}个`;
			data = response.data;
			// console.log('检测到删除购物车商品的成功响应');
		}
		// 优先检查嵌套的data.status（购物车API的情况）
		else if (response.data && typeof response.data === 'object' && response.data.status !== undefined) {
			status = response.data.status;
			msg = response.data.msg || '';
			data = response.data;
			// console.log('检测到嵌套状态码:', status);
		}
		// 检查顶层status
		else if (response.status !== undefined) {
			status = response.status;
			msg = response.msg || response.message || '';
			data = response.data;
		}
		// 特殊处理：如果有data数组且数组不为空，优先认为是成功的
		else if (response.data && Array.isArray(response.data) && response.data.length > 0) {
			status = 200; // 有数据就认为成功
			msg = ''; // 忽略警告信息
			data = response.data;
			// console.log('检测到有效数据，忽略警告信息');
		}
		// 只有data字段，且没有错误消息，认为是成功响应
		else if (response.data !== undefined && !response.msg) {
			status = 200;
			msg = '';
			data = response.data;
		}
		// 兜底处理
		else {
			status = response.status || 200;
			msg = response.msg || response.message || '';
			data = response.data;
		}

		const result = {
			success: status === 200,
			status,
			message: msg,
			data
		};

		// console.log('处理后的结果:', result);
		return result;
	}

	/**
	 * 显示操作结果
	 * @param {Object} result - 操作结果
	 * @param {string} successMsg - 成功消息
	 * @param {string} errorMsg - 失败消息
	 * @param {boolean} showSuccessToast - 是否显示成功提示，默认true
	 */
	static showResult(result, successMsg = '操作成功', errorMsg = '操作失败', showSuccessToast = true) {
		if (result.success) {
			// 只有明确需要显示成功提示时才显示
			if (showSuccessToast && result.message && result.message !== 'success') {
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
	 * 静默处理结果（不显示任何提示）
	 * @param {Object} result - 操作结果
	 * @returns {boolean} 是否成功
	 */
	static handleSilently(result) {
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
}
