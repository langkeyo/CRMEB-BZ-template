<template>
  <view class="cart-list">
    <!-- 满减提示条 -->
    <view class="notice-bar">
      <view class="notice-tag">
        <text class="notice-tag-text">参与满减</text>
      </view>
      <text class="notice-text">以满99元，可换购1件</text>
      <text class="notice-action">再逛逛~</text>
    </view>
    
    <view class="product-card" v-for="(item, index) in cartItems" :key="index">
      <view class="card-body">
        <!-- 选择框始终显示 -->
        <view class="product-checkbox-wrap" @click="toggleCheckbox(index)">
          <view class="checkbox-icon" v-if="item.checked"></view>
          <view class="checkbox-border" v-else></view>
        </view>

        <view class="product-img-wrap">
          <image :src="setDomain(item.productInfo.image || item.goods.image)" mode="aspectFill" class="product-img-card"></image>
        </view>
        <view class="product-info-wrap">
          <view class="product-title">{{ item.productInfo.title || item.goods.title }}</view>
          <view class="product-desc-card">比加入时降价￥10元</view>
          <view class="promo-row">
            <view class="promo-tag-border"><text class="promo-tag">秒杀价</text></view>
          </view>
          <view class="quantity-bar">
            <view class="quantity-btn-card minus" @click.stop="onSubCart(index)">
              <view class="minus-icon"></view>
            </view>
            <view class="quantity-divider"></view>
            <view class="quantity-value">{{ item.cart_num }}</view>
            <view class="quantity-divider"></view>
            <view class="quantity-btn-card plus" :class="{ 'disabled': item.cart_num >= 99 }" @click.stop="onAddCart(index)">
              <view class="plus-icon">
                <view class="plus-h"></view>
                <view class="plus-v"></view>
              </view>
            </view>
          </view>
          <view class="product-price-card">￥{{ getItemSubtotal(item) }}</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { HTTP_REQUEST_URL } from '@/config/app.js';

export default {
  name: 'ValidCartItems',
  props: {
    cartItems: {
      type: Array,
      default: () => []
    },
    isEditing: {
      type: Boolean,
      default: true
    },
    disabledChangeNumber: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    toggleCheckbox(index) {
      // 切换选中状态
      this.cartItems[index].checked = !this.cartItems[index].checked;

      // 构造checkbox-group的change事件格式
      const checkedItems = this.cartItems
        .filter(item => item.checked)
        .map(item => item.id.toString());

      const event = {
        detail: {
          value: checkedItems
        }
      };

      this.$emit('checkbox-change', event);
    },
    onCheckboxChange(e) {
      this.$emit('checkbox-change', e);
    },
    onReElection(item) {
      this.$emit('re-election', item);
    },
    onSubCart(index) {
      this.$emit('sub-cart', index);
    },
    onAddCart(index) {
      this.$emit('add-cart', index);
    },
    onIptCartNum(index) {
      this.$emit('ipt-cart-num', index);
    },
    onBlurInput(index) {
      this.$emit('blur-input', index);
    },

    // 处理图片URL
    setDomain(url) {
      if (!url) return '';
      url = url.toString();

      // 如果是相对路径，拼接域名
      if (url.indexOf('/') === 0) {
        return HTTP_REQUEST_URL + url;
      }

      // 如果已经是完整URL，直接返回
      if (url.indexOf("http") === 0) {
        return url;
      }

      // 其他情况拼接域名
      return HTTP_REQUEST_URL + '/' + url;
    },
    getItemPrice(item) {
      // 优先使用combination.group_price
      if (item.combination && item.combination.group_price) {
        return item.combination.group_price;
      } else if (item.combination && item.combination.price) {
        return item.combination.price;
      } else if (item.productInfo && item.productInfo.price) {
        return item.productInfo.price;
      } else if (item.goods && item.goods.price) {
        return item.goods.price;
      } else if (typeof item.truePrice === 'number' || typeof item.truePrice === 'string') {
        return item.truePrice;
      } else if (typeof item.price === 'number' || typeof item.price === 'string') {
        return item.price;
      }
      return '0.00'; // 如果没有价格，显示0.00
    },
    getItemSubtotal(item) {
      // 获取单价
      let price = 0;
      if (item.combination && item.combination.group_price) {
        price = parseFloat(item.combination.group_price);
      } else if (item.combination && item.combination.price) {
        price = parseFloat(item.combination.price);
      } else if (item.productInfo && item.productInfo.price) {
        price = parseFloat(item.productInfo.price);
      } else if (item.goods && item.goods.price) {
        price = parseFloat(item.goods.price);
      } else if (typeof item.truePrice === 'number' || typeof item.truePrice === 'string') {
        price = parseFloat(item.truePrice);
      } else if (typeof item.price === 'number' || typeof item.price === 'string') {
        price = parseFloat(item.price);
      }
      
      // 获取数量
      const quantity = parseInt(item.cart_num || 1);
      
      // 计算小计并保留两位小数
      const subtotal = (price * quantity).toFixed(2);
      
      return subtotal;
    }
  }
}
</script>

<style scoped>
.cart-list {
  background: #f5f5f5;
  padding: 0;
}

