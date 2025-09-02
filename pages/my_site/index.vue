<template>
  <view class="site-page">
    <!-- 使用通用头部导航组件 -->
    <CommonHeader
      title="我的站点"
      :rightText="isSelectMode ? '取消' : '选择'"
      @back="goBack"
      @rightClick="toggleSelectMode">
    </CommonHeader>
    
    <!-- 站点卡片 -->
    <view class="site-card" :class="{ 'select-mode': isSelectMode }">
      <view v-if="isSelectMode" class="radio-wrap" @click.stop="selectedSiteId = currentSite.id">
        <view class="radio-circle" :class="{ checked: selectedSiteId === currentSite.id }"></view>
      </view>
      <view class="site-address">
        <text class="address-text">{{ currentSite.fullAddress }}</text>
        <text class="default-tag" v-if="currentSite.isDefault">默认</text>
      </view>
      <view class="site-building">{{ currentSite.building }}</view>
      <view class="site-contact">
        <text class="contact-name">{{ currentSite.contactName }}</text>
        <text class="contact-phone">{{ currentSite.contactPhone }}</text>
      </view>
      <view class="edit-btn" v-if="!isSelectMode" @click="editSite">编辑</view>
    </view>
    
    <!-- 中部提示文字 -->
    <view class="tip-text-center">
      <text>提示 《更改取货站点一月限一次》</text>
    </view>
    <!-- 底部按钮：选择模式下显示 -->
    <view class="footer" v-if="isSelectMode">
      <view class="add-site-btn confirm-btn" :class="{ disabled: !selectedSiteId }" @click="onSetMySiteClick">设为我的站点</view>
    </view>
    <!-- 底部按钮：非选择模式下显示 -->
    <view class="footer" v-else>
      <view class="add-site-btn" @click="addSite">添加站点</view>
    </view>

    <!-- 更换站点确认弹窗 -->
    <view v-if="showConfirmModal" class="modal-mask" @touchmove.stop.prevent>
      <view class="confirm-modal">
        <view class="modal-content">您确定要更换站点么？</view>
        <view class="modal-actions">
          <view class="modal-btn cancel" @click="showConfirmModal = false">取消</view>
          <view class="modal-divider"></view>
          <view class="modal-btn confirm" @click="confirmSetMySite">确定</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import CommonHeader from '@/components/CommonHeader/index.vue';
import { getMyCommunityInfo } from '@/api/group.js';

