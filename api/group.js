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

/**
 * 房屋租售预约
 * @param int id
 */
export function reserveHouseRental(id) {
  return request.get(`group/house_rental/reservation/${id}`);
}

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
 * 获取拼团商品列表
 * @param object data 参数对象，包含页码、每页数量、搜索关键词等
 */
export function getCombinationList(data) {
  return request.get("group/combination/list", data, {
    noAuth: true
  });
}

/**
 * 获取拼团商品详情
 * @param int id 拼团商品ID
 */
export function getCombinationDetail(id) {
  return request.get(`group/combination/detail/${id}`, {}, {
    noAuth: true
  });
}

/**
 * 获取推荐拼团商品
 */
export function getCombinationRecommend() {
  return request.get("group/combination/recommend", {}, {
    noAuth: true
  });
}

/**
 * 获取优惠券列表
 * @param object data 参数对象
 */
export function getAvailableCoupons(data) {
  return request.get("group/coupons/available/list", data, {
    noAuth: true
  });
}

/**
 * 获取优惠券详情
 * @param int id 优惠券ID
 */
export function getCouponDetail(id) {
  return request.get(`group/coupons/detail/${id}`, {}, {
    noAuth: true
  });
}

/**
 * 获取我的优惠券列表
 * @param object data 参数对象，包含状态筛选、页码等
 */
export function getMyCoupons(data) {
  return request.get("group/coupons/my/list", data);
}

/**
 * 获取订单可用优惠券
 * @param object data 参数对象，包含订单金额
 */
export function getOrderAvailableCoupons(data) {
  return request.get("group/coupons/order/available", data);
}

/**
 * 领取优惠券
 * @param object data 参数对象，包含优惠券ID
 */
export function receiveCoupon(data) {
  return request.post("group/coupons/receive", data);
}

/**
 * 获取购物车信息
 */
export function getCartInfo() {
  return request.get("group/cart/get");
}

/**
 * 添加/删除商品到购物车
 * @param object data 参数对象，包含商品ID和数量
 */
export function updateCart(data) {
  return request.post("group/cart/update", data);
}

/**
 * 删除购物车商品
 * @param object data 参数对象，包含商品ID
 */
export function removeCartItem(data) {
  return request.post("group/cart/remove", data);
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