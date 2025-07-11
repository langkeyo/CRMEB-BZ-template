<template>
  <view class="change-password-page">
    <!-- 顶部导航栏 -->
    <view class="header">
      <view class="title">修改密码</view>
    </view>
    
    <!-- 分割线 -->
    <view class="divider"></view>
    
    <!-- 修改密码表单 -->
    <view class="form-container">
      <!-- 原密码 -->
      <view class="form-item">
        <view class="form-label">原密码</view>
        <input 
          class="form-input" 
          type="password" 
          placeholder="请输入原密码" 
          password
          v-model="formData.oldPassword"
        />
      </view>
      
      <!-- 新密码 -->
      <view class="form-item">
        <view class="form-label">新密码</view>
        <input 
          class="form-input" 
          type="password" 
          placeholder="请输入新密码" 
          password
          v-model="formData.newPassword"
        />
      </view>
      
      <!-- 确认新密码 -->
      <view class="form-item">
        <view class="form-label">确认新密码</view>
        <input 
          class="form-input" 
          type="password" 
          placeholder="请再次输入新密码" 
          password
          v-model="formData.confirmPassword"
        />
      </view>
      
      <!-- 提交按钮 -->
      <view class="submit-button" @click="submitForm">确认修改</view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      formData: {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      }
    }
  },
  methods: {
    submitForm() {
      // 表单验证
      if (!this.formData.oldPassword) {
        uni.showToast({
          title: '请输入原密码',
          icon: 'none'
        });
        return;
      }
      
      if (!this.formData.newPassword) {
        uni.showToast({
          title: '请输入新密码',
          icon: 'none'
        });
        return;
      }
      
      if (this.formData.newPassword.length < 6) {
        uni.showToast({
          title: '新密码不能少于6位',
          icon: 'none'
        });
        return;
      }
      
      if (this.formData.newPassword !== this.formData.confirmPassword) {
        uni.showToast({
          title: '两次输入的密码不一致',
          icon: 'none'
        });
        return;
      }
      
      // 提交修改密码请求
      uni.showLoading({
        title: '提交中...'
      });
      
      // 模拟请求
      setTimeout(() => {
        uni.hideLoading();
        uni.showToast({
          title: '密码修改成功',
          icon: 'success'
        });
        
        // 返回上一页
        setTimeout(() => {
          uni.navigateBack();
        }, 1500);
      }, 1000);
    }
  }
}
</script>

<style lang="scss">
.change-password-page {
  min-height: 100vh;
  background-color: #FFFFFF;
  
  .header {
    padding: 44px 15px 15px;
    position: relative;
    
    .title {
      font-size: 18px;
      color: #1A1A1A;
      font-weight: 400;
      text-align: center;
    }
  }
  
  .divider {
    height: 0.5px;
    background-color: #F2F2F2;
    width: 100%;
  }
  
  .form-container {
    padding: 20px 15px;
    
    .form-item {
      margin-bottom: 20px;
      
      .form-label {
        font-size: 14px;
        color: #4D4D4D;
        margin-bottom: 10px;
      }
      
      .form-input {
        width: 100%;
        height: 44px;
        background-color: #F5F5F5;
        border-radius: 4px;
        padding: 0 15px;
        font-size: 14px;
        color: #1A1A1A;
      }
    }
    
    .submit-button {
      width: 100%;
      height: 44px;
      background-color: #FE8D00;
      color: #FFFFFF;
      font-size: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
      margin-top: 30px;
    }
  }
}
</style> 