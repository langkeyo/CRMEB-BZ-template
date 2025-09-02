<template>
  <tui-drawer :visible="visible" mode="bottom" mask maskClosable @close="close">
    <view class="review-popup">
      <view class="popup-header">
        <text class="popup-title">评价</text>
        <text class="popup-close" @tap="close">×</text>
      </view>
      <view class="popup-tabs">
        <view :class="['popup-tab', tab==='buyer' ? 'active' : '']" @tap="tab='buyer'">买家秀</view>
        <view :class="['popup-tab', tab==='qa' ? 'active' : '']" @tap="tab='qa'">问大家</view>
      </view>
      <view v-if="tab==='buyer'" class="popup-buyer">
        <!-- 买家秀内容 -->
        <template v-if="hasBuyerContent">
          <slot name="buyer"></slot>
        </template>
        
        <!-- 买家秀空状态 -->
        <view v-else class="empty-state">
          <image class="empty-image" src="/static/common/icons/info/cute-bun-on-sofa-icon.svg" mode="aspectFit"></image>
          <text class="empty-text">暂无买家评价</text>
          <view class="empty-tip">成为第一个评价的人吧</view>
        </view>
      </view>
      <view v-else class="popup-qa">
        <!-- 搜索框始终显示 -->
        <view class="qa-search-bar">
          <image class="icon-search" src="/static/icons/search.svg" style="width:15px;height:15px;" />
          <input class="qa-search-input" placeholder="直接搜索你想问的问题吧~" v-model="search" @confirm="onSearch" confirm-type="search" />
        </view>
        
        <!-- 问大家内容 -->
        <template v-if="hasQaContent">
          <slot name="qa"></slot>
        </template>
        
        <!-- 问大家空状态 -->
        <view v-else class="empty-state">
          <image class="empty-image" src="/static/common/icons/info/cute-bun-on-sofa-icon.svg" mode="aspectFit"></image>
          <text class="empty-text">暂无问答内容</text>
          <view class="empty-tip">有问题？快来提问吧</view>
        </view>

        <!-- 悬浮提问按钮 -->
        <view 
          class="qa-fab" 
          :style="fabStyle"
          @touchstart="onFabTouchStart"
          @touchmove="onFabTouchMove"
          @touchend="onFabTouchEnd"
          @tap="$emit('ask-question')"
        >
          <image src="/static/icons/ask-btn.svg" class="qa-fab-icon" />
        </view>
      </view>
    </view>
  </tui-drawer>
</template>
<script>
import tuiDrawer from '@/components/tuiDrawer/tui-drawer.vue';
import { HTTP_REQUEST_URL } from '@/config/app.js';

