// +----------------------------------------------------------------------
// | CRMEB [ CRMEB赋能开发者，助力企业发展 ]
// +----------------------------------------------------------------------
// | Copyright (c) 2016~2024 https://www.crmeb.com All rights reserved.
// +----------------------------------------------------------------------
// | Licensed CRMEB并不是自由软件，未经许可不能去掉CRMEB相关版权
// +----------------------------------------------------------------------
// | Author: CRMEB Team <admin@crmeb.com>
// +----------------------------------------------------------------------

import request from "@/utils/request.js";

/**
 * 获取房屋租售列表
 * @param object data
 */
export function getHouseRentalList(data) {
  return request.get("group/house_rental/list", data, {
    noAuth: true
  });
}

/**
 * 获取房屋租售详情
 * @param int id
 */
export function getHouseRentalInfo(id) {
  return request.get(`group/house_rental/info/${id}`, {}, {
    noAuth: true
  });
}

// 重复声明已删除，使用后面完整参数的reserveHouseRental函数

/**
 * 居间服务申请
 * @param object data
 */
export function applyIntermediary(data) {
  return request.post("group/intermediary/apply", data);
}

/**
 * 团长申请
 * @param object data
 */
export function applyLeader(data) {
  return request.post("group/leader_apply", data);
}

/**
 * 供应商申请
 * @param object data
 */
export function supplierApply(data) {
  return request.post("group/supplier_apply", data);
}

/**
 * 订单相关接口 - 基于API文档
 */

/**
 * 创建团购订单
 * @param {Object} data 订单数据
 * @param {string} data.goods 商品数据JSON字符串
 * @param {string} data.coupon_id 优惠券ID
 */
export function createGroupOrder(data) {
	return request.post("group/order/createOrder", data);
}

/**
 * 计算团购订单
 * @param {Object} data 订单数据
 * @param {string} data.goods 商品数据JSON字符串
 * @param {string} data.coupon_id 优惠券ID
 */
export function computeGroupOrder(data) {
	return request.post("group/order/computedOrder", data);
}

/**
 * 获取团购订单详情
 * @param {string} orderId 订单ID
 */
export function getGroupOrderDetail(orderId) {
	return request.get(`group/order/order_info/${orderId}`);
}

/**
 * 获取团购订单列表
 * @param {Object} data 查询参数
 * @param {string} data.status 订单状态
 */
export function getGroupOrderList(data) {
	return request.post("group/order/order_list", data);
}

/**
 * 团购订单支付
 * @param {string} orderId 订单ID
 */
export function payGroupOrder(orderId) {
	return request.get(`group/order/payOrder/${orderId}`);
}

/**
 * 购物车相关接口 - 基于API文档
 */

/**
 * 获取团购购物车信息
 */
export function getGroupCart() {
	return request.get("group/cart/get");
}

/**
 * 删除团购购物车商品
 * @param {Object} data 删除数据
 * @param {string} data.goods_id 商品ID
 */
export function removeGroupCartItem(data) {
	return request.post("group/cart/remove", data);
}

/**
 * 添加/更新团购购物车商品
 * @param {Object} data 商品数据
 * @param {string} data.goods_id 商品ID
 * @param {string} data.quantity 商品数量(正数增加,负数减少)
 */
export function updateGroupCart(data) {
	return request.post("group/cart/update", data);
}

/**
 * 优惠券相关接口 - 基于API文档
 */

/**
 * 获取可用优惠券列表
 * @param {Object} data 查询参数
 * @param {string} data.name 优惠券名称搜索
 * @param {number} data.type 优惠券类型(1-满减券，2-折扣券)
 * @param {number} data.page 页码
 * @param {number} data.limit 每页数量
 */
export function getAvailableCoupons(data) {
	return request.get("group/coupons/available/list", data, {
		noAuth: true
	});
}

/**
 * 获取优惠券详情
 * @param {number} id 优惠券ID
 */
