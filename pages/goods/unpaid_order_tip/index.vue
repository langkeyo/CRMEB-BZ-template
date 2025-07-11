<template>
  <view :style="colorStyle" class="unpaid-order-tip">
    <view class="tip-container">
      <view class="tip-header">
        <view class="icon-container">
          <text class="iconfont icon-tishi"></text>
        </view>
        <view class="tip-title">{{ $t(`您有未结清的订单`) }}</view>
      </view>

      <view class="order-info">
        <view class="order-item">
          <view class="order-number">
            <text class="label">{{ $t(`订单号`) }}：</text>
            <text class="value">{{ orderInfo.order_id || '' }}</text>
          </view>
          <view class="order-time">
            <text class="label">{{ $t(`下单时间`) }}：</text>
            <text class="value">{{ orderInfo.add_time || '' }}</text>
          </view>
          <view class="order-amount">
            <text class="label">{{ $t(`未付金额`) }}：</text>
            <text class="value price">{{ $t(`￥`) }}{{ orderInfo.pay_price || '0.00' }}</text>
          </view>
        </view>

        <view class="order-goods" v-if="orderInfo.cartInfo && orderInfo.cartInfo.length">
          <view class="goods-item" v-for="(item, index) in orderInfo.cartInfo" :key="index">
            <view class="goods-img">
              <image :src="item.productInfo.image" mode="aspectFill"></image>
            </view>
            <view class="goods-info">
              <view class="goods-name">{{ item.productInfo.store_name }}</view>
              <view class="goods-spec" v-if="item.productInfo.attrInfo">
                <text>{{ item.productInfo.attrInfo.suk }}</text>
              </view>
              <view class="goods-price-num">
                <text class="goods-price">{{ $t(`￥`) }}{{ item.truePrice }}</text>
                <text class="goods-num">×{{ item.cart_num }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>

      <view class="tip-message">
        <text>{{ $t(`您有未完成支付的订单，请尽快完成支付或取消订单`) }}</text>
      </view>

      <view class="tip-buttons">
        <view class="btn cancel-btn" @click="cancelOrder">{{ $t(`取消订单`) }}</view>
        <view class="btn pay-btn" @click="goToPay">{{ $t(`去支付`) }}</view>
      </view>
    </view>
  </view>
</template>

<script>
import { getOrderDetail, orderCancel } from '@/api/order.js';
import { toLogin } from '@/libs/login.js';
import { mapGetters } from 'vuex';
import colors from '@/mixins/color';
import { navigateToCashier } from '@/utils/orderNavigation.js';
import { purchaseFlowNavigation } from '@/utils/navigationConfig.js';

export default {
  mixins: [colors],
  data() {
    return {
      orderId: '',
      orderInfo: {
        cartInfo: []
      }
    };
  },
  computed: mapGetters(['isLogin']),
  watch: {
    isLogin: {
      handler: function(newV, oldV) {
        if (newV) {
          this.getOrderInfo();
        }
      },
      deep: true
    }
  },
  onLoad(options) {
    if (!options.order_id) {
      return this.$util.Tips({
        title: this.$t(`缺少参数无法查看订单信息`)
      }, {
        tab: 3,
        url: 1
      });
    }
    this.orderId = options.order_id;
  },
  onShow() {
    if (this.isLogin) {
      this.getOrderInfo();
    } else {
      toLogin();
    }
  },
  methods: {
    /**
     * 获取订单详情
     */
    getOrderInfo() {
      let that = this;
      uni.showLoading({
        title: this.$t(`正在加载中`)
      });
      getOrderDetail(this.orderId)
        .then(res => {
          uni.hideLoading();
          that.$set(that, 'orderInfo', res.data);

          // 如果订单已支付，跳转到支付成功页面
          if (res.data.paid) {
            return that.$util.Tips({
              title: that.$t(`订单已支付`)
            }, {
              tab: 5,
              url: '/pages/goods/order_pay_status/index?order_id=' + that.orderId + '&msg=' + that.$t(`支付成功`)
            });
          }
        })
        .catch(err => {
          uni.hideLoading();
          return that.$util.Tips({
            title: err
          }, {
            tab: 3,
            url: 1
          });
        });
    },

    /**
     * 取消订单
     */
    cancelOrder() {
      let that = this;
      uni.showModal({
        title: that.$t(`提示`),
        content: that.$t(`确定要取消该订单吗？`),
        success: function(res) {
          if (res.confirm) {
            uni.showLoading({
              title: that.$t(`正在取消订单`)
            });
            orderCancel(that.orderId)
              .then(res => {
                uni.hideLoading();
                that.$util.Tips({
                  title: that.$t(`取消订单成功`),
                  icon: 'success'
                });
                purchaseFlowNavigation.fromUnpaidOrderTipToOrderList();
              })
              .catch(err => {
                uni.hideLoading();
                return that.$util.Tips({
                  title: err
                });
              });
          }
        }
      });
    },

    /**
     * 去支付
     */
    goToPay() {
      purchaseFlowNavigation.fromUnpaidOrderTipToPayment({
        orderId: this.orderId
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.unpaid-order-tip {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 30rpx;
  box-sizing: border-box;

  .tip-container {
    background-color: #fff;
    border-radius: 20rpx;
    padding: 40rpx 30rpx;
    box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);

    .tip-header {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: 40rpx;

      .icon-container {
        width: 120rpx;
        height: 120rpx;
        background-color: #FFF2F2;
        border-radius: 60rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 20rpx;

        .iconfont {
          font-size: 60rpx;
          color: #FF3636;
        }
      }

      .tip-title {
        font-size: 36rpx;
        font-weight: bold;
        color: #333;
      }
    }

    .order-info {
      background-color: #F8F8F8;
      border-radius: 12rpx;
      padding: 30rpx;
      margin-bottom: 40rpx;

      .order-item {
        margin-bottom: 20rpx;

        .order-number, .order-time, .order-amount {
          display: flex;
          margin-bottom: 10rpx;
          font-size: 28rpx;

          .label {
            color: #666;
          }

          .value {
            color: #333;
            flex: 1;

            &.price {
              color: #FF3636;
              font-weight: bold;
            }
          }
        }
      }

      .order-goods {
        margin-top: 20rpx;

        .goods-item {
          display: flex;
          padding: 20rpx 0;
          border-top: 1px solid #EEEEEE;

          .goods-img {
            width: 140rpx;
            height: 140rpx;
            margin-right: 20rpx;

            image {
              width: 100%;
              height: 100%;
              border-radius: 10rpx;
            }
          }

          .goods-info {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: space-between;

            .goods-name {
              font-size: 28rpx;
              color: #333;
              line-height: 1.4;
              margin-bottom: 10rpx;
            }

            .goods-spec {
              font-size: 24rpx;
              color: #999;
              margin-bottom: 10rpx;
            }

            .goods-price-num {
              display: flex;
              justify-content: space-between;
              align-items: center;

              .goods-price {
                font-size: 28rpx;
                color: #FF3636;
                font-weight: bold;
              }

              .goods-num {
                font-size: 26rpx;
                color: #999;
              }
            }
          }
        }
      }
    }

    .tip-message {
      text-align: center;
      font-size: 28rpx;
      color: #666;
      margin-bottom: 40rpx;
      line-height: 1.5;
    }

    .tip-buttons {
      display: flex;
      justify-content: space-between;

      .btn {
        width: 300rpx;
        height: 80rpx;
        border-radius: 40rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 30rpx;
      }

      .cancel-btn {
        background-color: #F5F5F5;
        color: #666;
      }

      .pay-btn {
        background-color: var(--view-theme);
        color: #fff;
      }
    }
  }
}
</style>
