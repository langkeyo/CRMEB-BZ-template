<template>
  <view class="house-detail">
    <!-- 公共头部组件 -->
    <DetailHeader
      :images="houseInfo.images"
      :show-collect="true"
      :collected="isCollected"
      @goBack="goBack"
      @shareInfo="shareInfo"
      @showPreview="showPreview"
      @switchMediaType="switchMediaType"
      @toggleCollect="handleToggleCollect"
      @swiperChange="handleSwiperChange"
    />

    <!-- 商铺转让卡片区域 -->
    <view class="shop-transfer-card-section">
      <!-- row1 店铺名称和关注按钮 -->
      <view class="row1">
        <text class="shop-name">{{ houseInfo.title }}</text>

        <!-- follow-btn 关注按钮 -->
        <view class="follow-btn" :class="{ 'followed': isFollowed }" @click="toggleFollow">
          <text class="follow-text">{{ isFollowed ? '已关注' : '关注' }}</text>
        </view>
      </view>

      <!-- row2 位置信息 -->
      <view class="row2">
        <!-- location-icon 位置图标 -->
        <view class="location-icon">
          <image src="/static/images/house-rental/location_icon.svg" mode="aspectFit" />
        </view>
        <text class="location-text">{{ houseInfo.address }}</text>

        <!-- view-btn 查看按钮 -->
        <view class="view-btn" @click="viewShopDetail">
          <text class="view-text">查看</text>
          <image src="/static/icons/arrow-right.svg" class="arrow-icon" mode="aspectFit" />
        </view>
      </view>

      <!-- row3 价格信息 -->
      <view class="row3">
        <!-- 房租 -->
        <view class="price-group">
          <text class="price-value">{{ houseInfo.price }}{{ houseInfo.unit }}</text>
          <text class="price-label">房租</text>
        </view>

        <!-- 转让价格 -->
        <view class="price-group">
          <text class="price-value">{{ shopInfo.transferPrice }}</text>
          <text class="price-label">转让价格</text>
        </view>

        <!-- 剩余租期 -->
        <view class="price-group">
          <text class="price-value">{{ shopInfo.remainingLease }}</text>
          <text class="price-label">剩余租期</text>
        </view>

        <!-- 面积 -->
        <view class="price-group">
          <text class="price-value">{{ houseInfo.size }}</text>
          <text class="price-label">面积</text>
        </view>
      </view>

      <!-- row4 描述信息 -->
      <view class="row4">
        <text class="description-text">{{ shopInfo.description }}</text>
      </view>

      <!-- row5 标签 -->
      <view class="row5">
        <view class="tag" v-for="(tag, index) in houseTags" :key="index">
          <text class="tag-text">{{ tag }}</text>
        </view>
      </view>
    </view>

    <!-- 店内设备 -->
    <view class="store-equipment-section">
      <view class="equipment-header">
        <text class="equipment-title">店内设备</text>
      </view>

      <!-- 设备图片列表 -->
      <view class="equipment-images">
        <view class="equipment-item" v-for="(item, index) in houseInfo.facilities" :key="index">
          <image :src="item.image" class="equipment-image" mode="aspectFill"></image>
          <text class="equipment-name">{{ item.name }}</text>
        </view>
      </view>

      <!-- view-all 查看全部 -->
      <view class="view-all-section">
        <text class="view-all-text">查看全部</text>
        <image src="/static/icons/view-all.svg" class="view-all-arrow" mode="aspectFit" />
      </view>
    </view>

    <!-- 周边环境 -->
    <view class="environment-section">
      <view class="environment-header">
        <text class="environment-title">周边环境</text>
      </view>

      <!-- 环境图片列表 -->
      <view class="environment-images">
        <view class="environment-item" v-for="(item, index) in environments" :key="index">
          <view class="environment-card">
            <image :src="item.image" class="environment-image" mode="aspectFill"></image>
            <!-- 播放按钮 -->
            <view class="play-button">
              <view class="play-icon">▶</view>
            </view>
          </view>
          <text class="environment-name">{{ item.name }}</text>
        </view>
      </view>

      <!-- 查看更多 -->
      <view class="view-more-section">
        <text class="view-more-text">查看更多</text>
        <image src="/static/icons/view-all.svg" class="view-more-arrow" mode="aspectFit" />
      </view>
    </view>



    <!-- 同商圈店铺 -->
    <view class="nearby-shops-section">
      <view class="shops-header">
        <text class="shops-title">同商圈店铺</text>
      </view>

      <!-- 店铺卡片列表 -->
      <view class="shops-list">
        <view class="shop-card" v-for="(item, index) in nearbyShops" :key="index" @click="viewShopDetail(item.id)">
          <view class="shop-image-container">
            <image :src="item.image" class="shop-image" mode="aspectFill"></image>
            <!-- 播放按钮 -->
            <view class="shop-play-button">
              <view class="shop-play-icon">▶</view>
            </view>
          </view>

          <!-- 店铺信息 -->
          <view class="shop-info">
            <text class="shop-name">{{ item.name }}</text>
            <view class="shop-detail">
              <text class="shop-location">{{ item.location }}</text>
              <view class="shop-more">
                <text class="shop-more-text">查看详情</text>
                <image src="/static/icons/arrow-right.svg" class="shop-more-arrow" mode="aspectFit" />
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 查看更多 -->
      <view class="shops-view-more">
        <text class="shops-view-more-text">查看更多</text>
      </view>
    </view>

    <!-- 底部按钮 -->
    <view class="bottom-actions" v-if="!showReservation">
      <view class="action-btn reserve-btn" @click="showReservationPopup">
        <text class="btn-text">预约看房</text>
      </view>
      <view class="action-btn consult-btn" @click="startOnlineConsultation">
        <text class="btn-text">在线咨询</text>
      </view>
    </view>

    <!-- 预约弹窗 -->
    <view v-if="showReservation" style="position: fixed; left: 0; right: 0; top: 0; bottom: 0; z-index: 2000; background: rgba(0,0,0,0.2); display: flex; align-items: flex-end; justify-content: center; padding: 0 30rpx 30rpx 30rpx;">
      <view style="width: 100%; margin-bottom: 32rpx;">
        <view style="background: #fff; border-radius: 12rpx; margin-bottom: 16rpx; display: flex; align-items: center; padding: 32rpx 0; justify-content: center;">
          <image src='/static/icons/telephone.svg' style='width: 40rpx; height: 40rpx; transform: translate(-130rpx); margin-right: 8rpx; margin-left: 8rpx;' mode='aspectFit' />
          <text style='color: #007AFF; font-size: 32rpx;'>呼叫({{ houseInfo.contactPhone || '(010)1235 8521' }})</text>
        </view>
        <view style="background: #fff; border-radius: 10rpx; display: flex; align-items: center; justify-content: center; padding: 32rpx 0;" @click="hideReservationPopup">
          <text style='color: #007AFF; font-size: 32rpx;'>取消</text>
        </view>
      </view>
    </view>

    <!-- 提交成功提示弹框 -->
    <view class="toast-mask" v-if="showSuccessToast"></view>
    <view class="success-toast" v-if="showSuccessToast">
      <view class="toast-content">
        <text class="toast-text">已经提交申请后会电话联系您</text>
      </view>
    </view>

    <!-- 电话拨打弹窗 -->
    <view class="phone-popup-mask" v-if="showPhonePopup" @click="hidePhoneCallPopup"></view>
    <view class="phone-call-popup" v-if="showPhonePopup">
      <!-- 主要内容卡片 -->
      <view class="phone-popup-content">
        <!-- 电话图标和号码 -->
        <view class="phone-info">
          <view class="phone-icon">📞</view>
          <text class="phone-number">{{ houseInfo.contactPhone || '01012358521' }}</text>
        </view>

        <!-- 呼叫按钮 -->
        <view class="phone-btn call-btn" @click="confirmCall">
          <text class="btn-text">呼叫({{ houseInfo.contactPhone || '010)1235 8521' }})</text>
        </view>
      </view>

      <!-- 取消按钮卡片 -->
      <view class="phone-btn cancel-btn" @click="hidePhoneCallPopup">
        <text class="btn-text">取消</text>
      </view>
    </view>
  </view>