export function getCouponDetail(id) {
	return request.get(`group/coupons/detail/${id}`, {}, {
		noAuth: true
	});
}

/**
 * 获取我的优惠券列表
 * @param {Object} data 查询参数
 * @param {number} data.status 状态筛选
 * @param {number} data.page 页码
 * @param {number} data.limit 每页数量
 */
export function getMyCoupons(data) {
	return request.get("group/coupons/my/list", data);
}

/**
 * 获取订单可用优惠券
 * @param {Object} data 查询参数
 * @param {number} data.order_amount 订单金额
 */
export function getOrderAvailableCoupons(data) {
	return request.get("group/coupons/order/available", data);
}

/**
 * 领取优惠券
 * @param {Object} data 领取数据
 * @param {number} data.coupon_id 优惠券ID
 */
export function receiveCoupon(data) {
	return request.post("group/coupons/receive", data);
}







/**
 * 获取收藏列表
 * @param object data 参数对象，包含收藏类型
 */
export function getCollectList(data) {
  return request.get("group/collect/get", data);
}

/**
 * 添加收藏
 * @param object data 参数对象，包含收藏ID和类型
 */
export function addCollect(data) {
  return request.post("group/collect/add", data);
}

/**
 * 取消收藏
 * @param object data 参数对象，包含收藏ID和类型
 */
export function deleteCollect(data) {
  return request.post("group/collect/del", data);
}

/**
 * 团购商品相关接口 - 基于API文档
 */

/**
 * 获取团购商品列表
 * @param {Object} data 查询参数
 * @param {string} data.cate_id 商品分类id
 * @param {string} data.search 搜索关键词
 * @param {string} data.is_hot 是否热门（0：否，1：是）
 * @param {string} data.is_new 是否新品（0：否，1：是）
 * @param {string} data.is_recommend 是否推荐（0：否，1：是）
 * @param {string} data.sort 排序字段
 * @param {string} data.sort_order 排序方式（asc：升序，desc：降序）
 * @param {number} data.page 页码
 * @param {number} data.limit 每页数量
 */
export function getGroupGoodsList(data) {
	return request.get("group/goods/list", data, {
		noAuth: true
	});
}

/**
 * 获取团购商品详情
 * @param {number} id 商品ID
 */
export function getGroupGoodsDetail(id) {
	return request.get(`group/goods/detail/${id}`);
}

/**
 * 获取团购商品分类
 */
export function getGroupGoodsCategory() {
	return request.get("group/goods/cate", {}, {
		noAuth: true
	});
}

/**
 * 团购订单相关接口 - 基于API文档
 */





/**
 * 用户登录接口 - 基于API文档
 * @param {Object} data 登录数据
 * @param {string} data.account 账号（手机号）
 * @param {string} data.password 密码
 */
export function groupLogin(data) {
	return request.post("login", data, {
		noAuth: true
	});
}

/**
 * 验证码登录接口
 * @param {Object} data 登录数据
 * @param {string} data.phone 手机号
 * @param {string} data.captcha 验证码
 */
export function groupLoginMobile(data) {
	return request.post("login/mobile", data, {
		noAuth: true
	});
}

/**
 * 用户注册接口
 * @param {Object} data 注册数据
 */
export function groupRegister(data) {
	return request.post("register", data, {
		noAuth: true
	});
}

/**
 * 获取验证码
 * @param {Object} data
 * @param {string} data.phone 手机号
 * @param {string} data.type 验证码类型
 */
export function getGroupVerifyCode(data) {
	return request.post("sms/send", data, {
		noAuth: true
	});
}

/**
 * 售后服务相关接口 - 基于API文档
 */

/**
 * 获取用户售后列表
 * @param {Object} data 查询参数
 * @param {number} data.status 售后状态筛选
 * @param {string} data.keyword 关键词搜索
 * @param {Array} data.time 时间范围筛选
 * @param {number} data.page 页码
 * @param {number} data.limit 每页数量
 */
export function getAfterSalesList(data) {
	return request.get("group/aftersales/list", data);
}

