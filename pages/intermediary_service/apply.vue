<template>
  <view class="apply-page">
    <!-- 顶部导航栏 -->
    <view class="header">
      <view class="back-icon" @click="goBack">
        <text class="iconfont icon-left"></text>
      </view>
      <view class="title">申请居间服务</view>
      <view class="placeholder"></view>
    </view>
    
    <!-- 表单区域 -->
    <view class="form-container">
      <view class="form-item">
        <view class="form-label">姓名</view>
        <input type="text" v-model="formData.name" placeholder="请输入您的姓名" class="form-input" />
      </view>
      
      <view class="form-item">
        <view class="form-label">手机号码</view>
        <input type="number" v-model="formData.phone" placeholder="请输入您的手机号码" class="form-input" maxlength="11" />
      </view>
      
      <view class="form-item">
        <view class="form-label">融资金额</view>
        <view class="amount-input">
          <input type="digit" v-model="formData.sum" placeholder="请输入融资金额" class="form-input" />
          <text class="unit">万元</text>
        </view>
      </view>
      
      <view class="form-item">
        <view class="form-label">备注</view>
        <textarea v-model="formData.notes" placeholder="请输入备注信息" class="form-textarea"></textarea>
      </view>
    </view>
    
    <!-- 服务说明 -->
    <view class="service-desc">
      <view class="desc-title">服务说明</view>
      <view class="desc-content">
        <view class="desc-item">1. 居间服务由合作第三方金融机构提供，申请表单提交后会有专业顾问与您联系；</view>
        <view class="desc-item">2. 个人信息仅用于为您提供专业的融资咨询和服务，不会用于其他用途；</view>
        <view class="desc-item">3. 提交申请表示您同意我们的《用户服务协议》和《隐私政策》。</view>
      </view>
    </view>
    
    <!-- 底部按钮 -->
    <view class="bottom-button" @click="submitForm">提交申请</view>
  </view>
</template>

<script>
import { applyIntermediary } from '@/api/group.js';

export default {
  data() {
    return {
      formData: {
        name: '',
        phone: '',
        sum: '',
        notes: ''
      }
    };
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
          title: '手机号码格式不正确',
          icon: 'none'
        });
        return;
      }
      
      if (!this.formData.sum) {
        uni.showToast({
          title: '请输入融资金额',
          icon: 'none'
        });
        return;
      }
      
      // 提交表单
      uni.showLoading({
        title: '提交中...'
      });
      
      applyIntermediary(this.formData).then(res => {
        uni.hideLoading();
        
        if (res.status === 0) {
          uni.showToast({
            title: res.msg || '提交成功',
            icon: 'success',
            duration: 2000,
            success: () => {
              // 延迟跳转回首页
              setTimeout(() => {
                uni.switchTab({
                  url: '/pages/index/index'
                });
              }, 1500);
            }
          });
        } else {
          uni.showToast({
            title: res.msg || '提交失败',
            icon: 'none'
          });
        }
      }).catch(err => {
        uni.hideLoading();
        uni.showToast({
          title: err || '提交失败',
          icon: 'none'
        });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.apply-page {
  min-height: 100vh;
  background-color: #F8F8F8;
  display: flex;
  flex-direction: column;
}

/* 顶部导航栏 */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 88rpx;
  padding: 0 30rpx;
  background-color: #FFFFFF;
  border-bottom: 1rpx solid #F2F2F2;
  
  .back-icon {
    width: 60rpx;
    height: 60rpx;
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
    color: #1A1A1A;
    font-weight: 500;
  }
  
  .placeholder {
    width: 60rpx;
  }
}

/* 表单区域 */
.form-container {
  background-color: #FFFFFF;
  padding: 20rpx 30rpx;
  margin-top: 20rpx;
  border-radius: 12rpx;
}

.form-item {
  padding: 30rpx 0;
  border-bottom: 1rpx solid #F2F2F2;
  
  &:last-child {
    border-bottom: none;
  }
}

.form-label {
  font-size: 28rpx;
  color: #333333;
  margin-bottom: 20rpx;
  font-weight: 500;
}

.form-input {
  height: 70rpx;
  font-size: 28rpx;
  color: #333333;
  width: 100%;
}

.amount-input {
  display: flex;
  align-items: center;
  
  .form-input {
    flex: 1;
  }
  
  .unit {
    font-size: 28rpx;
    color: #666666;
    margin-left: 20rpx;
  }
}

.form-textarea {
  height: 200rpx;
  width: 100%;
  font-size: 28rpx;
  color: #333333;
}

/* 服务说明 */
.service-desc {
  background-color: #FFFFFF;
  padding: 30rpx;
  margin-top: 20rpx;
  border-radius: 12rpx;
}

.desc-title {
  font-size: 32rpx;
  color: #333333;
  font-weight: 500;
  margin-bottom: 20rpx;
}

.desc-content {
  
}

.desc-item {
  font-size: 26rpx;
  color: #666666;
  line-height: 1.6;
  margin-bottom: 10rpx;
}

/* 底部按钮 */
.bottom-button {
  height: 90rpx;
  line-height: 90rpx;
  background-color: #FE8D00;
  color: #FFFFFF;
  font-size: 32rpx;
  text-align: center;
  margin: 50rpx 30rpx;
  border-radius: 45rpx;
}
</style>
