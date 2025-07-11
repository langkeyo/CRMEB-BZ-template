<template>
  <view class="cart-header">
    <!-- 状态栏高度 -->
    <view class="status-bar"></view>
    <!-- 导航内容 -->
    <view class="nav-content">
      <view class="title">{{ $t(`购物车`) }}</view>
      <view
        v-if="hasItems"
        class="edit"
        @click="onManage"
      >
        {{ isEditing ? $t(`完成`) : $t(`编辑`) }}
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'CartHeader',
  props: {
    hasItems: {
      type: Boolean,
      default: false
    },
    isEditing: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    onManage() {
      this.$emit('manage');
    }
  }
}
</script>

<style scoped lang="scss">
.cart-header {
  background-color: #fff;
  
  .status-bar {
    height: 44px; /* 状态栏高度 */
  }
  
  .nav-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 96rpx;
    padding: 0 30rpx;
    position: relative;
  }
  
  .title {
    font-size: 36rpx; /* 根据设计稿调整字体大小 */
    font-weight: bold;
    color: #1A1A1A;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
  
  .edit {
    font-size: 28rpx;
    color: #666;
    padding: 2rpx 10rpx;
  }
}
</style>
