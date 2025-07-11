/**
 * 订单页面跳转工具
 * 用于处理订单相关页面之间的导航逻辑
 */

/**
 * 跳转到待支付页面
 * @param {Object} options 参数
 */
export function navigateToPendingPayment(options = {}) {
  uni.navigateTo({
    url: '/pages/goods/pending_payment/index'
  });
}

/**
 * 跳转到待收货页面
 * @param {Object} options 参数
 */
export function navigateToPendingDelivery(options = {}) {
  uni.navigateTo({
    url: '/pages/goods/pending_delivery/index'
  });
}

/**
 * 跳转到订单详情页面
 * @param {String} orderId 订单ID
 */
export function navigateToOrderDetails(orderId) {
  if (!orderId) return;
  uni.navigateTo({
    url: `/pages/goods/order_details/index?order_id=${orderId}`
  });
}

/**
 * 跳转到订单完成页面
 * @param {String} orderId 订单ID
 */
export function navigateToOrderComplete(orderId) {
  if (!orderId) return;
  uni.navigateTo({
    url: `/pages/goods/order_complete/index?order_id=${orderId}`
  });
}

/**
 * 跳转到支付状态页面
 * @param {String} orderId 订单ID
 * @param {Number} status 状态码
 * @param {String} payType 支付类型
 */
export function navigateToPayStatus(orderId, status = 0, payType = '') {
  if (!orderId) return;
  uni.navigateTo({
    url: `/pages/goods/order_pay_status/index?order_id=${orderId}&status=${status}&payType=${payType}`
  });
}

/**
 * 跳转到支付页面
 * @param {String} orderId 订单ID
 * @param {Number} totalPrice 总价
 */
export function navigateToCashier(orderId, totalPrice) {
  if (!orderId) return;
  uni.navigateTo({
    url: `/pages/goods/cashier/index?orderId=${orderId}&totalPrice=${totalPrice}`
  });
}

/**
 * 返回我的订单列表
 */
export function navigateToOrderList() {
  uni.navigateTo({
    url: '/pages/goods/order_list/index'
  });
}

/**
 * 返回首页
 */
export function navigateToHome() {
  uni.switchTab({
    url: '/pages/index/index'
  });
}

/**
 * 跳转到未结清订单提示页面
 * @param {String} orderId 订单ID
 */
export function navigateToUnpaidOrderTip(orderId) {
  if (!orderId) return;
  uni.navigateTo({
    url: `/pages/goods/unpaid_order_tip/index?order_id=${orderId}`
  });
}

/**
 * 跳转到交易取消页面
 * @param {String} orderId 订单ID
 */
export function navigateToOrderCancelled(orderId) {
  if (!orderId) return;
  uni.navigateTo({
    url: `/pages/goods/order_cancelled/index?order_id=${orderId}`
  });
}

/**
 * 跳转到支付成功页面
 * @param {String} orderId 订单ID
 */
export function navigateToPaymentSuccess(orderId) {
  if (!orderId) return;
  uni.navigateTo({
    url: `/pages/goods/payment_success/index?order_id=${orderId}`
  });
}