/* 满减提示条样式 */
.notice-bar {
  position: relative;
  width: 702rpx;
  height: 80rpx;
  margin: 12rpx auto;
  background: #FFFFFF;
  border-radius: 14rpx;
  display: flex;
  align-items: center;
  padding: 0 24rpx;
}

.notice-tag {
  width: 108.76rpx;
  height: 36rpx;
  background: #FF840B;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12rpx;
}

.notice-tag-text {
  font-family: 'PingFang SC';
  font-style: normal;
  font-weight: 400;
  font-size: 20rpx;
  line-height: 28rpx;
  color: #FFFFFF;
}

.notice-text {
  flex: 1;
  font-family: 'PingFang SC';
  font-style: normal;
  font-weight: 400;
  font-size: 24rpx;
  line-height: 34rpx;
  color: #737373;
}

.notice-action {
  font-family: 'PingFang SC';
  font-style: normal;
  font-weight: 400;
  font-size: 24rpx;
  line-height: 34rpx;
  color: #737373;
}

.product-card {
  position: relative;
  width: 702rpx;
  min-height: 220rpx;
  margin: 12rpx auto 0 auto;
  background: #fff;
  border-radius: 8rpx;
  box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.03);
  display: flex;
  flex-direction: column;
  padding: 16rpx 0;
}
/* 移除原有的card-header相关样式 */
/* 移除店铺名称样式 */

/* 选择框样式 */
.product-checkbox-wrap {
  position: relative;
  width: 40rpx;
  height: 40rpx;
  margin-right: 24rpx;
  margin-top: 74rpx; /* (188rpx - 40rpx) / 2 = 74rpx，让选择框与图片垂直居中 */
  flex-shrink: 0;
}

.product-checkbox {
  opacity: 0;
  position: absolute;
  z-index: 2;
  width: 100%;
  height: 100%;
}

.checkbox-icon {
  width: 40rpx;
  height: 40rpx;
  border-radius: 50%;
  background: #FE8B1B;
  position: absolute;
  top: 0;
  left: 0;
}

.checkbox-border {
  width: 40rpx;
  height: 40rpx;
  border-radius: 50%;
  border: 2px solid #ddd;
  background-color: #fff;
  position: absolute;
  top: 0;
  left: 0;
}

.card-body {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding: 0 0 0 24rpx;
  margin-top: 0;
}
.product-img-wrap {
  width: 188rpx;
  height: 188rpx;
  border-radius: 14rpx;
  overflow: hidden;
  background: #f8f8f8;
  margin-right: 24rpx;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.product-img-card {
  width: 100%;
  height: 100%;
  border-radius: 14rpx;
  object-fit: cover;
}
.product-info-wrap {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding-right: 24rpx;
}
.product-title {
  font-family: 'PingFang SC';
  font-weight: 400;
  font-size: 32rpx;
  line-height: 44rpx;
  color: #333;
  margin-bottom: 8rpx;
}
.product-desc-card {
  font-family: 'PingFang SC';
  font-weight: 400;
  font-size: 24rpx;
  line-height: 34rpx;
  color: #333;
  opacity: 0.7;
  margin-bottom: 8rpx;
}
.promo-row {
  display: flex;
  align-items: center;
  margin-bottom: 8rpx;
}
.promo-tag-border {
  width: 70rpx;
  height: 32rpx;
  border: 1rpx solid #FF840B;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16rpx;
}
.promo-tag {
  font-family: 'PingFang SC';
  font-weight: 400;
  font-size: 20rpx;
  line-height: 28rpx;
  color: #FF840B;
}
.price-quantity-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 12rpx;
}
.product-price-card {
  align-self: flex-start;
  font-family: 'PingFang SC';
  font-weight: 400;
  font-size: 40rpx;
  line-height: 56rpx;
  color: #333;
  margin-top: 0;
  transform: translateY(-45rpx);
}
.quantity-bar {
  align-self: flex-end;
  margin-top: 0;
  margin-bottom: 4rpx;
  width: 179.24rpx;
  height: 50rpx;
  border: 2rpx solid #EDEDED;
  border-radius: 188rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  box-sizing: border-box;
}
.quantity-btn-card {
  width: 50rpx;
  height: 50rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.quantity-btn-card.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.quantity-btn-card.disabled .plus-h,
.quantity-btn-card.disabled .plus-v {
  background: #ccc;
}
.minus-icon {
  width: 26rpx;
  height: 28rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}
.minus-icon::before {
  content: '';
  display: block;
  width: 26rpx;
  height: 2.4rpx;
  background: #EDEDED;
  border-radius: 2rpx;
}
.plus-icon {
  width: 26rpx;
  height: 28rpx;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}
.plus-h {
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  height: 2.4rpx;
  background: #333;
  width: 100%;
  border-radius: 2rpx;
  transform: translateY(-50%);
}
.plus-v {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  width: 2.4rpx;
  background: #333;
  height: 100%;
  border-radius: 2rpx;
  transform: translateX(-50%);
}
.quantity-value {
  font-family: 'Inter';
  font-weight: 400;
  font-size: 28rpx;
  line-height: 34rpx;
  color: #333;
  text-align: center;
  width: 40rpx;
  background: transparent;
  border: none;
  outline: none;
  padding: 0;
}
.quantity-divider {
  width: 2rpx;
  height: 44rpx;
  background: #EDEDED;
  margin: 0 8rpx;
  border-radius: 2rpx;
}
</style>