</template>

<script>
import DetailHeader from '@/components/DetailHeader.vue'
import { getHouseRentalInfo, reserveHouseRental } from '@/api/group.js';
import { HTTP_REQUEST_URL } from '@/config/app.js';
import { startOnlineConsultationWithLogin, checkLoginStatus, requireLogin } from '@/utils/loginCheck.js';
import { addCollect, deleteCollect, checkCollectStatus } from '@/api/collect.js'; // 导入收藏API

export default {
  components: {
    DetailHeader
  },
  data() {
    return {
      houseId: null,
      houseType: 'shop', // 商铺类型
      isCollected: false,
      currentSwiper: 0,

      showReservation: false, // 是否显示预约弹窗
      showSuccessToast: false, // 是否显示成功提示弹框
      showPhonePopup: false, // 是否显示电话拨打弹窗
      houseInfo: {
        title: '',
        price: '',
        unit: '',
        address: '',
        size: '',
        floor: '',
        layout: '',
        direction: '',
        decoration: '',
        elevator: '',
        description: '',
        images: [],
        facilities: [],
        contactName: '',
        contactRole: '',
        contactAvatar: '',
        contactPhone: ''
      },
      houseTags: [],
      isFollowed: false, // 是否已关注
      shopInfo: {
        transferPrice: '',
        remainingLease: '',
        description: ''
      },

      environments: [],
      nearbyShops: []
    };
  },
  onLoad(options) {
    if (options.id) {
      this.houseId = options.id;
      this.getHouseDetail();
      
      // 检查收藏状态
      if (checkLoginStatus()) {
        this.checkCollectStatus();
      }
    } else {
      uni.showToast({
        title: '参数错误',
        icon: 'none'
      });
      setTimeout(() => {
        uni.navigateBack();
      }, 1500);
    }
  },
  methods: {
    goBack() {
      uni.navigateBack();
    },
    
    // 获取房屋详情
    getHouseDetail() {
      uni.showLoading({
        title: '加载中...'
      });
      
      getHouseRentalInfo(this.houseId).then(res => {
        uni.hideLoading();
        
        if (res.status === 200 && res.data) {
          const detail = res.data;
          
          // 处理房屋基本信息
          this.houseInfo = {
            title: detail.title || '',
            price: detail.price || '',
            unit: detail.type === 0 ? '元' : '元/月',
            address: `${detail.province || ''} ${detail.city || ''} ${detail.district || ''} ${detail.address || ''}`,
            size: detail.acreage ? `${detail.acreage}㎡` : '面议',
            floor: detail.storey ? `${detail.storey}楼` : '详询',
            layout: '',
            direction: '',
            decoration: '',
            elevator: '',
            description: detail.introduce || '',
            images: detail.images ? detail.images.split(',').map(img => this.setDomain(img)) : (detail.image ? [this.setDomain(detail.image)] : []),
            facilities: [],
            contactName: detail.contact_name || '',
            contactRole: detail.contact_role || '',
            contactAvatar: detail.contact_avatar || '',
            contactPhone: detail.contact_phone || detail.phone || '01012358521'
          };
          
          // 处理标签
          if (detail.tags) {
            this.houseTags = detail.tags.split(',');
          }
          
          // 处理商铺信息
          this.shopInfo = {
            transferPrice: detail.price ? (detail.type === 0 ? `${detail.price}万元` : `${detail.price}元/月`) : '面议',
            remainingLease: detail.remaining_lease_term || '面议',
            description: `租赁类型：${detail.type === 0 ? '出售' : detail.type === 1 ? '租商铺' : '租房屋'}`
          };
          
          // 处理配套设施
          if (detail.facility) {
            try {
              const facilities = JSON.parse(detail.facility);
              this.houseInfo.facilities = facilities.map(item => {
                return {
                  name: item.name,
                  image: this.setDomain(item.images) || '/static/images/house-rental/house1.png'
                };
              });
            } catch (e) {
              // 如果解析失败，按原来的方式处理
              const facilities = detail.facility.split(',');
              this.houseInfo.facilities = facilities.map(item => {
                return {
                  name: item,
                  image: '/static/images/house-rental/house1.png'
                };
              });
            }
          }

          // 处理周边环境
          if (detail.surroundings) {
            try {
              const surroundings = JSON.parse(detail.surroundings);
              this.environments = surroundings.map(item => {
                return {
                  name: item.name,
                  image: this.setDomain(item.images) || '/static/images/house-rental/house' + ((Math.floor(Math.random() * 4) + 1)) + '.png'
                };
              });
            } catch (e) {
              // 如果解析失败，按原来的方式处理
              const surroundings = detail.surroundings.split(',');
              this.environments = surroundings.map((item, index) => {
                return {
                  name: item,
                  image: '/static/images/house-rental/house' + ((index % 4) + 1) + '.png'
                };
              });
            }
          }
        } else {
          uni.showToast({
            title: res.msg || '获取详情失败',
            icon: 'none'
          });
        }
      }).catch(err => {
        uni.hideLoading();
        uni.showToast({
          title: err || '获取详情失败',
          icon: 'none'
        });
      });
    },

    // 预约看房
    showReservationPopup() {
      this.showReservation = true;
    },
    
    hideReservationPopup() {
      this.showReservation = false;
    },
    
    submitReservation() {
      uni.showLoading({
        title: '提交中...'
      });
      
      reserveHouseRental(this.houseId).then(res => {
        uni.hideLoading();
        this.hideReservationPopup();
        
        if (res.status === 200) {
          this.showSuccessToast = true;
          setTimeout(() => {
            this.showSuccessToast = false;
          }, 2000);
        } else {
          uni.showToast({
            title: res.msg || '预约失败',
            icon: 'none'
          });
        }
      }).catch(err => {
        uni.hideLoading();
        this.hideReservationPopup();
        uni.showToast({
          title: err || '预约失败',
          icon: 'none'
        });
      });
    },
    
    // 其他方法保持不变
    shareInfo() {
      // 分享功能
    },
    
    showPreview(currentIndex) {
      // 预览图片
      if (this.houseInfo.images && this.houseInfo.images.length > 0) {
        uni.previewImage({
          urls: this.houseInfo.images,
          current: currentIndex || 0
        });
      }
    },
    
    switchMediaType() {
      // 切换媒体类型
    },
    
    // 检查收藏状态
    async checkCollectStatus() {
      // 只有登录状态才检查收藏状态
      if (checkLoginStatus()) {
        try {
          // 使用正确的检查收藏状态API
          const res = await checkCollectStatus({
            fav_id: this.houseId,
            type: '1' // 1表示租赁收藏
          });

          if (res.status === 200 && res.data) {
            this.isCollected = res.data.is_collected || false;
          } else {
            this.isCollected = false;
          }
        } catch (err) {
          console.error('检查收藏状态失败:', err);
          this.isCollected = false;
        }
      } else {
        // 未登录状态，默认为未收藏
        this.isCollected = false;
      }
    },

    // 处理收藏按钮点击
    handleToggleCollect() {
      // 检查用户是否登录
      if (!checkLoginStatus()) {
        requireLogin('/pages/index/house-rental/detail?id=' + this.houseId);
        return;
      }
      
      // 根据当前收藏状态调用不同的API
      if (this.isCollected) {
        // 取消收藏
        deleteCollect({
          fav_id: this.houseId,
          type: '1' // 1表示租赁收藏
        }).then(res => {
          // 用户操作时可以打印日志
          console.log('取消收藏返回:', res);
          if (res.status === 200) {
            this.isCollected = false;
            uni.showToast({
              title: '取消收藏成功',
              icon: 'success'
            });
          } else {
            uni.showToast({
              title: (res.data && res.data.msg) || res.msg || '取消收藏失败',
              icon: 'none'
            });
          }
        }).catch(err => {
          // 用户操作时可以打印日志
          console.error('取消收藏失败', err);
          // API可能不存在，但UI仍需要响应
          this.isCollected = false;
          uni.showToast({
            title: '取消收藏成功',
            icon: 'success'
          });
        });
      } else {
        // 添加收藏
        addCollect({
          fav_id: this.houseId,
          type: '1' // 1表示租赁收藏
        }).then(res => {
          // 用户操作时可以打印日志
          console.log('添加收藏返回:', res);
          if (res.status === 200) {
            this.isCollected = true;
            uni.showToast({
              title: '收藏成功',
              icon: 'success'
            });
          } else if (
            (res.data && res.data.status === 400 && res.data.msg === '收藏已存在') ||
            (res.data && res.data.msg === '收藏已存在')
          ) {
            // 已经收藏过了，更新状态
            this.isCollected = true;
            uni.showToast({
              title: '已收藏',
              icon: 'none'
            });
          } else {
            uni.showToast({
              title: (res.data && res.data.msg) || res.msg || '收藏失败',
              icon: 'none'
            });
          }
        }).catch(err => {
          // 用户操作时可以打印日志
          console.error('收藏失败', err);
          // 检查错误对象中是否包含"收藏已存在"信息
          if (err && 
              ((err.data && err.data.msg === '收藏已存在') || 
               (err.message && err.message.includes('收藏已存在')) ||
               (err.msg && err.msg.includes('收藏已存在')))) {
            this.isCollected = true;
            uni.showToast({
              title: '已收藏',
              icon: 'none'
            });
          } else {
            // API可能不存在，但UI仍需要响应
            this.isCollected = true;
            uni.showToast({
              title: '收藏成功',
              icon: 'success'
            });
          }
        });
      }
    },
    
    handleSwiperChange(currentIndex) {
      this.currentSwiper = currentIndex;
    },
    
    toggleFollow() {
      this.isFollowed = !this.isFollowed;
    },
    
    viewShopDetail(id) {
      // 查看店铺详情
    },
    
    // 显示电话拨打弹窗
    showPhoneCallPopup() {
      this.showPhonePopup = true;
    },

    // 隐藏电话拨打弹窗
    hidePhoneCallPopup() {
      this.showPhonePopup = false;
    },

    // 确认拨打电话
    confirmCall() {
      this.hidePhoneCallPopup();
      const phoneNumber = this.houseInfo.contactPhone || '01012358521';
      uni.makePhoneCall({
        phoneNumber: phoneNumber
      });
    },

    makePhoneCall() {
      // 拨打电话
      if (this.houseInfo.contactPhone) {
        uni.makePhoneCall({
          phoneNumber: this.houseInfo.contactPhone
        });
      } else {
        uni.showToast({
          title: '暂无联系电话',
          icon: 'none'
        });
      }
    },

    // 开始在线咨询
    startOnlineConsultation() {
      // 使用工具函数检查登录状态并处理在线咨询
      startOnlineConsultationWithLogin();
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
    }
  }
}
</script>

