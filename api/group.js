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
	return request.get("group/order/order_list", data);
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
 * 获取拼团商品列表
 * @param {Object} data 查询参数
 * @param {number} data.page 页码
 * @param {number} data.limit 每页数量
 * @param {string} data.keyword 搜索关键词
 * @param {string} data.is_host 是否推荐（0/1）
 * @param {number} data.price_min 最低价格
 * @param {number} data.price_max 最高价格
 * @param {number} data.people 成团人数
 * @param {string} data.order 排序方式（sales_desc/price_asc/price_desc/time_desc）
 */
export function getGroupGoodsList(data) {
	return getCombinationList(data);
}

/**
 * 获取拼团商品详情
 * @param {number} id 拼团商品ID
 */
export function getGroupGoodsDetail(id) {
	return getCombinationDetail(id);
}

/**
 * 获取推荐拼团商品
 */
export function getRecommendGroupGoods() {
	return getRecommendCombinations({});
}

/**
 * 预览其他社区拼团商品
 * @param {Object} data 查询参数
 * @param {number} data.community_id 社区ID，不传则显示本社区商品
 * @param {number} data.page 页码
 * @param {number} data.limit 每页数量
 * @param {string} data.keyword 搜索关键词
 * @param {string} data.is_host 是否推荐商品
 * @param {number} data.price_min 最低价格
 * @param {number} data.price_max 最高价格
 * @param {string} data.order 排序方式
 */
export function getGroupGoodsPreview(data) {
	return previewCombination(data);
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
	return getHouseRentalInfo(id);
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
	return getCombinationList(data);
}

/**
 * 获取拼团商品详情（用户端）
 * @param {number} id 拼团商品ID
 */
export function getUserCombinationDetail(id) {
	return getCombinationDetail(id);
}

/**
 * 获取普通商品详情
 * @param {number} id 商品ID
 */
export function getGoodsDetail(id) {
	return request.get(`group/goods/detail/${id}`, {}, {
		noAuth: true
	});
}

/**
 * 商品点赞/取消点赞
 * @param {number} id 商品ID
 * @param {number} type 1=点赞, 0=取消点赞
 */
