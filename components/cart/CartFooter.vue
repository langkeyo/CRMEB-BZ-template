<template>
  <view class="cart-footer" :class="isDiySet ? 'on' : ''">
    <!-- 全选区域 -->
    <view class="select-all-section" @click="toggleSelectAll">
      <view class="checkbox-wrapper">
        <view class="checkbox-circle" :class="{ 'selected': isAllSelect }"></view>
      </view>
      <text class="select-all-text">全选</text>
    </view>
    
    <!-- 合计区域 -->
    <view class="total-section" v-if="isEditing">
      <text class="total-text">合计（不含运费）￥{{ totalPrice }}</text>
    </view>
    
    <!-- 结算按钮 -->
    <view class="checkout-section" v-if="isEditing">
      <button class="checkout-btn" @click="onSubmitOrder">结算</button>
    </view>
    
    <!-- 编辑模式按钮 -->
    <view class="edit-buttons" v-else>
      <button class="edit-btn delete-btn" @click="onSubmitDelete">删除</button>
    </view>
  </view>
</template>

<script>
export default {
  name: 'CartFooter',
  props: {
    isAllSelect: {
      type: Boolean,
      default: false
    },
    selectedCount: {
      type: Number,
      default: 0
    },
    totalPrice: {
      type: String,
      default: '0.00'
    },
    isEditing: {
      type: Boolean,
      default: true
    },
    isDiySet: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    toggleSelectAll() {
      // 模拟checkbox-group的change事件格式
      const event = {
        detail: {
          value: this.isAllSelect ? [] : ['all']
        }
      };
      this.$emit('checkbox-all-change', event);
    },
    onSubmitOrder() {
      this.$emit('submit-order');
    },
    onSubmitDelete() {
      this.$emit('submit-delete');
    }
  }
}
</script>

<style scoped lang="scss">
/* 结算区域 - 根据设计稿 */
.cart-footer {
  position: fixed;
  bottom: 100rpx; /* 在tabbar上方，tabbar高度约100rpx */
  left: 0;
  right: 0;
  width: 100%;
  height: 152rpx; /* 76px = 152rpx */
  background: #FFFFFF;
  border-top: 1rpx solid #CCCCCC; /* 0.5px = 1rpx */
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24rpx; /* 12px = 24rpx */
  z-index: 99;
  
  &.on {
    padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom);
  }
}

/* 全选区域 */
.select-all-section {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.checkbox-wrapper {
  margin-right: 16rpx; /* 8px = 16rpx */
}

.checkbox-circle {
  width: 42rpx; /* 21px = 42rpx */
  height: 42rpx;
  border: 2rpx solid #B3B3B3; /* 1px = 2rpx */
  border-radius: 50%;
  background: #FFFFFF;
  position: relative;
  
  &.selected {
    background: #FE8B1B;
    border-color: #FE8B1B;
  }
}

.select-all-text {
  font-family: 'PingFang SC';
  font-size: 28rpx; /* 14px = 28rpx */
  line-height: 40rpx; /* 20px = 40rpx */
  color: #000000;
}

/* 合计区域 */
.total-section {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.total-text {
  font-family: 'PingFang SC';
  font-size: 24rpx; /* 12px = 24rpx */
  line-height: 34rpx; /* 17px = 34rpx */
  color: #333333;
  text-align: center;
}

/* 结算按钮 */
.checkout-section {
  display: flex;
  align-items: center;
}

.checkout-btn {
  width: 198rpx; /* 99px = 198rpx */
  height: 88rpx; /* 44px = 88rpx */
  background: linear-gradient(90deg, #FF7E00 0%, #FDA44D 100%);
  border-radius: 44rpx; /* 22px = 44rpx */
  border: none;

  font-family: 'PingFang SC';
  font-size: 36rpx; /* 18px = 36rpx */
  line-height: 50rpx; /* 25px = 50rpx */
  color: #FFFFFF;
  text-align: center;

  display: flex;
  align-items: center;
  justify-content: center;
}

/* 编辑模式按钮 */
.edit-buttons {
  display: flex;
  align-items: center;
  justify-content: center;
}

.edit-btn {
  width: 198rpx; /* 与结算按钮同宽 */
  height: 88rpx; /* 与结算按钮同高 */
  border-radius: 44rpx; /* 与结算按钮同圆角 */
  font-size: 36rpx; /* 与结算按钮同字号 */
  border: none;

  &.delete-btn {
    background: #FF4444;
    color: #FFFFFF;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