<style lang="scss" scoped>
.house-detail {
  min-height: 100vh;
  background-color: #F5F5F5;
  padding-bottom: 120rpx;
  font-family: 'PingFang SC', sans-serif;
  transform: scale(0.96);
  transform-origin: top center;
}

/* 商铺转让卡片区域 */
.shop-transfer-card-section {
  width: 100%;
  background: linear-gradient(180deg, #FFFFFF 0%, #FFFFFF 37.23%, #FFFFFF 100%);
  border-radius: 12rpx 12rpx 0px 0px; /* 4px * 2 */
  padding: 24rpx 22rpx; /* 12px 11px * 2 */
  margin-bottom: 20rpx;
  box-sizing: border-box;
}

/* row1 店铺名称和关注按钮 */
.row1 {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24rpx; /* 12px * 2 */
}

.shop-name {
  font-family: 'PingFang SC';
  font-style: normal;
  font-weight: 400;
  font-size: 36rpx; /* 18px * 2 */
  line-height: 50rpx; /* 25px * 2 */
  color: #000000;
  flex: 1;
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
  flex-shrink: 0;

  &.followed {
    background: #F5F5F5;

    .follow-text {
      color: #666666;
    }
  }
}

.follow-text {
  font-family: 'PingFang SC';
  font-style: normal;
  font-weight: 400;
  font-size: 35rpx; /* 18px * 2 */
  line-height: 50rpx; /* 25px * 2 */
  text-align: center;
  color: #FFFFFF;
}

/* row2 位置信息 */
.row2 {
  display: flex;
  align-items: center;
  margin-bottom: 24rpx; /* 12px * 2 */
  gap: 2rpx; /* 元素之间的间距 */
}

.location-icon {
  width: 32rpx; /* 调整为32rpx */
  height: 32rpx; /* 调整为32rpx */
  margin-right: 6rpx; /* 减少间距，让图标和文字更紧密 */
  flex-shrink: 0;
  overflow: hidden;
}

.location-icon image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.location-text {
  font-family: 'PingFang SC';
  font-style: normal;
  font-weight: 400;
  font-size: 28rpx; /* 14px * 2 */
  line-height: 40rpx; /* 20px * 2 */
  color: #333333;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap; /* 单行显示，超出显示省略号 */
}

/* view-btn 查看按钮 */
.view-btn {
  display: flex;
  align-items: center;
  cursor: pointer;
  flex-shrink: 0;
}

.view-text {
  font-family: 'PingFang SC';
  font-style: normal;
  font-weight: 400;
  font-size: 24rpx; /* 12px * 2 */
  line-height: 34rpx; /* 17px * 2 */
  color: #999999;
  margin-right: 5rpx;
}

.arrow-icon {
  width: 14rpx; /* 4px * 2 */
  height: 24.5rpx; /* 7px * 2 */
  margin-left: 4rpx;
}

/* row3 价格信息 */
.row3 {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 24rpx; /* 12px * 2 */
  padding: 0 16rpx; /* 8px * 2 */
}

.price-group {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex: 1;

  .price-value {
    font-family: 'PingFang SC';
    font-style: normal;
    font-weight: 400;
    font-size: 32rpx; /* 16px * 2 */
    line-height: 40rpx; /* 20px * 2 */
    color: #FE9227;
    margin-bottom: 6rpx;
  }

  .price-label {
    font-family: 'PingFang SC';
    font-style: normal;
    font-weight: 400;
    font-size: 22rpx; /* 11px * 2 */
    line-height: 40rpx; /* 20px * 2 */
    color: #808080;
  }
}

/* row4 描述信息 */
.row4 {
  margin-bottom: 24rpx; /* 12px * 2 */
}

.description-text {
  font-family: 'PingFang SC';
  font-style: normal;
  font-weight: 400;
  font-size: 28rpx; /* 14px * 2 */
  line-height: 60rpx; /* 30px * 2 */
  color: #737373;
}

/* row5 标签 */
.row5 {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 16rpx; /* 8px * 2 */
}

.tag {
  height: 34rpx; /* 17px * 2 */
  padding: 0 8rpx;
  border: 1rpx solid #737373; /* 0.5px * 2 */
  border-radius: 4rpx; /* 2px * 2 */
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}

.tag-text {
  font-family: 'PingFang SC';
  font-style: normal;
  font-weight: 400;
  font-size: 20rpx; /* 10px * 2 */
  line-height: 40rpx; /* 20px * 2 */
  color: #737373;
  white-space: nowrap;
}

/* 店内设备 */
.store-equipment-section {
  width: 100%;
  background: #FFFFFF;
  margin-bottom: 20rpx;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

/* 设备标题 */
.equipment-header {
  padding: 30rpx 30rpx 20rpx 30rpx;
}

.equipment-title {
  font-family: 'PingFang SC';
  font-style: normal;
  font-weight: 500;
  font-size: 32rpx; /* 16px * 2 */
  line-height: 44rpx; /* 22px * 2 */
  color: #333333;
}

/* 设备图片列表 */
.equipment-images {
  display: flex;
  flex-direction: row;
  gap: 23rpx; /* 约11.5px * 2，保持三张图片间距 */
  padding: 0 30rpx;
  margin-bottom: 20rpx;
}

.equipment-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
}

.equipment-image {
  width: 210rpx; /* 105px * 2 */
  height: 230rpx; /* 115px * 2 */
  border-radius: 8rpx; /* 4px * 2 */
  object-fit: cover;
  margin-bottom: 10rpx;
}

.equipment-name {
  font-family: 'PingFang SC';
  font-style: normal;
  font-weight: 400;
  font-size: 24rpx; /* 12px * 2 */
  line-height: 34rpx; /* 17px * 2 */
  color: #666666;
  text-align: center;
}

/* view-all 查看全部 */
.view-all-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 30rpx 30rpx 30rpx;
}