/**
 * 获取售后详情
 * @param {number} id 售后ID
 */
export function getAfterSalesDetail(id) {
	return request.get(`group/aftersales/detail/${id}`);
}

/**
 * 创建售后申请
 * @param {Object} data 售后申请数据
 */
export function createAfterSales(data) {
	return request.post("group/aftersales/create", data);
}

/**
 * 更新售后申请
 * @param {number} id 售后ID
 * @param {Object} data 更新数据
 */
export function updateAfterSales(id, data) {
	return request.post(`group/aftersales/update/${id}`, data);
}

/**
 * 房屋租售管理相关接口 - 基于API文档
 */

// 重复声明已删除，使用文件开头的getHouseRentalList函数

/**
 * 获取房屋租售详情
 * @param {number} id 房屋ID
 */
export function getHouseRentalDetail(id) {
	return request.get(`group/house_rental/detail/${id}`, {}, {
		noAuth: true
	});
}

/**
 * 房屋租售预约
 * @param {number} id 房屋ID
 * @param {Object} data 预约数据
 */
export function reserveHouseRental(id, data) {
	return request.post(`group/house_rental/reservation/${id}`, data);
}

/**
 * 获取同商圈店铺列表
 * @param {number} id 房屋ID
 * @param {Object} data 查询参数
 */
export function getNearbyShops(id, data = {}) {
	return request.get(`group/house_rental/nearby_shops/${id}`, data, {
		noAuth: true
	});
}

/**
 * 社区相关接口 - 基于API文档
 */

/**
 * 获取社区列表
 * @param {Object} data 查询参数
 * @param {number} data.page 页码
 * @param {number} data.limit 每页数量
 * @param {string} data.keyword 搜索关键词
 * @param {string} data.city 城市筛选
 */
export function getCommunityList(data) {
	return request.get("group/community/list", data, {
		noAuth: true
	});
}

/**
 * 获取我的社区信息
 */
export function getMyCommunityInfo() {
	return request.get("group/community/my_info");
}

/**
 * 绑定社区
 * @param {Object} data 绑定数据
 * @param {number} data.community_id 社区ID
 */
export function bindCommunity(data) {
	return request.post("group/community/bind", data);
}

/**
 * 获取附近社区
 * @param {Object} data 查询参数
 * @param {string} data.longitude 经度
 * @param {string} data.latitude 纬度
 * @param {number} data.limit 限制数量
 */
export function getNearbyCommunities(data) {
	return request.get("group/community/nearby", data, {
		noAuth: true
	});
}

/**
 * 用户端-拼团商品相关接口 - 基于API文档
 */

/**
 * 获取拼团商品列表（用户端）
 * @param {Object} data 查询参数
 * @param {number} data.page 页码
 * @param {number} data.limit 每页数量
 * @param {string} data.keyword 搜索关键词
 * @param {string} data.is_host 是否推荐
 * @param {number} data.price_min 最低价格
 * @param {number} data.price_max 最高价格
 * @param {number} data.people 成团人数
 * @param {string} data.order 排序方式
 */
export function getUserCombinationList(data) {
	return request.get("group/combination/list", data, {
		noAuth: true
	});
}

/**
 * 获取拼团商品详情（用户端）
 * @param {number} id 拼团商品ID
 */
export function getUserCombinationDetail(id) {
	return request.get(`group/combination/detail/${id}`, {}, {
		noAuth: true
	});
}

/**
 * 参与拼团
 * @param {Object} data 拼团数据
 * @param {number} data.combination_id 拼团商品ID
 * @param {number} data.quantity 数量
 */
export function joinCombination(data) {
	return request.post("group/combination/join", data);
}

/**
 * 获取我的拼团记录
 * @param {Object} data 查询参数
 * @param {number} data.page 页码
 * @param {number} data.limit 每页数量
 * @param {string} data.status 状态筛选
 */
export function getMyCombinationList(data) {
	return request.get("group/combination/my_list", data);
}