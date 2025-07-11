<template>
  <view class="site-list-page">
    <!-- 顶部导航栏 -->
    <view class="header">
      <view class="back-btn" @click="goBack">
        <text class="iconfont icon-fanhui"></text>
      </view>
      <view class="title">我的站点</view>
      <view class="right-btn">选择</view>
    </view>
    
    <!-- 站点列表 -->
    <view class="site-list">
      <view 
        class="site-item" 
        v-for="(item, index) in siteList" 
        :key="index"
        @click="selectSite(item)"
      >
        <view class="select-indicator" :class="{'active': item.selected}"></view>
        <view class="site-content">
          <view class="site-address">
            <text class="address-text">{{ item.fullAddress }}</text>
            <text class="default-tag" v-if="item.isDefault">默认</text>
          </view>
          <view class="site-building">{{ item.building }}</view>
          <view class="site-contact">
            <text class="contact-name">{{ item.contactName }}</text>
            <text class="contact-phone">{{ item.contactPhone }}</text>
          </view>
          <view class="edit-btn" @click.stop="editSite(item)">编辑</view>
        </view>
      </view>
    </view>
    
    <!-- 底部按钮 -->
    <view class="footer">
      <view class="set-btn" @click="setAsMySite">设为我的站点</view>
      <view class="tip-text">提示 《更改取货站点一月限一次》</view>
    </view>
    
    <!-- 确认弹窗 -->
    <view class="confirm-modal" v-if="showConfirmModal">
      <view class="modal-content">
        <view class="modal-title">您确定要更换站点么？</view>
        <view class="modal-buttons">
          <view class="cancel-btn" @click="cancelChange">取消</view>
          <view class="confirm-btn" @click="confirmChange">确定</view>
        </view>
      </view>
      <view class="modal-mask" @click="cancelChange"></view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      siteList: [
        {
          id: 1,
          fullAddress: '北京市海淀区上地街道',
          isDefault: true,
          building: '万霞大厦A座',
          contactName: '王小明',
          contactPhone: '18567213652',
          selected: false
        },
        {
          id: 2,
          fullAddress: '北京市朝阳区三里屯街道',
          isDefault: false,
          building: '三里屯3.3大厦',
          contactName: '王小明',
          contactPhone: '18567213652',
          selected: true
        }
      ],
      showConfirmModal: false,
      selectedSiteId: null
    };
  },
  onLoad(options) {
    // 获取从街道选择页面传递过来的参数
    if (options.street) {
      const street = decodeURIComponent(options.street);
      console.log('选择的街道：', street);
      // 可以根据街道筛选站点列表
    }
    
    // 初始化选择状态
    this.initSelection();
  },
  methods: {
    goBack() {
      uni.navigateBack();
    },
    initSelection() {
      // 从缓存中获取当前选中的站点
      try {
        const currentSiteId = uni.getStorageSync('CURRENT_SITE_ID');
        if (currentSiteId) {
          this.siteList.forEach(site => {
            site.selected = site.id == currentSiteId;
          });
        }
      } catch (e) {
        console.error('获取当前站点失败', e);
      }
    },
    selectSite(site) {
      // 更新选中状态
      this.siteList.forEach(item => {
        item.selected = item.id === site.id;
      });
      this.selectedSiteId = site.id;
    },
    editSite(site) {
      // 跳转到编辑页面
      uni.navigateTo({
        url: './edit?id=' + encodeURIComponent(JSON.stringify(site))
      });
    },
    setAsMySite() {
      // 获取当前选中的站点
      const selectedSite = this.siteList.find(site => site.selected);
      if (!selectedSite) {
        uni.showToast({
          title: '请选择一个站点',
          icon: 'none'
        });
        return;
      }
      
      // 显示确认弹窗
      this.showConfirmModal = true;
    },
    cancelChange() {
      // 取消更换站点
      this.showConfirmModal = false;
    },
    confirmChange() {
      // 确认更换站点
      this.showConfirmModal = false;
      
      // 获取当前选中的站点
      const selectedSite = this.siteList.find(site => site.selected);
      if (!selectedSite) return;
      
      // 保存到缓存
      try {
        uni.setStorageSync('CURRENT_SITE', JSON.stringify(selectedSite));
        uni.setStorageSync('CURRENT_SITE_ID', selectedSite.id);
        
        uni.showToast({
          title: '设置成功',
          icon: 'success',
          duration: 1500,
          success: () => {
            // 延迟返回，让用户看到成功提示
            setTimeout(() => {
              uni.reLaunch({
                url: './index'
              });
            }, 1500);
          }
        });
      } catch (e) {
        console.error('保存站点信息失败', e);
        uni.showToast({
          title: '设置失败，请重试',
          icon: 'none'
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.site-list-page {
  background-color: #F5F5F5;
  min-height: 100vh;
  padding-bottom: 180rpx;
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

/* 站点列表 */
.site-list {
  padding: 30rpx;
  
  .site-item {
    display: flex;
    align-items: center;
    margin-bottom: 30rpx;
    
    .select-indicator {
      width: 40rpx;
      height: 40rpx;
      border-radius: 50%;
      border: 2rpx solid #CCCCCC;
      margin-right: 20rpx;
      flex-shrink: 0;
      
      &.active {
        border-color: #FF6C00;
        background-color: #FF6C00;
      }
    }
    
    .site-content {
      flex: 1;
      background-color: #FFFFFF;
      border-radius: 16rpx;
      padding: 30rpx;
      position: relative;
      box-shadow: 0 4rpx 10rpx rgba(0, 0, 0, 0.05);
      
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
  
  .set-btn {
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

/* 确认弹窗 */
.confirm-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
  
  .modal-mask {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
  }
  
  .modal-content {
    width: 600rpx;
    background-color: #FFFFFF;
    border-radius: 12rpx;
    z-index: 1000;
    overflow: hidden;
    
    .modal-title {
      padding: 60rpx 40rpx;
      font-size: 32rpx;
      color: #333333;
      text-align: center;
      font-weight: 500;
    }
    
    .modal-buttons {
      display: flex;
      border-top: 1rpx solid #EEEEEE;
      
      .cancel-btn, .confirm-btn {
        flex: 1;
        height: 90rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 32rpx;
      }
      
      .cancel-btn {
        color: #666666;
        border-right: 1rpx solid #EEEEEE;
      }
      
      .confirm-btn {
        color: #FF6C00;
      }
    }
  }
}
</style>