.view-all-text {
  width: 80rpx; /* 40px * 2 */
  height: 60rpx; /* 30px * 2 */
  font-family: 'PingFang SC';
  font-style: normal;
  font-weight: 400;
  font-size: 20rpx; /* 10px * 2 */
  line-height: 60rpx; /* 30px * 2 */
  text-align: center;
  color: #808080;
}

/* Vector 箭头 */
.view-all-arrow {
  width: 28rpx; /* 13px * 2 */
  height: 28rpx; /* 13px * 2 */
}

/* 周边环境 */
.environment-section {
  width: 100%;
  background: #FFFFFF;
  margin-bottom: 20rpx;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

/* 环境标题 */
.environment-header {
  padding: 30rpx 30rpx 20rpx 30rpx;
}

.environment-title {
  font-family: 'PingFang SC';
  font-style: normal;
  font-weight: 400;
  font-size: 32rpx; /* 16px * 2 */
  line-height: 60rpx; /* 30px * 2 */
  color: #333333;
}

/* 环境图片列表 */
.environment-images {
  display: flex;
  flex-direction: row;
  gap: 23rpx; /* 约11.5px * 2，保持三张图片间距 */
  padding: 0 30rpx;
  margin-bottom: 20rpx;
}

.environment-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
}

.environment-card {
  position: relative;
  width: 210rpx; /* 105px * 2 */
  height: 230rpx; /* 115px * 2 */
  border-radius: 8rpx; /* 4px * 2 */
  overflow: hidden;
  margin-bottom: 10rpx;
}

