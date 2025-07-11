<template>
  <view class="site-page">
    <!-- 顶部导航栏 -->
    <view class="header">
      <view class="back-btn" @click="goBack">
        <text class="iconfont icon-fanhui"></text>
      </view>
      <view class="title">我的站点</view>
      <view class="right-btn" @click="goToSelect">选择</view>
    </view>
    
    <!-- 站点卡片 -->
    <view class="site-card">
      <view class="site-address">
        <text class="address-text">{{ currentSite.fullAddress }}</text>
        <text class="default-tag" v-if="currentSite.isDefault">默认</text>
      </view>
      <view class="site-building">{{ currentSite.building }}</view>
      <view class="site-contact">
        <text class="contact-name">{{ currentSite.contactName }}</text>
        <text class="contact-phone">{{ currentSite.contactPhone }}</text>
      </view>
      <view class="edit-btn" @click="editSite">编辑</view>
    </view>
    
    <!-- 底部按钮和提示 -->
    <view class="footer">
      <view class="add-site-btn" @click="addSite">添加站点</view>
      <view class="tip-text">提示 《更改取货站点一月限一次》</view>
    </view>
  </view>
</template>

<script>
export default {
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
      hasSite: false
    };
  },
  onLoad() {
    // 页面加载时从缓存获取站点信息
    this.getSiteInfo();
  },
  onShow() {
    // 每次页面显示时刷新站点信息，以确保从其他页面返回时能看到更新
    this.getSiteInfo();
  },
  methods: {
    goBack() {
      uni.navigateBack();
    },
    goToSelect() {
      // 跳转到站点选择页面
      uni.navigateTo({
        url: '../my_site/select'
      });
    },
    editSite() {
      // 编辑当前站点
      if (!this.currentSite.id) {
        uni.showToast({
          title: '站点信息不完整，无法编辑',
          icon: 'none'
        });
        return;
      }
      
      uni.navigateTo({
        url: './edit?id=' + this.currentSite.id
      });
    },
    addSite() {
      // 添加新站点
      uni.navigateTo({
        url: './add'
      });
    },
    getSiteInfo() {
      // 从缓存获取站点信息
      try {
        // 获取当前站点ID
        const currentSiteId = uni.getStorageSync('CURRENT_SITE_ID');
        
        // 获取所有站点列表
        let siteList = uni.getStorageSync('SITE_LIST') || '[]';
        siteList = JSON.parse(siteList);
        
        if (siteList.length > 0) {
          this.hasSite = true;
          
          // 如果有当前站点ID，则获取对应站点
          if (currentSiteId) {
            const site = siteList.find(item => item.id == currentSiteId);
            if (site) {
              this.currentSite = site;
              return;
            }
          }
          
          // 如果没有当前站点ID或未找到对应站点，则使用第一个站点
          this.currentSite = siteList[0];
          uni.setStorageSync('CURRENT_SITE_ID', this.currentSite.id);
          uni.setStorageSync('CURRENT_SITE', JSON.stringify(this.currentSite));
        } else {
          this.hasSite = false;
          // 如果没有站点，可以使用默认值或提示用户添加
        }
      } catch (e) {
        console.error('获取站点信息失败', e);
      }
    },
    
    goToSiteList() {
      // 跳转到站点列表页面
      uni.navigateTo({
        url: './site_list'
      });
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

/* 顶部导航栏 */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 88rpx;
  padding: 0 30rpx;
  background-color: #FFFFFF;
  position: relative;
  
  .back-btn {
    width: 44rpx;
    height: 44rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    
    .iconfont {
      font-size: 36rpx;
      color: #333333;
    }
  }
  
  .title {
    font-size: 36rpx;
    font-weight: 500;
    color: #333333;
  }
  
  .right-btn {
    font-size: 32rpx;
    color: #333333;
  }
}

/* 站点卡片 */
.site-card {
  margin: 30rpx;
  padding: 30rpx;
  background-color: #FFFFFF;
  border-radius: 16rpx;
  box-shadow: 0 4rpx 10rpx rgba(0, 0, 0, 0.05);
  position: relative;
  
  .site-address {
    display: flex;
    align-items: center;
    margin-bottom: 20rpx;
    
    .address-text {
      font-size: 28rpx;
      color: #333333;
      font-weight: 500;
    }
    
    .default-tag {
      margin-left: 20rpx;
      font-size: 24rpx;
      color: #FFFFFF;
      background-color: #FF6C00;
      padding: 4rpx 10rpx;
      border-radius: 4rpx;
    }
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
    
    .contact-name {
      margin-right: 20rpx;
    }
  }
  
  .edit-btn {
    position: absolute;
    right: 30rpx;
    top: 30rpx;
    font-size: 28rpx;
    color: #666666;
  }
}

/* 底部按钮和提示 */
.footer {
  padding: 0 30rpx;
  position: fixed;
  bottom: 40rpx;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  
  .add-site-btn {
    width: 100%;
    height: 90rpx;
    background-color: #FF6C00;
    color: #FFFFFF;
    font-size: 32rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 45rpx;
    margin-bottom: 30rpx;
  }
  
  .tip-text {
    font-size: 24rpx;
    color: #999999;
    text-align: center;
  }
}
</style>
