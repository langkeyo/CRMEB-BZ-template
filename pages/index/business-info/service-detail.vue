<template>
  <view class="service-detail">
    <!-- banner-section -->
    <view class="banner-section">
      <!-- bg-image 背景图片 -->
      <view class="bg-image">
        <swiper class="banner-swiper" circular autoplay interval="3000" duration="500">
          <swiper-item v-for="(img, index) in serviceInfo.images" :key="index">
            <image :src="img" mode="aspectFill" class="banner-image"></image>
          </swiper-item>
        </swiper>
      </view>

      <!-- nav-btn 导航按钮 -->
      <view class="nav-btn">
        <!-- back-icon 返回按钮 -->
        <view class="back-icon" @click="goBack">
          <image src="/static/images/index/business-info/back_arrow.svg" mode="aspectFit" class="back-arrow" />
        </view>

        <!-- share-icon 分享按钮 -->
        <view class="share-icon" @click="shareService">
          <image src="/static/images/index/business-info/share.svg" mode="aspectFit" class="share-arrow" />
        </view>
      </view>

      <!-- controller-btn 媒体控制器 -->
      <view class="controller-btn">
        <view class="controller-bg"></view>
        <view class="controller-active-bg" :style="{ transform: `translateX(${getActiveTabPosition()}rpx)` }"></view>
        <view class="media-tab" :class="{ 'active': mediaTab === 0 }" @click="switchMediaTab(0)">
          <text class="tab-text">照片</text>
        </view>
        <view class="media-tab" :class="{ 'active': mediaTab === 1 }" @click="switchMediaTab(1)">
          <text class="tab-text">视频</text>
        </view>
      </view>
    </view>

    <!-- service-card-section 服务卡片区域 -->
    <view class="service-card-section">
      <!-- header 标题行 -->
      <view class="service-header">
        <!-- title 服务标题 -->
        <view class="service-title">{{ serviceInfo.name }}</view>

        <!-- follow-btn 关注按钮 -->
        <view class="follow-btn" @click="toggleFollow">
          <text class="follow-text">{{ serviceInfo.isFollowed ? '已关注' : '关注' }}</text>
        </view>
      </view>

      <!-- row1 评分和咨询行 -->
      <view class="rating-consultation-row">
        <!-- review 评分区域 -->
        <view class="review-section">
          <!-- 星级评分 -->
          <view class="rating-stars">
            <image v-for="n in 5" :key="n" class="star-icon" src="/static/images/index/business-info/review_star.svg" mode="aspectFit" />
          </view>
          <!-- 评分数字 -->
          <text class="rating-score">{{ serviceInfo.rating }}</text>
        </view>

        <!-- 分隔符 -->
        <text class="separator">丨</text>

        <!-- 咨询人数 -->
        <text class="consultation-count">{{ serviceInfo.ratingCount }}已咨询</text>
      </view>

      <!-- row2 服务描述 -->
      <view class="service-description">服务时间:{{ serviceInfo.serviceTime }}</view>

      <!-- row3 标签行 -->
      <view class="service-tags">
        <view class="service-tag" v-for="(tag, index) in serviceInfo.tags" :key="index">
          <text class="tag-text">{{ tag }}</text>
        </view>
      </view>
    </view>

    <!-- service-details-section 服务详情区域 -->
    <view class="service-details-section">
      <!-- 工作区域 -->
      <view class="work-area">
        <view class="work-area-title">工作区域</view>
        <view class="work-area-content" v-for="(area, index) in serviceInfo.workAreas" :key="index">
          {{ area }}
        </view>
      </view>

      <!-- 服务介绍 -->
      <view class="service-intro">
        <view class="service-intro-title">服务介绍</view>
        <view class="service-intro-content" :class="{ 'expanded': isServiceIntroExpanded }">
          {{ serviceInfo.introduction }}
        </view>
      </view>
    </view>

    <!-- expand-controller-section 展开控制器 -->
    <view class="expand-controller-section" @click="toggleServiceIntro">
      <view class="expand-text">{{ isServiceIntroExpanded ? '收起全部' : '展开全部' }}</view>
      <image class="expand-arrow" :class="{ 'arrow-up': isServiceIntroExpanded }" src="/static/images/index/business-info/arrow_down.svg" mode="aspectFit" />
    </view>

    <!-- footer-section 用户评价区域 -->
    <view class="footer-section">
      <!-- 用户评价标题 -->
      <view class="user-review-title">用户评价</view>

      <!-- row1 评价头部 -->
      <view class="review-header">
        <!-- left 头像 -->
        <view class="review-left">
          <image class="review-avatar" :src="serviceInfo.reviews[0].avatar" mode="aspectFill" />
        </view>

        <!-- right 用户信息 -->
        <view class="review-right">
          <!-- 用户名 -->
          <view class="reviewer-name">{{ serviceInfo.reviews[0].name }}</view>

          <!-- 评分和时间 -->
          <view class="review-info">
            <!-- review-stars 星级评分 -->
            <view class="review-stars">
              <image v-for="n in 5" :key="n" class="review-star-icon" src="/static/images/index/business-info/review_star.svg" mode="aspectFit" />
              <text class="review-rating-score">{{ serviceInfo.reviews[0].rating }}</text>
            </view>
            <!-- 评价时间 -->
            <view class="review-time">{{ serviceInfo.reviews[0].time }}</view>
          </view>
        </view>
      </view>

      <!-- row2 评价内容 -->
      <view class="review-content">{{ serviceInfo.reviews[0].content }}</view>

      <!-- row3 评价图片 -->
      <view class="review-images">
        <image v-for="(img, index) in serviceInfo.reviews[0].images" :key="index"
               class="review-image" :src="img" mode="aspectFill" />
      </view>

      <!-- Line 160 分割线 -->
      <view class="review-divider"></view>

      <!-- action-btn 底部按钮 -->
      <view class="action-buttons">
        <!-- 预约服务按钮 -->
        <view class="appointment-btn" @click="makeAppointment">
          <text class="btn-text">预约服务</text>
        </view>

        <!-- 在线咨询按钮 -->
        <view class="consultation-btn" @click="startConsultation">
          <text class="btn-text">在线咨询</text>
        </view>
      </view>
    </view>

    <!-- 全局遮罩 -->
    <view v-if="showMask" class="global-mask" @click="hideMask">
      <view class="mask-content" @click.stop>
        <!-- 电话预约 -->
        <view class="phone-appointment">
          <!-- 呼叫按钮 -->
          <view class="call-button" @click="makePhoneCall">
            <image class="phone-icon" src="/static/images/index/business-info/phone_icon.svg" mode="aspectFit" />
            <text class="phone-text">呼叫(010)1235 8521</text>
          </view>

          <!-- 取消按钮 -->
          <view class="cancel-button" @click="hideMask">
            <text class="cancel-text">取消</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { startOnlineConsultationWithLogin } from '@/utils/loginCheck.js';
