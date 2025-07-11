<template>
  <view :style="colorStyle">
    <view class="payment-confirm-popup" :class="isShow ? 'on' : ''">
      <view class="popup-header">
        <text class="popup-title">{{ $t(`确认支付`) }}</text>
        <text class="iconfont icon-guanbi" @click="close"></text>
      </view>
      <view class="popup-content">
        <view class="payment-info">
          <view class="payment-amount">
            <text class="amount-label">{{ $t(`支付金额`) }}</text>
            <view class="amount-value">
              <text class="currency">{{ $t(`￥`) }}</text>
              <text class="value">{{ amount }}</text>
            </view>
          </view>
          <view class="payment-method">
            <text class="method-label">{{ $t(`支付方式`) }}</text>
            <view class="method-value">
              <text class="iconfont" :class="paymentMethod.icon"></text>
              <text class="method-name">{{ paymentMethod.name }}</text>
            </view>
          </view>
        </view>
        <view class="payment-notice">
          <text class="notice-text">{{ $t(`请确认您的支付信息无误，点击确认后将跳转到支付页面`) }}</text>
        </view>
      </view>
      <view class="popup-footer">
        <view class="btn cancel" @click="cancel">{{ $t(`取消`) }}</view>
        <view class="btn confirm" @click="confirm">{{ $t(`确认支付`) }}</view>
      </view>
    </view>
    <view class="mask" @click="close" v-if="isShow"></view>
  </view>
</template>

<script>
import colors from '@/mixins/color.js';

export default {
  name: 'PaymentConfirmPopup',
  mixins: [colors],
  props: {
    show: {
      type: Boolean,
      default: false
    },
    amount: {
      type: [String, Number],
      default: '0.00'
    },
    paymentMethod: {
      type: Object,
      default: () => ({
        name: '微信支付',
        icon: 'icon-weixinzhifu'
      })
    }
  },
  data() {
    return {
      isShow: false
    };
  },
  watch: {
    show(newVal) {
      this.isShow = newVal;
    }
  },
  methods: {
    open() {
      this.isShow = true;
    },
    close() {
      this.isShow = false;
      this.$emit('update:show', false);
      this.$emit('close');
    },
    cancel() {
      this.$emit('cancel');
      this.close();
    },
    confirm() {
      this.$emit('confirm');
      this.close();
    }
  }
};
</script>

<style scoped lang="scss">
.payment-confirm-popup {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  border-radius: 16rpx 16rpx 0 0;
  background-color: #fff;
  padding-bottom: 60rpx;
  z-index: 999;
  transition: all 0.3s cubic-bezier(0.25, 0.5, 0.5, 0.9);
  transform: translate3d(0, 100%, 0);
  padding-bottom: calc(60rpx + env(safe-area-inset-bottom));

  .popup-header {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    height: 100rpx;
    border-bottom: 1px solid #f5f5f5;

    .popup-title {
      font-size: 32rpx;
      font-weight: 500;
      color: #333;
    }

    .icon-guanbi {
      position: absolute;
      right: 30rpx;
      font-size: 36rpx;
      color: #999;
    }
  }

  .popup-content {
    padding: 30rpx;

    .payment-info {
      background-color: #f8f8f8;
      border-radius: 12rpx;
      padding: 30rpx;
      margin-bottom: 30rpx;

      .payment-amount {
        margin-bottom: 30rpx;

        .amount-label {
          font-size: 28rpx;
          color: #666;
          margin-bottom: 10rpx;
          display: block;
        }

        .amount-value {
          display: flex;
          align-items: baseline;

          .currency {
            font-size: 32rpx;
            color: #333;
            margin-right: 4rpx;
          }

          .value {
            font-size: 48rpx;
            font-weight: bold;
            color: #333;
          }
        }
      }

      .payment-method {
        .method-label {
          font-size: 28rpx;
          color: #666;
          margin-bottom: 10rpx;
          display: block;
        }

        .method-value {
          display: flex;
          align-items: center;

          .iconfont {
            font-size: 40rpx;
            margin-right: 10rpx;
            color: #333;
          }

          .method-name {
            font-size: 30rpx;
            color: #333;
          }
        }
      }
    }

    .payment-notice {
      .notice-text {
        font-size: 26rpx;
        color: #999;
        line-height: 1.5;
      }
    }
  }

  .popup-footer {
    display: flex;
    padding: 0 30rpx;
    margin-top: 30rpx;

    .btn {
      flex: 1;
      height: 80rpx;
      border-radius: 40rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 30rpx;
    }

    .cancel {
      background-color: #f5f5f5;
      color: #666;
      margin-right: 20rpx;
    }

    .confirm {
      background-color: var(--view-theme);
      color: #fff;
    }
  }
}

.payment-confirm-popup.on {
  transform: translate3d(0, 0, 0);
}

.mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 998;
}
</style>