export default {
  name: 'ReviewPopup',
  components: { tuiDrawer },
  props: {
    visible: Boolean,
    buyerContentCount: {
      type: Number,
      default: 0
    },
    qaContentCount: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      tab: 'buyer',
      search: '',
      debounceTimer: null,
      hasBuyerContent: false,
      hasQaContent: false,
      fabX: null,
      fabY: null,
      fabDragging: false,
      fabStartX: 0,
      fabStartY: 0,
      fabTouchStartX: 0,
      fabTouchStartY: 0,
      askBtnUrl: HTTP_REQUEST_URL + '/static/icons/ask-btn.svg'
    }
  },
  computed: {
    fabStyle() {
      // 默认右下角固定位置
      if (this.fabX === null) {
        return 'right: 40rpx; bottom: 80rpx;';
      }
      // 拖动后的位置
      return `left:${this.fabX}px;top:${this.fabY}px;`;
    }
  },
  created() {
    // 创建防抖函数
    this.debouncedSearch = (value) => {
      if (this.debounceTimer) clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(() => {
        this.$emit('search-change', value);
      }, 500);
    };
  },
  watch: {
    search(newVal) {
      // 使用防抖函数
      this.debouncedSearch(newVal);
    },
    buyerContentCount(newVal) {
      this.hasBuyerContent = newVal > 0;
    },
    qaContentCount(newVal) {
      this.hasQaContent = newVal > 0;
    },
    visible(newVal) {
      if (newVal) {
        // 当弹窗显示时，根据传入的计数更新内容状态
        this.hasBuyerContent = this.buyerContentCount > 0;
        this.hasQaContent = this.qaContentCount > 0;
      }
    }
  },
  methods: {
    close() {
      this.$emit('close');
    },
    switchTab(tabName) {
      // 切换到指定的标签页
      if (tabName === 'buyer' || tabName === 'qa') {
        this.tab = tabName;
      }
    },
    onSearch() {
      // 立即搜索，清除任何待处理的防抖计时器
      if (this.debounceTimer) clearTimeout(this.debounceTimer);
      this.$emit('search-change', this.search);
    },
    // 设置买家秀内容状态
    setBuyerContentStatus(hasContent) {
      this.hasBuyerContent = hasContent;
    },
    // 设置问答内容状态
    setQaContentStatus(hasContent) {
      this.hasQaContent = hasContent;
    },
    onFabTouchStart(e) {
      this.fabDragging = true;
      this.fabTouchStartX = e.touches[0].clientX;
      this.fabTouchStartY = e.touches[0].clientY;
      this.fabStartX = this.fabX !== null ? this.fabX : (uni.getSystemInfoSync().windowWidth - uni.upx2px(140));
      this.fabStartY = this.fabY !== null ? this.fabY : (uni.getSystemInfoSync().windowHeight - uni.upx2px(220));
    },
    onFabTouchMove(e) {
      if (!this.fabDragging) return;
      const moveX = e.touches[0].clientX - this.fabTouchStartX;
      const moveY = e.touches[0].clientY - this.fabTouchStartY;
      // 限制范围
      let newX = this.fabStartX + moveX;
      let newY = this.fabStartY + moveY;
      const minX = 0;
      const minY = 0;
      const maxX = uni.getSystemInfoSync().windowWidth - uni.upx2px(100);
      const maxY = uni.getSystemInfoSync().windowHeight - uni.upx2px(100);
      if (newX < minX) newX = minX;
      if (newY < minY) newY = minY;
      if (newX > maxX) newX = maxX;
      if (newY > maxY) newY = maxY;
      this.fabX = newX;
      this.fabY = newY;
    },
    onFabTouchEnd() {
      this.fabDragging = false;
    }
  }
}
</script>
<style scoped lang="scss">
.review-popup {
  background: #fff;
  border-radius: 16rpx 16rpx 0 0;
  min-height: 75vh; /* 增加最小高度到75vh */
  max-height: 85vh; /* 增加最大高度到85vh */
  overflow: hidden;
}
.popup-header {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  height: 88rpx; /* 增加头部高度 */
  padding-top: 20rpx; /* 增加顶部内边距 */
  font-size: 32rpx;
  font-weight: 500;
  border-bottom: 1px solid #f5f5f5;
}
.popup-title {
  flex: 1;
  text-align: center;
}
.popup-close {
  position: absolute;
  right: 32rpx;
  top: 20rpx; /* 调整关闭按钮位置 */
  font-size: 40rpx;
  color: #999;
  line-height: 56rpx;
}
.popup-tabs {
  display: flex;
  border-bottom: 1px solid #f5f5f5;
  background: #fff;
  padding: 10rpx 0; /* 增加Tab区域内边距 */
}
.popup-tab {
  flex: 1;
  text-align: center;
  font-size: 28rpx;
  color: #999;
  padding: 24rpx 0 16rpx 0;
  border-bottom: 2px solid transparent;
}
.popup-tab.active {
  color: #ff840b;
  font-weight: 500;
  border-bottom: 2px solid #ff840b;
}
.popup-buyer, .popup-qa {
  padding: 0 24rpx;
  min-height: 65vh; /* 增加内容区最小高度 */
  max-height: 75vh; /* 增加内容区最大高度 */
  overflow-y: auto;
}
.qa-search-bar {
  display: flex;
  align-items: center;
  background: #f5f5f5;
  border-radius: 32rpx;
  margin: 24rpx 0 16rpx 0;
  padding: 0 24rpx;
  height: 56rpx;
}
.icon-search {
  font-size: 28rpx;
  color: #bbb;
  margin-right: 12rpx;
}
.qa-search-input {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 26rpx;
  outline: none;
}
.search-btn {
  font-size: 26rpx;
  color: #ff840b;
  padding: 0 16rpx;
  white-space: nowrap;
}
.qa-item {
  padding: 24rpx 0;
  border-bottom: 1px solid #f5f5f5;
}
.qa-user {
  display: flex;
  align-items: center;
  margin-bottom: 16rpx;
}
.qa-avatar {
  width: 40rpx;
  height: 40rpx;
  border-radius: 50%;
  margin-right: 16rpx;
}
.qa-username {
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
}
.qa-time {
  font-size: 24rpx;
  color: #999;
  margin-left: 16rpx;
}
.qa-question {
  font-size: 28rpx;
  color: #333;
  line-height: 1.5;
  margin-bottom: 16rpx;
}
.qa-answers {
  margin-top: 16rpx;
  background: transparent;
  padding: 0;
}
.qa-divider {
  height: 1rpx;
  background-color: #f5f5f5;
  margin: 16rpx 0;
}
.qa-answer {
  font-size: 26rpx;
  color: #666;
  background: transparent;
  padding: 0;
  border-radius: 0;
  margin-bottom: 12rpx;
  display: flex;
  align-items: center;
}
.answer-avatar {
  width: 40rpx;
  height: 40rpx;
  border-radius: 50%;
  margin-right: 16rpx;
  flex-shrink: 0;
}
.answer-text {
  flex: 1;
  display: flex;
  align-items: center;
}
.qa-more {
  font-size: 26rpx;
  color: #999;
  text-align: center;
  padding: 20rpx 0;
}

/* 空状态样式 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100rpx 0;
}

.empty-image {
  width: 160rpx;
  height: 160rpx;
  margin-bottom: 30rpx;
}

.empty-text {
  font-size: 30rpx;
  color: #333;
  font-weight: 500;
  margin-bottom: 16rpx;
}

.empty-tip {
  font-size: 26rpx;
  color: #FF840B;
}

.qa-fab {
  position: fixed;
  z-index: 9999;
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.12);
  background-color: transparent; /* 透明背景，显示SVG本身的背景 */
  overflow: hidden;
}

.qa-fab-icon {
  width: 100rpx;
  height: 100rpx;
  display: block;
}
</style> 