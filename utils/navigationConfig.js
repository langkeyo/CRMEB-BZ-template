/**
 * 导航配置文件
 * 用于统一管理页面之间的跳转逻辑
 */

import {
  navigateToOrderDetails,
  navigateToOrderComplete,
  navigateToPayStatus,
  navigateToCashier,
  navigateToOrderList,
  navigateToHome,
  navigateToUnpaidOrderTip,
  navigateToPendingPayment,
  navigateToPendingDelivery
} from './orderNavigation.js';

/**
 * 商品购买流程导航配置
 */
export const purchaseFlowNavigation = {
  /**
   * 从商品详情页跳转到确认订单页面
   * @param {Object} params 参数对象
   * @param {String} params.productId 商品ID
   * @param {Number} params.cartNum 购买数量
   * @param {Boolean} params.groupBuy 是否团购
   */
  fromProductToOrderConfirm: (params) => {
    const { productId, cartNum = 1, groupBuy = false } = params;
    if (!productId) return;
    
    uni.navigateTo({
      url: `/pages/goods/order_confirm/index?cartId=0&productId=${productId}&cartNum=${cartNum}${groupBuy ? '&groupBuy=1' : ''}`
    });
  },
  
  /**
   * 从确认订单页面跳转到支付页面
   * @param {Object} params 参数对象
   * @param {String} params.orderId 订单ID
   * @param {Number} params.totalAmount 总金额
   * @param {Boolean} params.isGroupBuy 是否团购
   */
  fromOrderConfirmToPayment: (params) => {
    const { orderId, totalAmount, isGroupBuy = false } = params;
    if (!orderId) return;
    
    if (isGroupBuy) {
      // 如果是团购，跳转到团购支付页面
      const goodsInfo = params.goodsInfo ? encodeURIComponent(JSON.stringify(params.goodsInfo)) : '';
      const groupMembers = params.groupMembers || 1;
      
      uni.navigateTo({
        url: `/pages/goods/group_buy_payment/index?orderId=${orderId}&totalAmount=${totalAmount}&groupMembers=${groupMembers}${goodsInfo ? '&goodsInfo=' + goodsInfo : ''}`
      });
    } else {
      // 普通商品，跳转到收银台
      navigateToCashier(orderId, totalAmount);
    }
  },
  
  /**
   * 从支付页面跳转到支付状态页面
   * @param {Object} params 参数对象
   * @param {String} params.orderId 订单ID
   * @param {String} params.msg 消息
   * @param {Number} params.status 状态码
   */
  fromPaymentToPayStatus: (params) => {
    const { orderId, msg = '支付成功', status = 0 } = params;
    if (!orderId) return;
    
    navigateToPayStatus(orderId, status, '');
  },
  
  /**
   * 从支付页面跳转到未结清订单提示页面
   * @param {Object} params 参数对象
   * @param {String} params.orderId 订单ID
   */
  fromPaymentToUnpaidOrderTip: (params) => {
    const { orderId } = params;
    if (!orderId) return;
    
    navigateToUnpaidOrderTip(orderId);
  },
  
  /**
   * 从未结清订单提示页面跳转到支付页面
   * @param {Object} params 参数对象
   * @param {String} params.orderId 订单ID
   */
  fromUnpaidOrderTipToPayment: (params) => {
    const { orderId } = params;
    if (!orderId) return;
    
    navigateToCashier(orderId);
  },
  
  /**
   * 从未结清订单提示页面跳转到订单列表页面
   */
  fromUnpaidOrderTipToOrderList: () => {
    navigateToOrderList();
  }
};

/**
 * 订单管理导航配置
 */
export const orderManagementNavigation = {
  /**
   * 跳转到订单详情页面
   * @param {String} orderId 订单ID
   */
  toOrderDetails: (orderId) => {
    navigateToOrderDetails(orderId);
  },
  
  /**
   * 跳转到订单完成页面
   * @param {String} orderId 订单ID
   */
  toOrderComplete: (orderId) => {
    navigateToOrderComplete(orderId);
  },
  
  /**
   * 跳转到待支付订单页面
   */
  toPendingPayment: () => {
    navigateToPendingPayment();
  },
  
  /**
   * 跳转到待收货订单页面
   */
  toPendingDelivery: () => {
    navigateToPendingDelivery();
  },
  
  /**
   * 跳转到订单列表页面
   */
  toOrderList: () => {
    navigateToOrderList();
  }
};

/**
 * 通用导航配置
 */
export const commonNavigation = {
  /**
   * 返回首页
   */
  toHome: () => {
    navigateToHome();
  },
  
  /**
   * 返回上一页
   */
  goBack: () => {
    uni.navigateBack({
      delta: 1
    });
  }
};