import { getConvenientServiceInfo } from '@/api/group.js'

export default {
  data() {
    return {
      serviceId: null,
      mediaTab: 0, // 0: 图片, 1: 视频
      isServiceIntroExpanded: false, // 服务介绍展开状态
      showMask: false, // 全局遮罩显示状态
      serviceInfo: {
        id: 1,
        name: '快速上门开荒深度清洁地毯',
        isFollowed: false,
        rating: '5.0',
        ratingCount: '364人',
        serviceTime: '周一至周日 00:00-24:00',
        tags: ['入驻1年', '平台保障', '日常保洁', '家庭清洁'],
        images: [
          '/static/images/index/business-info/service_img1.png',
          '/static/images/index/business-info/service_img1.png',
          '/static/images/index/business-info/service_img1.png'
        ],
        workAreas: ['朝阳区'],
        introduction: '声明:开荒保洁，家庭保洁，我们一步到位，自备保洁用具，业主只需提供水、电!如有需要吸尘器的顾客，请提前，我给您自备。\n\n厨厕重点清洁，不留卫生死角。\n\n使用中性清洁剂，高效去油剂，强力洁厕剂，配合除水垢除霉渍等针对性处理，重污垢要配合高压喷射清洗。\n\n注:如是出租房，我们会加大力量全面消毒，并且清洗杀菌消毒，做到干净卫生，安全高效，杜绝细菌交叉感染，对所有卫生间消毒杀菌，如有一次性设备全部更换。',
        reviews: [
          {
            id: 1,
            name: '加载中.....',
            avatar: '/static/images/index/business-info/service_avatar.png',
            rating: '5.0',
            time: '2025-4-8',
            content: '保洁阿姨打扫的很干净,很仔细,阿姨性格也很好,聊得来总之很满意!',
            images: [
              '/static/images/index/business-info/row3_img1.png',
              '/static/images/index/business-info/row3_img2.png',
              '/static/images/index/business-info/row3_img3.png'
            ]
          }
        ]
      }
    }
  },
  onLoad(options) {
    if (options.id) {
      this.serviceId = options.id;
      // 根据ID从后端获取服务详情
      this.getServiceDetail(this.serviceId);
    }

    // 设置状态栏为透明
    uni.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: 'rgba(0,0,0,0)',
      animation: {
        duration: 400,
        timingFunc: 'easeIn'
      }
    });
  },
  methods: {
    goBack() {
      uni.navigateBack();
    },
    switchMediaTab(index) {
      this.mediaTab = index;
    },
    toggleFollow() {
      this.serviceInfo.isFollowed = !this.serviceInfo.isFollowed;
      uni.showToast({
        title: this.serviceInfo.isFollowed ? '已关注' : '已取消关注',
        icon: 'none'
      });
    },
    async getServiceDetail(id) {
      try {
        console.log('获取ID为', id, '的便民服务详情');

        const response = await getConvenientServiceInfo(id);

        if (response.status === 200 && response.data) {
          const data = response.data;

          // 映射API数据到页面数据结构
          this.serviceInfo = {
            ...this.serviceInfo,
            id: data.id,
            name: data.title || this.serviceInfo.name,
            image: data.image || this.serviceInfo.image,
            images: data.images ? data.images.split(',') : this.serviceInfo.images,
            rating: data.star ? data.star.toString() : this.serviceInfo.rating,
            serviceTime: data.service_time || this.serviceInfo.serviceTime,
            tags: data.tags ? data.tags.split('|') : this.serviceInfo.tags,
            description: data.intro || this.serviceInfo.description,
            inquiriesCount: data.inquiries_count || this.serviceInfo.inquiriesCount,
            area: data.district?.name || data.district_name || this.serviceInfo.area,
            video: data.video || this.serviceInfo.video
          };

          console.log('便民服务详情加载成功:', this.serviceInfo);
        } else {
          console.error('获取便民服务详情失败:', response.msg);
          uni.showToast({
            title: response.msg || '获取详情失败',
            icon: 'none'
          });
        }
      } catch (error) {
        console.error('获取便民服务详情异常:', error);
        uni.showToast({
          title: '网络错误，请稍后重试',
          icon: 'none'
        });
      }
    },

    shareService() {
      uni.showToast({
        title: '分享功能开发中',
        icon: 'none'
      });
    },
    getActiveTabPosition() {
      // controller-btn总宽度：107px * 2 = 214rpx
      // 每个tab宽度：214rpx / 2 = 107rpx
      // controller-active-bg宽度：56px * 2 = 112rpx
      if (this.mediaTab === 0) return 0;
      if (this.mediaTab === 1) return 112; // 第二个位置
      return 0;
    },
    toggleServiceIntro() {
      this.isServiceIntroExpanded = !this.isServiceIntroExpanded;
    },
    makeAppointment() {
      this.showMask = true;
    },
    hideMask() {
      this.showMask = false;
    },
    makePhoneCall() {
      uni.makePhoneCall({
        phoneNumber: '010-1235-8521',
        success: () => {
          console.log('拨打电话成功');
        },
        fail: () => {
          uni.showToast({
            title: '拨打电话失败',
            icon: 'none'
          });
        }
      });
    },
    startConsultation() {
      // 使用工具函数检查登录状态并处理在线咨询
      startOnlineConsultationWithLogin();
    }
  }
}
</script>