export default {
  components: {
    CommonHeader
  },
  data() {
    return {
      currentSite: {
        id: 0,
        fullAddress: '北京市海淀区上地街道',
        isDefault: true,
        building: '万霞大厦A座',
        contactName: '王小明',
        contactPhone: '18567213652'
      },
      hasSite: false,
      isSelectMode: false,
      selectedSiteId: null,
      showConfirmModal: false
    };
  },
  onLoad() {
    this.getSiteInfo();
  },
  onShow() {
    this.getSiteInfo();
  },
  methods: {
    goBack() {
      uni.navigateBack();
    },
    toggleSelectMode() {
      this.isSelectMode = !this.isSelectMode;
      if (!this.isSelectMode) this.selectedSiteId = null;
    },
    onSetMySiteClick() {
      if (!this.selectedSiteId) return;
      this.showConfirmModal = true;
    },
    confirmSetMySite() {
      if (!this.selectedSiteId) return;
      uni.setStorageSync('CURRENT_SITE_ID', this.selectedSiteId);
      this.isSelectMode = false;
      this.showConfirmModal = false;
      this.getSiteInfo();
      uni.showToast({ title: '已设为我的站点', icon: 'success' });
    },
    editSite() {
      if (!this.currentSite.id) {
        uni.showToast({
          title: '站点信息不完整，无法编辑',
          icon: 'none'
        });
        return;
      }
      uni.navigateTo({ url: './edit?id=' + this.currentSite.id });
    },
    addSite() {
      uni.navigateTo({ url: './add' });
    },
    async getSiteInfo() {
      // 首先尝试从API获取真实的社区信息
      try {
        const response = await getMyCommunityInfo();

        if (response.status === 200 && response.data && response.data.is_bind && response.data.community) {
          const community = response.data.community;

          // 将社区信息转换为站点信息格式
          this.currentSite = {
            id: community.id,
            fullAddress: community.full_address || community.address || '',
            isDefault: true,
            building: community.name || '',
            contactName: '站点管理员',
            contactPhone: '400-000-0000'
          };

          this.hasSite = true;

          // 同步到本地存储
          uni.setStorageSync('CURRENT_SITE_ID', this.currentSite.id);
          uni.setStorageSync('CURRENT_SITE', JSON.stringify(this.currentSite));
          return;
        }
      } catch (e) {
        console.error('从API获取社区信息失败:', e);
      }

      // 如果API获取失败，回退到本地存储逻辑
      try {
        const currentSiteId = uni.getStorageSync('CURRENT_SITE_ID');
        let siteList = uni.getStorageSync('SITE_LIST') || '[]';
        siteList = JSON.parse(siteList);

        if (siteList.length > 0) {
          this.hasSite = true;
          if (currentSiteId) {
            const site = siteList.find(item => item.id == currentSiteId);
            if (site) {
              this.currentSite = site;
              return;
            }
          }
          this.currentSite = siteList[0];
          uni.setStorageSync('CURRENT_SITE_ID', this.currentSite.id);
          uni.setStorageSync('CURRENT_SITE', JSON.stringify(this.currentSite));
        } else {
          this.hasSite = false;
        }
      } catch (e) {
        console.error('获取站点信息失败', e);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.site-page {
  background-color: #F5F5F5;
  min-height: 100vh;
  padding-bottom: 40rpx;
}

.site-card {
  margin: 30rpx 30rpx 0 30rpx;
  padding: 30rpx;
  background-color: #FFFFFF;
  border-radius: 16rpx;
  box-shadow: 0 4rpx 10rpx rgba(0, 0, 0, 0.05);
  position: relative;
  transition: box-shadow 0.2s, background 0.2s;
  &.select-mode {
    box-shadow: 0 8rpx 24rpx rgba(254, 141, 0, 0.08);
    background: #fffbe9;
    padding-left: 70rpx;
  }
}
.radio-wrap {
  position: absolute;
  left: 30rpx;
  top: 50%;
  transform: translateY(-50%);
  width: 40rpx;
  height: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.radio-circle {
transform: translate(-14rpx);
  width: 36rpx;
  height: 36rpx;
  border: 2rpx solid #FE8D00;
  border-radius: 50%;
  background: #fff;
  position: relative;
  transition: border 0.2s;
  &.checked {
    background: #FE8D00;
    box-shadow: 0 0 0 4rpx #fffbe9;
  }
  &.checked::after {
    content: '';
    display: block;
    width: 16rpx;
    height: 16rpx;
    background: #fff;
    border-radius: 50%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
.site-address {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
}
.address-text {
  font-size: 28rpx;
  color: #333333;
  font-weight: 500;
}
.default-tag {
  margin-left: 12rpx;
  font-size: 20rpx;
  color: #FFFFFF;
  background-color: #FE8D00;
  padding: 2rpx 8rpx;
  border-radius: 4rpx;
  line-height: 1.2;
}
.site-building {
  font-size: 32rpx;
  color: #333333;
  font-weight: bold;
  margin-bottom: 30rpx;
}
.site-contact {
  display: flex;
  align-items: center;
  font-size: 28rpx;
  color: #666666;
}
.contact-name {
  margin-right: 20rpx;
}
.edit-btn {
  position: absolute;
  right: 30rpx;
  top: 30rpx;
  font-size: 28rpx;
  color: #B3B3B3;
}
.tip-text-center {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 55%;
  left: 0;
  z-index: 1;
  color: #E0E0E0;
  font-size: 26rpx;
  text-align: center;
}
.footer {
  background: #fff;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  padding: 40rpx 0 60rpx 0;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 10;
}
.add-site-btn.confirm-btn {
  width: 90%;
  height: 96rpx;
  background: #FE8D00;
  color: #FFFFFF;
  font-size: 32rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  border-radius: 48rpx;
  transition: background 0.2s;
  &.disabled {
    background: #FFD9A0;
    color: #fff;
  }
}
.add-site-btn {
  width: 90%;
  height: 96rpx;
  background-color: #FE8D00;
  color: #FFFFFF;
  font-size: 32rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0;
  border-radius: 48rpx;
}

/* 弹窗样式 */
.modal-mask {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.15);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}
.confirm-modal {
  width: 540rpx;
  background: #fff;
  border-radius: 24rpx;
  overflow: hidden;
  box-shadow: 0 8rpx 32rpx 0 rgba(0,0,0,0.10);
  display: flex;
  flex-direction: column;
  align-items: stretch;
}
.modal-content {
  font-size: 32rpx;
  color: #222;
  text-align: center;
  padding: 60rpx 30rpx 50rpx 30rpx;
}
.modal-actions {
  display: flex;
  border-top: 1rpx solid #eee;
  height: 100rpx;
}
.modal-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32rpx;
  color: #222;
  background: #fff;
  cursor: pointer;
}
.modal-btn.cancel {
  border-bottom-left-radius: 24rpx;
}
.modal-btn.confirm {
  border-bottom-right-radius: 24rpx;
  color: #222;
}
.modal-divider {
  width: 1rpx;
  background: #eee;
  height: 100%;
}
</style>