export function likeGoods(id, type = 1) {
	return request.post(`group/goods/like/${id}`, { type }, {
		noAuth: false
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

/**
 * 获取推荐拼团商品
 * @param {Object} data 查询参数
 */
export function getRecommendCombinations(data) {
	return request.get("group/combination/recommend", data, {
		noAuth: true
	});
}

/**
 * 预览其他社区拼团商品
 * @param {Object} data 查询参数
 * @param {number} data.community_id 社区ID，不传则显示本社区商品
 * @param {number} data.page 页码
 * @param {number} data.limit 每页数量
 * @param {string} data.keyword 搜索关键词
 * @param {string} data.is_host 是否推荐商品
 * @param {number} data.price_min 最低价格
 * @param {number} data.price_max 最高价格
 * @param {string} data.order 排序方式
 */
export function previewCombinations(data) {
	return previewCombination(data);
}

/**
 * 购物车结算
 * @param {Object} data 结算数据
 * @param {string} data.cart_ids 购物车ID，多个用逗号分隔
 * @param {number} data.coupon_id 优惠券ID，0表示不使用
 */
export function checkoutCart(data) {
	return request.post("group/cart/checkout", data);
}

/**
 * 获取订单可用优惠券
 * @param {Object} data 查询参数
 * @param {number} data.order_id 订单ID
 */
export function getOrderCoupons(data) {
	return request.post("group/order/getOrderCoupons", data);
}

/**
 * 设置订单优惠券
 * @param {Object} data 设置数据
 * @param {number} data.order_id 订单ID
 * @param {number} data.user_coupon_id 用户优惠券ID，0表示取消优惠券
 */
export function setOrderCoupon(data) {
	return request.post("group/order/setOrderCoupon", data);
}

/**
 * 处理订单支付
 * @param {number} orderId 订单ID
 * @param {Object} data 支付数据
 * @param {number} data.pay_type 支付类型
 */
export function payOrder(orderId, data) {
	return request.post(`group/order/payOrder/${orderId}`, data);
}

/**
 * 确认收货
 * @param {Object} data 确认数据
 * @param {number} data.order_id 订单ID
 */
export function confirmReceipt(data) {
	return request.post("group/order/confirmReceipt", data);
}

/**
 * 取消订单
 * @param {Object} data 取消数据
 * @param {number} data.order_id 订单ID
 */
export function cancelOrder(data) {
	return request.post("group/order/cancelOrder", data);
}

/**
 * 申请退款
 * @param {Object} data 退款申请数据
 * @param {number} data.order_id 订单ID
 * @param {string} data.reason 退款原因
 * @param {number} data.amount 退款金额，0表示全额退款
 */
export function applyRefund(data) {
	return request.post("group/order/applyRefund", data);
}

/**
 * 取消售后申请
 * @param {number} id 售后申请ID
 */
export function cancelAfterSales(id) {
	return request.post(`group/aftersales/cancel/${id}`);
}

/**
 * 检查收藏状态
 * @param {Object} data 查询参数
 * @param {string} data.fav_id 收藏对象ID
 * @param {string} data.type 收藏类型
 */
export function checkCollectStatus(data) {
	return request.get("group/collect/check", data);
}

/**
 * 批量操作收藏
 * @param {Object} data 批量操作数据
 * @param {string} data.action 操作类型（add-添加，del-删除）
 * @param {Array} data.items 收藏项目列表
 */
export function batchCollect(data) {
	return request.post("group/collect/batch", data);
}

/**
 * 商品评论相关接口 - 基于API文档
 */

/**
 * 获取商品评论列表
 * @param {number} goodsId 商品ID
 * @param {Object} data 查询参数
 * @param {number} data.page 页码
 * @param {number} data.limit 每页数量
 */
export function getGoodsCommentList(goodsId, data = {}) {
	return request.get(`group/goods_comment/comment_list/${goodsId}`, data, {
		noAuth: true
	});
}

/**
 * 发表商品评论
 * @param {Object} data 评论数据
 * @param {number} data.goods_id 商品ID
 * @param {string} data.content 评论内容
 * @param {number} data.rating 评分
 * @param {Array} data.images 评论图片
 */
export function createGoodsComment(data) {
	return request.post("group/goods_comment/create", data);
}

/**
 * 删除商品评论
 * @param {number} commentId 评论ID
 */
export function deleteGoodsComment(commentId) {
	return request.get(`group/goods_comment/delete/${commentId}`);
}

/**
 * 商品问答相关接口 - 基于API文档
 */

/**
 * 发布商品问答
 * @param {Object} data 问答数据
 * @param {number} data.goods_id 商品ID
 * @param {number} data.qid 问题ID（回答时使用，提问时为0）
 * @param {string} data.content 问答内容
 */
export function createGoodsQA(data) {
	return request.post("group/goods_qa/create", data);
}

/**
 * 获取商品问题列表
 * @param {number} goodsId 商品ID
 * @param {Object} data 查询参数
 * @param {number} data.page 页码
 * @param {number} data.limit 每页数量
 */
export function getGoodsQuestionList(goodsId, data = {}) {
	return request.get(`group/goods_qa/question_list/${goodsId}`, data, {
		noAuth: true
	});
}

/**
 * 获取问题回答列表
 * @param {number} questionId 问题ID
 * @param {Object} data 查询参数
 * @param {number} data.page 页码
 * @param {number} data.limit 每页数量
 */
export function getGoodsAnswerList(questionId, data = {}) {
	return request.get(`group/goods_qa/answer_list/${questionId}`, data, {
		noAuth: true
	});
}

/**
 * 删除商品问答
 * @param {number} qaId 问答ID
 */
export function deleteGoodsQA(qaId) {
	return request.get(`group/goods_qa/delete/${qaId}`);
}

/**
 * 商业加盟相关接口 - 基于API文档
 */

/**
 * 获取加盟项目列表
 * @param {Object} data 查询参数
 * @param {number} data.page 页码
 * @param {number} data.limit 每页数量
 * @param {string} data.keyword 搜索关键词
 */
export function getFranchiseList(data = {}) {
	return request.get("group/franchise/list", data, {
		noAuth: true
	});
}

/**
 * 获取加盟项目详情
 * @param {number} franchiseId 加盟项目ID
 */
export function getFranchiseInfo(franchiseId) {
	return request.get(`group/franchise/info/${franchiseId}`, {}, {
		noAuth: true
	});
}

/**
 * 申请加盟
 * @param {Object} data 申请数据
 * @param {string} data.name 申请人姓名
 * @param {string} data.phone 联系电话
 * @param {number} data.franchise_id 加盟项目ID
 */
export function applyFranchise(data) {
	return request.post("group/franchise/apply", data);
}

/**
 * 招商合作相关接口 - 基于API文档
 */

/**
 * 获取合作项目列表
 * @param {Object} data 查询参数
 * @param {number} data.page 页码
 * @param {number} data.limit 每页数量
 * @param {string} data.keyword 搜索关键词
 */
export function getCooperationList(data = {}) {
	return request.get("group/cooperation/list", data, {
		noAuth: true
	});
}

/**
 * 获取合作项目详情
 * @param {number} cooperationId 合作项目ID
 */
export function getCooperationInfo(cooperationId) {
	return request.get(`group/cooperation/info/${cooperationId}`, {}, {
		noAuth: true
	});
}

/**
 * 申请合作
 * @param {Object} data 申请数据
 * @param {string} data.name 申请人姓名
 * @param {string} data.phone 联系电话
 * @param {number} data.cooperation_id 合作项目ID
 */
export function applyCooperation(data) {
	return request.post("group/cooperation/apply", data);
}

/**
 * 便民服务相关接口 - 基于API文档
 */

/**
 * 获取便民服务列表
 * @param {Object} data 查询参数
 * @param {number} data.page 页码
 * @param {number} data.limit 每页数量
 * @param {string} data.keyword 搜索关键词
 * @param {string} data.category 服务分类
 */
export function getConvenientServiceList(data = {}) {
	return request.get("group/convenient_service/list", data, {
		noAuth: true
	});
}

/**
 * 获取便民服务详情
 * @param {number} serviceId 服务ID
 */
export function getConvenientServiceInfo(serviceId) {
	return request.get(`group/convenient_service/info/${serviceId}`, {}, {
		noAuth: true
	});
}

/**
 * 预约便民服务
 * @param {number} serviceId 服务ID
 * @param {Object} data 预约数据
 * @param {string} data.name 预约人姓名
 * @param {string} data.phone 联系电话
 * @param {string} data.appointment_time 预约时间
 * @param {string} data.remark 备注
 */
export function reserveConvenientService(serviceId, data) {
	return request.get(`group/convenient_service/reservation/${serviceId}`, data);
}

/**
 * 发表便民服务评论
 * @param {Object} data 评论数据
 * @param {number} data.service_id 服务ID
 * @param {string} data.content 评论内容
 * @param {number} data.rating 评分
 * @param {Array} data.images 评论图片
 */
export function createConvenientServiceComment(data) {
	return request.post("group/convenient_service/comment", data);
}

/**
 * 获取便民服务评论列表
 * @param {number} serviceId 服务ID
 * @param {Object} data 查询参数
 * @param {number} data.page 页码
 * @param {number} data.limit 每页数量
 */
export function getConvenientServiceCommentList(serviceId, data = {}) {
	return request.get(`group/convenient_service/comment_list/${serviceId}`, data, {
		noAuth: true
	});
}

/**
 * 获取商品列表
 * @param {Object} data 查询参数
 * @param {string} data.cate_id 商品分类id
 * @param {string} data.search 搜索关键词
 * @param {string} data.is_hot 是否热门（0：否，1：是）
 * @param {string} data.is_new 是否新品（0：否，1：是）
 * @param {string} data.is_recommend 是否推荐（0：否，1：是）
 * @param {string} data.sort 排序字段
 * @param {string} data.sort_order 排序方式（asc：升序，desc：降序）
 */
export function getGoodsList(data) {
	return request.get("group/goods/list", data, {
		noAuth: true
	});
}

/**
 * 获取拼团商品列表
 * @param object data
 */
export function getCombinationList(data) {
	return request.get('group/combination/list', data, {
		noAuth: true
	});
}

/**
 * 获取拼团商品详情
 * @param {Number} id 拼团商品ID
 */
export function getCombinationDetail(id) {
	return request.get(`group/combination/detail/${id}`, {}, {
		noAuth: true
	});
}

/**
 * 预览其他社区拼团商品
 * @param {Object} data
 */
export function previewCombination(data) {
	return request.get('group/combination/preview', data, {
		noAuth: true
	});
}