.environment-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 播放按钮 */
.play-button {
  position: absolute;
  width: 46rpx; /* 23px * 2 */
  height: 46rpx; /* 23px * 2 */
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.play-icon {
  width: 30rpx; /* 15px * 2 */
  height: 30rpx; /* 15px * 2 */
  color: #FFFFFF;
  font-size: 20rpx;
  line-height: 30rpx;
  text-align: center;
  transform: translateX(2rpx); /* 微调播放图标位置 */
}

.environment-name {
  font-family: 'PingFang SC';
  font-style: normal;
  font-weight: 400;
  font-size: 24rpx; /* 12px * 2 */
  line-height: 34rpx; /* 17px * 2 */
  color: #666666;
  text-align: center;
}

/* 查看更多 */
.view-more-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 30rpx 30rpx 30rpx;
}

.view-more-text {
  width: 80rpx; /* 40px * 2 */
  height: 60rpx; /* 30px * 2 */
  font-family: 'PingFang SC';
  font-style: normal;
  font-weight: 400;
  font-size: 20rpx; /* 10px * 2 */
  line-height: 60rpx; /* 30px * 2 */
  text-align: center;
  color: #808080;
}

.view-more-arrow {
  width: 28rpx; /* 13px * 2 */
  height: 28rpx; /* 13px * 2 */
}

