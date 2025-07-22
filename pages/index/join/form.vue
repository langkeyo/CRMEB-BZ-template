<template>
  <view class="form-page">
    <!-- 使用通用头部导航组件 -->
    <CommonHeader title="基本信息" @back="goBack"></CommonHeader>
    
    <!-- 表单内容 -->
    <view class="form-content">
      <!-- 姓名 -->
      <view class="form-item">
        <view class="form-label">姓名：</view>
        <input type="text" class="form-input" v-model="formData.name" placeholder="许**" />
      </view>
      
      <!-- 手机号码 -->
      <view class="form-item">
        <view class="form-label">手机号码：</view>
        <input type="number" class="form-input" v-model="formData.phone" placeholder="1535****503" maxlength="11" />
      </view>
      
      <!-- 微信名 -->
      <view class="form-item">
        <view class="form-label">微信名：</view>
        <input type="text" class="form-input" v-model="formData.wechat" placeholder="加载中..." />
      </view>
      
      <!-- 社区位置 -->
      <view class="form-item">
        <view class="form-label">社区位置：</view>
        <input type="text" class="form-input" v-model="formData.address" placeholder="北京朝阳区三里屯社区" />
      </view>
    </view>
    
    <!-- 底部按钮 -->
    <view class="submit-btn" @tap="submitForm">提交</view>
    
    <!-- 确认提交弹窗 -->
    <view class="popup-mask" v-if="showConfirmPopup" @click="cancelSubmit"></view>
    <view class="popup-container" v-if="showConfirmPopup">
      <view class="popup-content">
        <view class="popup-btn confirm-btn" @tap="confirmSubmit">确定提交</view>
        <view class="popup-btn cancel-btn" @tap="cancelSubmit">取消</view>
      </view>
    </view>
  </view>
</template>

<script>
import { applyLeader } from '@/api/group.js';

export default {
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
      
      // 提交表单
      uni.showLoading({
        title: '提交中...'
      });
      
      applyLeader(this.formData).then(res => {
        uni.hideLoading();
        
        if (res.status === 0) {
          // 跳转到提交成功页面
          uni.navigateTo({
            url: '/pages/index/join/status?type=success'
          });
        } else {
          uni.showToast({
            title: res.msg || '申请失败',
            icon: 'none'
          });
        }
      }).catch(err => {
        uni.hideLoading();
        uni.showToast({
          title: err || '申请失败',
          icon: 'none'
        });
      });
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

/* 顶部导航 */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 44px;
  padding: 0 16px;
  position: sticky;
  top: 0;
  background-color: #FFFFFF;
  z-index: 10;
  border-bottom: 1px solid #F2F2F2;
  
  .back-icon {
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    
    .icon-image {
      width: 20px;
      height: 20px;
    }
  }
  
  .page-title {
    font-size: 18px;
    font-weight: 500;
    color: #333333;
  }
  
  .right-placeholder {
    width: 28px;
  }
}

/* 表单内容 */
.form-content {
  flex: 1;
  padding: 20px;
  
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