<style lang="scss" scoped>
.service-detail {
  min-height: 100vh;
  background-color: #F5F5F5;
  display: flex;
  flex-direction: column;
}

/* banner-section */
.banner-section {
  position: relative;
  width: 750rpx; /* 375px * 2 */
  height: 500rpx; /* 250px * 2 */
  background: #D9D9D9;
  overflow: hidden;
  flex-shrink: 0;

  /* bg-image 背景图片 */
  .bg-image {
    position: absolute;
    width: 750rpx; /* 375px * 2 */
    height: 500rpx; /* 250px * 2 */
    left: 0;
    top: 0;

    .banner-swiper {
      width: 100%;
      height: 100%;

      .banner-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
  }

  /* nav-btn 导航按钮 */
  .nav-btn {
    position: absolute;
    width: 704rpx; /* 352px * 2 */
    height: 42rpx; /* 21px * 2 */
    left: 24rpx; /* 12px * 2 */
    top: 20rpx; /* 调整顶部按钮位置，从40rpx改为20rpx */
    display: flex;
    justify-content: space-between;
    align-items: center;
    z-index: 10;

    /* back-icon 返回按钮 */
    .back-icon {
      width: 22rpx; /* 7px * 2 */
      height: 40.85rpx; /* 13px * 2 */

      .back-arrow {
        width: 22rpx; /* 7px * 2 */
        height: 48.85rpx; /* 13px * 2 */
        filter: brightness(0) invert(1); /* 将图标变为白色 */
      }
    }

    /* share-icon 分享按钮 */
    .share-icon {
      width: 42rpx; /* 21px * 2 */
      height: 42rpx; /* 21px * 2 */

      .share-arrow {
        width: 42rpx; /* 21px * 2 */
        height: 42rpx; /* 21px * 2 */
        filter: brightness(0) invert(1); /* 将图标变为白色 */
      }
    }
  }

  /* controller-btn 媒体控制器 */
  .controller-btn {
    position: absolute;
    width: 214rpx; /* 107px * 2 */
    height: 42rpx; /* 21px * 2 */
    left: 268rpx; /* 134px * 2 */
    top: 406rpx; /* 203px * 2 */

    .controller-bg {
      /* Rectangle 1290 */
      position: absolute;
      width: 214rpx; /* 107px * 2 */
      height: 42rpx; /* 21px * 2 */
      left: 0;
      top: 0;
      background: rgba(255, 255, 255, 0.85);
      border-radius: 21rpx; /* 10.5px * 2 */
    }

    .controller-active-bg {
      /* Rectangle 1291 */
      position: absolute;
      width: 112rpx; /* 56px * 2 */
      height: 42rpx; /* 21px * 2 */
      left: 0;
      top: 0;
      background: #FE9227;
      border-radius: 21rpx; /* 10.5px * 2 */
      transition: transform 0.3s ease;
      z-index: 1;
    }

    .media-tab {
      position: absolute;
      width: 107rpx; /* 53.5px * 2 */
      height: 42rpx; /* 21px * 2 */
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 2;

      &:first-of-type {
        left: 0;
      }

      &:last-of-type {
        right: 0;
      }

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

/* service-card-section 服务卡片区域 */
.service-card-section {
  width: 750rpx; /* 375px * 2 */
  height: 270rpx; /* 135px * 2 */
  background: #FFFFFF;
  border-radius: 8rpx; /* 4px * 2 */
  padding: 20rpx 24rpx; /* 10px 12px */
  margin: 20rpx auto; /* 居中对齐 */
  flex-shrink: 0;
  display: flex;
  flex-direction: column;

  /* header 标题行 */
  .service-header {
    height: 52rpx; /* 26px * 2 */
    margin-bottom: 20rpx; /* 10px * 2 */
    display: flex;
    justify-content: space-between;
    align-items: center;

    /* title 服务标题 */
    .service-title {
      flex: 1;
      font-family: 'PingFang SC';
      font-style: normal;
      font-weight: 400;
      font-size: 36rpx; /* 18px * 2 */
      line-height: 50rpx; /* 25px * 2 */
      color: #000000;
      margin-right: 20rpx;
    }

    /* follow-btn 关注按钮 */
    .follow-btn {
      width: 136rpx; /* 68px * 2 */
      height: 52rpx; /* 26px * 2 */
      background: linear-gradient(90deg, #FF7E00 0%, #FDA44D 100%);
      border-radius: 44rpx; /* 22px * 2 */
      display: flex;
      align-items: center;
      justify-content: center;

      .follow-text {
        font-family: 'PingFang SC';
        font-style: normal;
        font-weight: 400;
        font-size: 36rpx; /* 18px * 2 */
        line-height: 50rpx; /* 25px * 2 */
        color: #FFFFFF;
      }
    }
  }

  /* row1 评分和咨询行 */
  .rating-consultation-row {
    height: 40rpx; /* 20px * 2 */
    margin-bottom: 20rpx; /* 10px * 2 */
    display: flex;
    align-items: center;

    /* review 评分区域 */
    .review-section {
      display: flex;
      align-items: center;

      /* 星级评分 */
      .rating-stars {
        display: flex;
        gap: 4rpx; /* 2px * 2 星星间距 */

        .star-icon {
          width: 28rpx; /* 14px * 2 */
          height: 28rpx; /* 14px * 2 */
        }
      }

      /* 5.0 评分数字 */
      .rating-score {
        font-family: 'PingFang SC';
        font-style: normal;
        font-weight: 400;
        font-size: 28rpx; /* 14px * 2 */
        line-height: 40rpx; /* 20px * 2 */
        color: #FF840C;
        margin-left: 20rpx; /* 10px * 2 星星和评分间距 */
      }
    }

    /* 分隔符 */
    .separator {
      font-family: 'PingFang SC';
      font-style: normal;
      font-weight: 400;
      font-size: 24rpx; /* 12px * 2 */
      line-height: 34rpx; /* 17px * 2 */
      color: #CCCCCC;
      margin: 0 16rpx; /* 8px * 2 左右间距 */
    }

    /* 366人已咨询 */
    .consultation-count {
      font-family: 'PingFang SC';
      font-style: normal;
      font-weight: 400;
      font-size: 24rpx; /* 12px * 2 */
      line-height: 34rpx; /* 17px * 2 */
      color: #CCCCCC;
    }
  }

  /* row2 服务描述 */
  .service-description {
    height: 40rpx; /* 20px * 2 */
    margin-bottom: 20rpx; /* 10px * 2 */
    font-family: 'PingFang SC';
    font-style: normal;
    font-weight: 400;
    font-size: 28rpx; /* 14px * 2 */
    line-height: 40rpx; /* 20px * 2 */
    color: #333333;
  }

  /* row3 标签行 */
  .service-tags {
    height: 34rpx; /* 17px * 2 */
    display: flex;
    align-items: center;
    gap: 20rpx; /* 10px * 2 标签间距 */

    .service-tag {
      width: 124rpx; /* 62px * 2 */
      height: 34rpx; /* 17px * 2 */
      border: 2rpx solid #FF840B; /* 1px * 2 */
      border-radius: 8rpx; /* 4px * 2 */
      display: flex;
      align-items: center;
      justify-content: center;
      box-sizing: border-box;

      .tag-text {
        font-family: 'PingFang SC';
        font-style: normal;
        font-weight: 400;
        font-size: 24rpx; /* 12px * 2 */
        line-height: 34rpx; /* 17px * 2 */
        color: #FF7E00;
        white-space: nowrap;
      }
    }
  }
}

/* service-details-section 服务详情区域 */
.service-details-section {
  width: 750rpx; /* 375px * 2 */
  height: 698rpx; /* 349px * 2 */
  background: #FFFFFF;
  border-radius: 8rpx; /* 4px * 2 */
  padding: 20rpx 24rpx; /* 10px 12px */
  margin: 20rpx auto; /* 居中对齐 */
  display: flex;
  flex-direction: column;
  flex-shrink: 0;

  /* 工作区域 */
  .work-area {
    margin-bottom: 60rpx; /* 30px * 2 */

    .work-area-title {
      height: 40rpx; /* 20px * 2 */
      margin-bottom: 14rpx; /* 7px * 2 */

      font-family: 'PingFang SC';
      font-style: normal;
      font-weight: 400;
      font-size: 28rpx; /* 14px * 2 */
      line-height: 40rpx; /* 20px * 2 */
      color: #FF830B;
    }

    .work-area-content {
      height: 40rpx; /* 20px * 2 */

      font-family: 'PingFang SC';
      font-style: normal;
      font-weight: 400;
      font-size: 28rpx; /* 14px * 2 */
      line-height: 40rpx; /* 20px * 2 */
      color: #333333;
    }
  }

  /* 服务介绍 */
  .service-intro {
    flex: 1; /* 占据剩余空间 */

    .service-intro-title {
      height: 40rpx; /* 20px * 2 */
      margin-bottom: 20rpx; /* 10px * 2 */

      font-family: 'PingFang SC';
      font-style: normal;
      font-weight: 400;
      font-size: 28rpx; /* 14px * 2 */
      line-height: 40rpx; /* 20px * 2 */
      color: #FF830B;
    }

    .service-intro-content {
      width: 698rpx; /* 349px * 2 */
      max-height: 520rpx; /* 260px * 2 */
      overflow: hidden;

      font-family: 'PingFang SC';
      font-style: normal;
      font-weight: 400;
      font-size: 28rpx; /* 14px * 2 */
      line-height: 40rpx; /* 20px * 2 */
      color: #333333;
      white-space: pre-wrap;

      &.expanded {
        max-height: none;
      }
    }
  }
}

/* expand-controller-section 展开控制器 */
.expand-controller-section {
  width: 750rpx; /* 375px * 2 */
  height: 136rpx; /* 68px * 2 */
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.5) 0%, #FFFFFF 44.36%);
  border-radius: 8rpx; /* 4px * 2 */
  margin: 0 auto; /* 居中对齐 */
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  gap: 20rpx; /* 10px * 2 文字和箭头间距 */
  flex-shrink: 0;

  .expand-text {
    font-family: 'PingFang SC';
    font-style: normal;
    font-weight: 400;
    font-size: 24rpx; /* 12px * 2 */
    line-height: 34rpx; /* 17px * 2 */
    color: #999999;
    text-align: center;
  }

  .expand-arrow {
    width: 32rpx; /* 16px * 2 */
    height: 32rpx; /* 16px * 2 */
    transition: transform 0.3s ease;

    &.arrow-up {
      transform: rotate(180deg);
    }
  }
}

/* footer-section 用户评价区域 */
.footer-section {
  width: 750rpx; /* 375px * 2 */
  background: #FFFFFF;
  border-radius: 8rpx; /* 4px * 2 */
  padding: 20rpx 24rpx; /* 10px 12px */
  margin: 20rpx auto; /* 居中对齐 */
  margin-bottom: 160rpx; /* 为底部按钮留出空间 */
  flex: 1;

  /* 用户评价标题 */
  .user-review-title {
    height: 40rpx; /* 20px * 2 */
    margin-bottom: 78rpx; /* 39px * 2 */

    font-family: 'PingFang SC';
    font-style: normal;
    font-weight: 400;
    font-size: 28rpx; /* 14px * 2 */
    line-height: 40rpx; /* 20px * 2 */
    color: #FF830B;
  }

  /* row1 评价头部 */
  .review-header {
    height: 90rpx; /* 45px * 2 */
    margin-bottom: 18rpx; /* 9px * 2 */
    display: flex;
    align-items: center;

    /* left 头像 */
    .review-left {
      width: 88rpx; /* 44px * 2 */
      height: 88rpx; /* 44px * 2 */
      margin-right: 24rpx; /* 12px * 2 */

      .review-avatar {
        width: 88rpx; /* 44px * 2 */
        height: 88rpx; /* 44px * 2 */
        border-radius: 50%;
        object-fit: cover;
      }
    }

    /* right 用户信息 */
    .review-right {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 88rpx; /* 44px * 2 */

      /* 用户名 */
      .reviewer-name {
        font-family: 'PingFang SC';
        font-style: normal;
        font-weight: 400;
        font-size: 36rpx; /* 18px * 2 */
        line-height: 50rpx; /* 25px * 2 */
        color: #1A1A1A;
      }

      /* 评分和时间 */
      .review-info {
        display: flex;
        justify-content: space-between;
        align-items: center;

        /* review-stars 星级评分 */
        .review-stars {
          display: flex;
          align-items: center;
          gap: 4rpx; /* 2px * 2 */

          .review-star-icon {
            width: 28rpx; /* 14px * 2 */
            height: 28rpx; /* 14px * 2 */
          }

          .review-rating-score {
            margin-left: 20rpx; /* 10px * 2 */
            font-family: 'PingFang SC';
            font-style: normal;
            font-weight: 400;
            font-size: 28rpx; /* 14px * 2 */
            line-height: 40rpx; /* 20px * 2 */
            color: #FF840C;
          }
        }

        /* 评价时间 */
        .review-time {
          font-family: 'PingFang SC';
          font-style: normal;
          font-weight: 400;
          font-size: 20rpx; /* 10px * 2 */
          line-height: 28rpx; /* 14px * 2 */
          color: #B3B3B3;
        }
      }
    }
  }

  /* row2 评价内容 */
  .review-content {
    height: 100rpx; /* 50px * 2 */
    margin-bottom: 20rpx; /* 10px * 2 */

    font-family: 'PingFang SC';
    font-style: normal;
    font-weight: 400;
    font-size: 36rpx; /* 18px * 2 */
    line-height: 50rpx; /* 25px * 2 */
    color: #1A1A1A;
  }

  /* row3 评价图片 */
  .review-images {
    /* Auto layout */
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0;
    gap: 40rpx; /* 20px * 2 */

    width: 704rpx; /* 352px * 2 */
    height: 208rpx; /* 104px * 2 */
    margin-bottom: 28rpx; /* 14px * 2 */

    .review-image {
      width: 208rpx; /* 104px * 2 */
      height: 208rpx; /* 104px * 2 */
      border-radius: 8rpx; /* 4px * 2 */
      object-fit: cover;

      /* Inside auto layout */
      flex: none;
      flex-grow: 0;
    }
  }

  /* Line 160 分割线 */
  .review-divider {
    width: 698rpx; /* 349px * 2 */
    height: 1rpx; /* 0.5px * 2 */
    border: 1rpx solid #E3E4DC; /* 0.5px * 2 */
    margin-bottom: 14rpx; /* 7px * 2 */
  }

  /* action-btn 底部按钮 */
  .action-buttons {
    width: 702rpx; /* 351px * 2 */
    height: 80rpx; /* 40px * 2 */
    display: flex;
    gap: 20rpx; /* 10px * 2 按钮间距 */

    /* 预约服务按钮 */
    .appointment-btn {
      width: 336rpx; /* 168px * 2 */
      height: 80rpx; /* 40px * 2 */
      background: #FFC082;
      border-radius: 40rpx 52rpx 52rpx 40rpx; /* 20px 26px 26px 20px */
      display: flex;
      align-items: center;
      justify-content: center;

      .btn-text {
        width: 112rpx; /* 56px * 2 */
        height: 36rpx; /* 18px * 2 */
        font-family: 'PingFang SC';
        font-style: normal;
        font-weight: 400;
        font-size: 28rpx; /* 14px * 2 */
        line-height: 36rpx; /* 18px * 2 */
        color: #FFFFFF;
        text-align: center;
      }
    }

    /* 在线咨询按钮 */
    .consultation-btn {
      width: 346rpx; /* 173px * 2 */
      height: 80rpx; /* 40px * 2 */
      background: #FF840B;
      border-radius: 40rpx 52rpx 52rpx 40rpx; /* 20px 26px 26px 20px */
      display: flex;
      align-items: center;
      justify-content: center;

      .btn-text {
        width: 112rpx; /* 56px * 2 */
        height: 36rpx; /* 18px * 2 */
        font-family: 'PingFang SC';
        font-style: normal;
        font-weight: 400;
        font-size: 28rpx; /* 14px * 2 */
        line-height: 36rpx; /* 18px * 2 */
        color: #FFFFFF;
        text-align: center;
      }
    }
  }
}

/* 全局遮罩 - 按照Figma精确实现 */
.global-mask {
  /* Rectangle 1428 - 半透明背景 */
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5); /* fill_3XNE8I */
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;

  .mask-content {
    position: absolute;
    bottom: 100rpx; /* 距离底部一定距离 */
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20rpx; /* 按钮间距 */

    .phone-appointment {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 20rpx; /* 按钮间距 */

      /* Group 1533 - 呼叫按钮 */
      .call-button {
        /* Rectangle 1363 */
        width: 702rpx; /* 351px * 2 */
        height: 142rpx; /* 71px * 2 */
        background: #FFFFFF; /* fill_MZG33V */
        border-radius: 8rpx; /* 4px * 2 */
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;

        .phone-icon {
          /* Vector */
          width: 32rpx; /* 16px * 2 */
          height: 32rpx; /* 16px * 2 */
          margin-right: 16rpx; /* 8px * 2 */
          /* fill_PY2411 - #4D4D4D */
          filter: brightness(0) saturate(0) invert(0.3);
        }

        .phone-text {
          /* 呼叫(010)1235 8521 - style_4WCLYR */
          font-family: 'PingFang SC';
          font-style: normal;
          font-weight: 400;
          font-size: 32rpx; /* 16px * 2 */
          line-height: 44rpx; /* 22px * 2 */
          color: #007AFF; /* fill_QY99BN */
        }
      }

      /* Group 1534 - 取消按钮 */
      .cancel-button {
        /* Rectangle 1364 */
        width: 702rpx; /* 351px * 2 */
        height: 100rpx; /* 50px * 2 */
        background: #FFFFFF; /* fill_MZG33V */
        border-radius: 8rpx; /* 4px * 2 */
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;

        .cancel-text {
          /* 取消 - style_4WCLYR */
          font-family: 'PingFang SC';
          font-style: normal;
          font-weight: 400;
          font-size: 32rpx; /* 16px * 2 */
          line-height: 44rpx; /* 22px * 2 */
          color: #007AFF; /* fill_QY99BN */
        }
      }
    }
  }
}

</style>