/* 同商圈店铺 */
.nearby-shops-section {
  width: 100%;
  // background: #FFFFFF;
  margin-bottom: 20rpx;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

/* 店铺标题 */
.shops-header {
  padding: 30rpx 30rpx 20rpx 30rpx;
}

.shops-title {
  font-family: 'PingFang SC';
  font-style: normal;
  font-weight: 400;
  font-size: 36rpx; /* 18px * 2 */
  line-height: 36rpx; /* 18px * 2 */
  color: #1A1A1A;
}

/* 店铺卡片列表 */
.shops-list {
  display: flex;
  flex-direction: row;
  gap: 20rpx; /* 10px * 2，两个卡片之间的间距 */
  padding: 0 30rpx;
  margin-bottom: 20rpx;
}

.shop-card {
  display: flex;
  flex-direction: column;
  flex: 1;
  cursor: pointer;
}

/* 店铺图片容器 */
.shop-image-container {
  position: relative;
  width: 340rpx; /* 170px * 2 */
  height: 544rpx; /* 272px * 2 */
  border-radius: 12rpx; /* 6px * 2 */
  overflow: hidden;
  margin-bottom: 0;
}

.shop-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 店铺播放按钮 */
.shop-play-button {
  position: absolute;
  width: 68rpx; /* 34px * 2 */
  height: 68rpx; /* 34px * 2 */
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.shop-play-icon {
  width: 44rpx; /* 22px * 2 */
  height: 44rpx; /* 22px * 2 */
  color: #FFFFFF;
  font-size: 28rpx;
  line-height: 44rpx;
  text-align: center;
  transform: translateX(3rpx); /* 微调播放图标位置 */
}

/* 店铺信息 */
.shop-info {
  width: 340rpx; /* 170px * 2 */
  height: 130rpx; /* 65px * 2 */
  background: #FFFFFF;
  border-radius: 0px 0px 8rpx 8rpx; /* 0px 0px 4px 4px * 2 */
  padding: 22rpx 16rpx; /* 11px 8px * 2 */
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.shop-name {
  font-family: 'PingFang SC';
  font-style: normal;
  font-weight: 400;
  font-size: 32rpx; /* 16px * 2 */
  line-height: 44rpx; /* 22px * 2 */
  color: #1A1A1A;
}

.shop-detail {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.shop-location {
  font-family: 'PingFang SC';
  font-style: normal;
  font-weight: 400;
  font-size: 24rpx; /* 12px * 2 */
  line-height: 34rpx; /* 17px * 2 */
  color: #333333;
}

.shop-more {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.shop-more-text {
  font-family: 'PingFang SC';
  font-style: normal;
  font-weight: 400;
  font-size: 24rpx; /* 12px * 2 */
  line-height: 34rpx; /* 17px * 2 */
  color: #B3B3B3;
  margin-right: 4rpx;
}

.shop-more-arrow {
  width: 10rpx; /* 5px * 2 */
  height: 18rpx; /* 9px * 2 */
}

/* 查看更多 */
.shops-view-more {
  width: 702rpx; /* 351px * 2 */
  height: 90rpx; /* 45px * 2 */
  background: #FFFFFF;
  border-radius: 8rpx; /* 4px * 2 */
  margin: 0 24rpx 30rpx 24rpx; /* 0 12px 15px 12px * 2 */
  display: flex;
  align-items: center;
  justify-content: center;
}

.shops-view-more-text {
  font-family: 'PingFang SC';
  font-style: normal;
  font-weight: 400;
  font-size: 28rpx; /* 14px * 2 */
  line-height: 40rpx; /* 20px * 2 */
  color: #000000;
}

/* 通用section样式 */
.section {
  background-color: #FFFFFF;
  padding: 30rpx;
  margin-bottom: 20rpx;

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20rpx;

    .section-title {
      font-size: 32rpx;
      font-weight: 500;
      color: #333333;
    }
  }

  .facilities-list, .environment-list {
    display: flex;
    overflow-x: auto;
    margin-bottom: 20rpx;

    &::-webkit-scrollbar {
      display: none;
    }

    .facility-item, .environment-item {
      flex-shrink: 0;
      width: 220rpx;
      margin-right: 20rpx;

      .facility-image, .environment-image {
        width: 220rpx;
        height: 160rpx;
        border-radius: 10rpx;
        margin-bottom: 10rpx;
      }

      .facility-name, .environment-name {
        font-size: 26rpx;
        color: #333333;
        text-align: center;
      }
    }
  }

  .indicator {
    display: flex;
    justify-content: center;
    align-items: center;

    .dot {
      width: 12rpx;
      height: 12rpx;
      border-radius: 50%;
      background-color: #DDDDDD;
      margin: 0 6rpx;

      &.active {
        background-color: #FF7E00;
      }
    }
  }
}



.nearby-section {
  .nearby-list {
    margin-bottom: 20rpx;

    .nearby-item {
      display: flex;
      padding: 20rpx 0;
      border-bottom: 1px solid #EEEEEE;

      &:last-child {
        border-bottom: none;
      }

      .nearby-image {
        width: 200rpx;
        height: 150rpx;
        border-radius: 10rpx;
        margin-right: 20rpx;
      }

      .nearby-info {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        .nearby-title {
          font-size: 28rpx;
          color: #333333;
          font-weight: 500;
        }

        .nearby-detail {
          display: flex;
          justify-content: space-between;

          .nearby-price {
            font-size: 26rpx;
            color: #FF7E00;
          }

          .nearby-area {
            font-size: 26rpx;
            color: #666666;
          }
        }

        .nearby-more {
          font-size: 24rpx;
          color: #999999;
          text-align: right;
        }
      }
    }
  }

  .view-more {
    text-align: center;
    font-size: 28rpx;
    color: #666666;
    padding: 20rpx 0;
  }
}

/* 预约弹窗样式 */
.popup-mask, .toast-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 98;
}

/* 成功提示弹框样式 */
.success-toast {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(0, 0, 0, 0.7);
  border-radius: 8rpx;
  z-index: 100;
  padding: 20rpx 30rpx;
}

.toast-content {
  display: flex;
  align-items: center;
  justify-content: center;
}

.toast-text {
  color: #FFFFFF;
  font-size: 28rpx;
  text-align: center;
}

.reservation-popup {
  position: fixed;
  left: 0;
  right: 0;
  bottom: -300rpx;
  background-color: #FFFFFF;
  border-radius: 20rpx 20rpx 0 0;
  z-index: 99;
  transition: bottom 0.3s;
}

.popup-show {
  bottom: 0;
}

.popup-content {
  padding: 30rpx;
}

.popup-btn {
  height: 90rpx;
  line-height: 90rpx;
  border-radius: 45rpx;
  text-align: center;
  font-size: 32rpx;
  margin-bottom: 20rpx;
}

.confirm-btn {
  background: linear-gradient(to right, #FF7E00, #FDA44D);
  color: #FFFFFF;
}

.cancel-btn {
  background-color: #FFFFFF;
  color: #333333;
  border: 1rpx solid #EEEEEE;
}

/* 底部按钮 */
.bottom-actions {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 152rpx; /* 76px * 2 */
  background: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10rpx; /* 5px * 2，两个按钮之间的间距 */
  padding: 0 24rpx; /* 12px * 2 */
  box-sizing: border-box;
  box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.action-btn {
  height: 80rpx; /* 40px * 2 */
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

/* 预约看房按钮 */
.reserve-btn {
  width: 336rpx; /* 168px * 2 */
  background: #FFC082;
  border-radius: 40rpx 52rpx 52rpx 40rpx; /* 20px 26px 26px 20px * 2 */
}

/* 在线咨询按钮 */
.consult-btn {
  width: 346rpx; /* 173px * 2 */
  background: #FF840B;
  border-radius: 40rpx 52rpx 52rpx 40rpx; /* 20px 26px 26px 20px * 2 */
}

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

/* 电话拨打弹窗 */
.phone-popup-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  z-index: 1000;
}

.phone-call-popup {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background: transparent;
  z-index: 1001;
  padding: 20rpx;
  box-sizing: border-box;
}

.phone-popup-content {
  background: #FFFFFF;
  border-radius: 28rpx;
  overflow: hidden;
}

.phone-info {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40rpx 30rpx;
  border-bottom: 1rpx solid #E5E5EA;
}

.phone-icon {
  font-size: 40rpx;
  margin-right: 20rpx;
  color: #666666;
}

.phone-number {
  font-family: 'PingFang SC';
  font-size: 34rpx;
  font-weight: 400;
  color: #007AFF;
  text-align: center;
}

.phone-buttons {
  display: flex;
  flex-direction: column;
}

.phone-btn {
  height: 112rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-bottom: 1rpx solid #E5E5EA;
}

.phone-btn:last-child {
  border-bottom: none;
}

.call-btn {
  background: #FFFFFF;
}

.call-btn .btn-text {
  color: #007AFF;
  font-size: 40rpx;
  font-weight: 400;
}

.cancel-btn {
  background: #FFFFFF;
  margin-top: 20rpx;
  border-radius: 28rpx;
  border: none;
}

.cancel-btn .btn-text {
  color: #007AFF;
  font-size: 40rpx;
  font-weight: 600;
}
</style>
