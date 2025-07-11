<template>
  <view class="detail-header">
    <!-- 状态栏 -->
    <view class="status-bar"></view>

    <!-- header-section -->
    <view class="header-section">
      <!-- Rectangle 328 背景 -->
      <view class="header-background"></view>

      <!-- image 背景图片 -->
      <view class="header-image-container">
        <swiper class="header-swiper" circular autoplay interval="3000" duration="500" @change="swiperChange">
          <swiper-item v-for="(img, index) in images" :key="index">
            <image class="header-image" :src="img" mode="aspectFill" />
          </swiper-item>
        </swiper>
      </view>

      <!-- iPhone X (or newer) 状态栏 -->
      <view class="status-bar-overlay"></view>

      <!-- header 顶部导航栏 -->
      <view class="header-navbar">
        <!-- back-icon 返回按钮 -->
        <view class="back-btn" @click="goBack">
          <image class="back-icon" src="/static/images/index/business-info/back_arrow.svg" mode="aspectFit" />
        </view>

        <view class="nav-spacer"></view>

        <!-- favorites-icon 收藏按钮 -->
        <view class="favorites-btn" @click="toggleCollect" v-if="showCollect">
          <text class="star-icon" :class="{ 'collected': isCollected }">☆</text>
        </view>

        <!-- shar-icon 分享按钮 -->
        <view class="share-btn" @click="shareInfo">
          <image class="share-icon" src="/static/images/index/business-info/share.svg" mode="aspectFit" />
        </view>
      </view>

      <!-- preview-controller-button 预览控制按钮 -->
      <view class="preview-controller-button" @click="showPreview">
        <view class="controller-outer-circle">
          <view class="controller-inner-circle"></view>
        </view>
      </view>

      <!-- controller-section 媒体类型切换 -->
      <view class="controller-section">
        <!-- Rectangle 1290 背景 -->
        <view class="controller-background"></view>

        <!-- Rectangle 1291 选中背景 -->
        <view class="controller-active-bg" :style="{ left: activeTabLeft }"></view>

        <!-- VR 按钮 -->
        <view class="controller-tab" :class="{ active: mediaType === 'vr' }" @click="switchMediaType('vr')">
          <text class="tab-text">VR</text>
        </view>

        <!-- 照片 按钮 -->
        <view class="controller-tab" :class="{ active: mediaType === 'photo' }" @click="switchMediaType('photo')">
          <text class="tab-text">照片</text>
        </view>

        <!-- 视频 按钮 -->
        <view class="controller-tab" :class="{ active: mediaType === 'video' }" @click="switchMediaType('video')">
          <text class="tab-text">视频</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'DetailHeader',
  props: {
    images: {
      type: Array,
      default: () => []
    },
    showCollect: {
      type: Boolean,
      default: true
    },
    collected: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      currentSwiper: 0,
      mediaType: 'vr', // 媒体类型：vr, photo, video
      isCollected: this.collected
    }
  },
  computed: {
    activeTabLeft() {
      // 计算选中背景的位置
      switch(this.mediaType) {
        case 'vr': return '0rpx';
        case 'photo': return '112rpx';
        case 'video': return '224rpx';
        default: return '0rpx';
      }
    }
  },
  watch: {
    collected(newVal) {
      this.isCollected = newVal;
    }
  },
  methods: {
    swiperChange(e) {
      this.currentSwiper = e.detail.current;
      this.$emit('swiperChange', e.detail.current);
    },
    goBack() {
      this.$emit('goBack');
    },
    toggleCollect() {
      this.isCollected = !this.isCollected;
      this.$emit('toggleCollect', this.isCollected);
    },
    shareInfo() {
      this.$emit('shareInfo');
    },
    showPreview() {
      this.$emit('showPreview', this.currentSwiper);
    },
    switchMediaType(type) {
      this.mediaType = type;
      this.$emit('switchMediaType', type);
    }
  }
}
</script>

