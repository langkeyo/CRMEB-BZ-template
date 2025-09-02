<template>
  <view class="form-page">
    <!-- 自定义头部 -->
    <view class="custom-header">
      <view class="header-cancel" @click="goBack">取消</view>
      <view class="header-title">基本信息</view>
      <view class="header-placeholder"></view>
    </view>
    
    <!-- 表单内容 -->
    <view class="form-content">
      <!-- 姓名 -->
      <view class="form-item">
        <view class="form-label">姓名：</view>
        <input type="text" class="form-input" v-model="formData.name" placeholder="请输入您的姓名" />
      </view>
      
      <!-- 手机号码 -->
      <view class="form-item">
        <view class="form-label">手机号码：</view>
        <input type="number" class="form-input" v-model="formData.phone" placeholder="请输入您的手机号码" maxlength="11" />
      </view>
      
      <!-- 微信名 -->
      <view class="form-item">
        <view class="form-label">微信名：</view>
        <input type="text" class="form-input" v-model="formData.wechat" placeholder="请输入您的微信名" />
      </view>
      
      <!-- 社区位置 -->
      <view class="form-item">
        <view class="form-label">社区位置：</view>
        <input type="text" class="form-input" v-model="formData.address" placeholder="请输入您所在的社区位置" />
      </view>
    </view>
    
    <!-- 底部按钮 -->
    <view class="submit-btn" @tap="submitForm">提交</view>
    
    <!-- 确认提交弹窗 -->
    <view class="popup-mask" v-if="showConfirmPopup" @click="cancelSubmit"></view>
    <view class="popup-container" v-if="showConfirmPopup">
      <view class="popup-content">
        <view class="popup-title">信息确认</view>
        <view class="popup-desc">请确认您填写的信息无误</view>
        <view class="popup-btn confirm-btn" @tap="confirmSubmit">下一步</view>
        <view class="popup-btn cancel-btn" @tap="cancelSubmit">取消</view>
      </view>
    </view>
  </view>
</template>

<script>
import { applyLeader } from '@/api/group.js';
import CommonHeader from '@/components/CommonHeader/index.vue';

export default {
  components: {
    CommonHeader
  },
  data() {
    return {
      statusBarHeight: 20, // 默认值，会在onLoad中获取真实值
      formData: {
        name: '',
        phone: '',
        wechat: '',
        address: ''
      },
      showConfirmPopup: false
    }
  },
  onLoad() {
    // 获取状态栏高度
    this.statusBarHeight = uni.getSystemInfoSync().statusBarHeight;
  },
  methods: {
    goBack() {
      uni.navigateBack();
    },
    submitForm() {
      // 表单验证
      if (!this.formData.name) {
        uni.showToast({
          title: '请输入姓名',
          icon: 'none'
        });
        return;
      }
      if (!this.formData.phone) {
        uni.showToast({
          title: '请输入手机号码',
          icon: 'none'
        });
        return;
      }
      if (!/^1\d{10}$/.test(this.formData.phone)) {
        uni.showToast({
          title: '请输入正确的手机号码',
          icon: 'none'
        });
        return;
      }
      if (!this.formData.wechat) {
        uni.showToast({
          title: '请输入微信名',
          icon: 'none'
        });
        return;
      }
      if (!this.formData.address) {
        uni.showToast({
          title: '请输入社区位置',
          icon: 'none'
        });
        return;
      }
      
      // 显示确认弹窗
      this.showConfirmPopup = true;
    },
    confirmSubmit() {
      // 关闭弹窗
      this.showConfirmPopup = false;

      // 跳转到状态页面，传递表单数据，但不提交
      uni.navigateTo({
        url: '/pages/index/join/status?type=success&formData=' + encodeURIComponent(JSON.stringify(this.formData)),
        success: function() {
          console.log('跳转成功');
        },
        fail: function(err) {
          console.error('跳转失败', err);
          uni.showToast({
            title: '跳转失败，请重试',
            icon: 'none'
          });
        }
      });
    },
    
    // 跳转到状态页面的通用方法
    navigateToStatus(type) {
      setTimeout(() => {
        uni.navigateTo({
          url: '/pages/index/join/status?type=' + type,
          success: function() {
            console.log('跳转成功');
          },
          fail: function(err) {
            console.error('跳转失败', err);
            uni.showToast({
              title: '跳转失败，请重试',
              icon: 'none'
            });
          }
        });
      }, 300);
    },
    cancelSubmit() {
      this.showConfirmPopup = false;
    }
  }
}
</script>

<style lang="scss" scoped>
.form-page {
  min-height: 100vh;
  background-color: #FFFFFF;
  position: relative;
  display: flex;
  flex-direction: column;
}

/* 状态栏 */
.status-bar {
  background-color: #FFFFFF;
}

/* 自定义头部 */
.custom-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 44px;
  padding: 0 16px;
  background: #fff;
  border-bottom: 1px solid #f2f2f2;
}
.header-cancel {
  color: #888;
  font-size: 17px;
  width: 40px;
}
.header-title {
  flex: 1;
  text-align: center;
  font-size: 17px;
  font-weight: 500;
  color: #222;
}
.header-placeholder {
  width: 40px;
}

/* 表单内容 */
.form-content {
  flex: 1;
  padding: 20px;
  // padding-top: 88rpx; // 防止内容被头部遮挡
  
  .form-item {
    margin-bottom: 24px;
    
    .form-label {
      font-size: 16px;
      color: #333333;
      margin-bottom: 8px;
    }
    
    .form-input {
      height: 46px;
      border-bottom: 1px solid #EEEEEE;
      font-size: 16px;
      color: #666666;
    }
  }
}

/* 底部按钮 */
.submit-btn {
  position: fixed;
  bottom: 34px;
  left: 20px;
  right: 20px;
  height: 48px;
  line-height: 48px;
  text-align: center;
  background-color: #FE8D00;
  color: #FFFFFF;
  font-size: 16px;
  font-weight: 500;
  border-radius: 24px;
}

/* 确认提交弹窗 */
.popup-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 100;
}

.popup-container {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #FFFFFF;
  border-radius: 16px 16px 0 0;
  padding: 20px;
  z-index: 101;
}

.popup-content {
  display: flex;
  flex-direction: column;
}

.popup-title {
  font-size: 18px;
  font-weight: 500;
  color: #333333;
  text-align: center;
  margin-bottom: 8px;
}

.popup-desc {
  font-size: 14px;
  color: #666666;
  text-align: center;
  margin-bottom: 20px;
}

.popup-btn {
  height: 48px;
  line-height: 48px;
  text-align: center;
  border-radius: 24px;
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 12px;
}

.confirm-btn {
  background-color: #FE8D00;
  color: #FFFFFF;
}

.cancel-btn {
  background-color: #F5F5F5;
  color: #333333;
}
</style>