<style lang="scss" scoped>
.detail-header {
  .status-bar {
    height: 44rpx;
    width: 100%;
    background-color: transparent;
    position: absolute;
    top: 0;
    z-index: 20;
  }

  /* header-section */
  .header-section {
    width: 750rpx; /* 375px * 2 */
    height: 500rpx; /* 250px * 2 */
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  /* Rectangle 328 背景 */
  .header-background {
    position: absolute;
    width: 100%;
    height: 100%;
    background: #D9D9D9;
    z-index: 1;
  }

  /* image 背景图片 */
  .header-image-container {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 2;
  }

  .header-swiper {
    width: 100%;
    height: 100%;
  }

  .header-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  /* iPhone X (or newer) 状态栏覆盖 */
  .status-bar-overlay {
    position: absolute;
    width: 100%;
    height: 88rpx; /* 44px * 2 */
    top: 0;
    z-index: 10;
  }

  /* header 顶部导航栏 */
  .header-navbar {
    position: absolute;
    width: 704rpx; /* 352px * 2 */
    height: 42rpx; /* 21px * 2 */
    top: 96rpx; /* 48px * 2 */
    left: 24rpx; /* 12px * 2 */
    display: flex;
    align-items: center;
    z-index: 15;

    /* back-icon 返回按钮 */
    .back-btn {
      width: 42rpx; /* 21px * 2 */
      height: 42rpx; /* 21px * 2 */
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;

      .back-icon {
        width: 22.6rpx; /* 11.3px * 2 */
        height: 42rpx; /* 21px * 2 */
        filter: brightness(0) invert(1); /* 将图标变为白色 */
      }
    }

    .nav-spacer {
      flex: 1;
    }

    /* favorites-icon 收藏按钮 */
    .favorites-btn {
      width: 42rpx; /* 21px * 2 */
      height: 42rpx; /* 21px * 2 */
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 20rpx; /* 10px * 2 */
      cursor: pointer;

      .star-icon {
        font-size: 45rpx; /* 18px * 2 - 调整为与加盟详情页相似大小 */
        color: #FFFFFF;
        line-height: 1;
        text-align: center;

        &.collected {
          color: #FFD700; /* 收藏时显示金色 */
        }
      }
    }

    /* shar-icon 分享按钮 */
    .share-btn {
      width: 42rpx; /* 21px * 2 */
      height: 42rpx; /* 21px * 2 */
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;

      .share-icon {
        width: 42rpx; /* 21px * 2 */
        height: 42rpx; /* 21px * 2 */
      }
    }
  }

  /* preview-controller-button 预览控制按钮 */
  .preview-controller-button {
    position: absolute;
    width: 78rpx; /* 39px * 2 */
    height: 78rpx; /* 39px * 2 */
    left: 336rpx; /* 168px * 2 */
    top: 212rpx; /* 106px * 2 */
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 15;
    cursor: pointer;

    /* Ellipse 184 外圆 */
    .controller-outer-circle {
      width: 78rpx; /* 39px * 2 */
      height: 78rpx; /* 39px * 2 */
      border-radius: 50%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;

      /* Ellipse 185 内圆 */
      .controller-inner-circle {
        width: 38rpx; /* 19px * 2 */
        height: 38rpx; /* 19px * 2 */
        border-radius: 50%;
        border: 2rpx solid #FFFFFF; /* 1px * 2 */
        background: transparent;
      }
    }
  }

  /* controller-section 媒体类型切换 */
  .controller-section {
    position: absolute;
    width: 336rpx; /* 168px * 2 */
    height: 42rpx; /* 21px * 2 */
    left: 222rpx; /* 111px * 2 */
    top: 406rpx; /* 203px * 2 */
    display: flex;
    align-items: center;
    z-index: 15;

    /* Rectangle 1290 背景 */
    .controller-background {
      position: absolute;
      width: 100%;
      height: 100%;
      background: rgba(255, 255, 255, 0.85);
      border-radius: 21rpx; /* 10.5px * 2 */
      z-index: 1;
    }

    /* Rectangle 1291 选中背景 */
    .controller-active-bg {
      position: absolute;
      width: 112rpx; /* 56px * 2 */
      height: 42rpx; /* 21px * 2 */
      background: #FE9227;
      border-radius: 21rpx; /* 10.5px * 2 */
      transition: left 0.3s ease;
      z-index: 2;
    }

    .controller-tab {
      width: 112rpx; /* 56px * 2 */
      height: 42rpx; /* 21px * 2 */
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 3;
      cursor: pointer;

      .tab-text {
        font-family: 'PingFang SC';
        font-style: normal;
        font-weight: 400;
        font-size: 20rpx; /* 10px * 2 */
        line-height: 28rpx; /* 14px * 2 */
        color: #666666;
        transition: color 0.3s ease;
      }

      &.active .tab-text {
        color: #FFFFFF;
      }
    }
  }
}
</style>
