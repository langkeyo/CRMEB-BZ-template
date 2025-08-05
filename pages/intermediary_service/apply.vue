<template>
  <view class="base-info-page">
    <view class="header">
      <text class="cancel-btn" @click="goBack">取消</text>
      <text class="title">基本信息</text>
      <text class="placeholder"></text>
    </view>
    <view class="info-list">
      <view class="info-item">
        <text class="label">姓名：</text>
        <input
          class="input"
          v-model="form.name"
          type="text"
          placeholder="请输入姓名"
          maxlength="20"
        />
        <text class="clear-btn" v-if="form.name" @click="form.name = ''">×</text>
      </view>
      <view class="info-item">
        <text class="label">手机号码：</text>
        <input
          class="input"
          v-model="form.phone"
          type="tel"
          placeholder="请输入手机号"
          maxlength="11"
        />
        <text class="clear-btn" v-if="form.phone" @click="form.phone = ''">×</text>
      </view>
      <view class="info-item">
        <text class="label">申请金额：</text>
        <input
          class="input"
          v-model="form.sum"
          type="number"
          placeholder="请输入申请金额"
        />
        <text class="clear-btn" v-if="form.sum" @click="form.sum = ''">×</text>
      </view>
      <view class="info-item textarea-container">
        <text class="label">备注说明：</text>
        <textarea
          class="textarea"
          v-model="form.notes"
          placeholder="请输入备注说明"
          maxlength="200"
        />
        <text class="clear-btn" v-if="form.notes" @click="form.notes = ''">×</text>
      </view>
    </view>
    <view class="footer">
      <button class="submit-btn" @click="submit">提交</button>
    </view>
  </view>
</template>

<script>
import request from '@/utils/request';

export default {
  data() {
    return {
      form: {
        name: '',
        phone: '',
        sum: '',
        notes: ''
      }
    }
  },
  methods: {
    goBack() {
      uni.navigateBack();
    },
    submit() {
      if (!this.form.name) {
        uni.showToast({ title: '请输入姓名', icon: 'none' });
        return;
      }
      if (!/^1\d{10}$/.test(this.form.phone)) {
        uni.showToast({ title: '请输入正确手机号', icon: 'none' });
        return;
      }
      if (!this.form.sum) {
        uni.showToast({ title: '请输入申请金额', icon: 'none' });
        return;
      }
      if (!/^\d+(\.\d{1,2})?$/.test(this.form.sum)) {
        uni.showToast({ title: '请输入正确的金额格式', icon: 'none' });
        return;
      }

      // 显示加载中
      uni.showLoading({ title: '提交中...' });

      // 调用居间服务申请API，使用API文档中的参数
      request.post('group/intermediary/apply', {
        name: this.form.name,
        phone: this.form.phone,
        sum: this.form.sum,
        notes: this.form.notes || ''
      })
      .then(res => {
        uni.hideLoading();
        if (res.status === 200) {
          // 跳转到带进度条的提交成功页面
          uni.navigateTo({
            url: '/pages/intermediary_service/submitSuccess?status=1'
          });
        } else if (res.status === 400 && res.msg === "居间服务已申请,请勿重复申请") {
          // 重复申请，检查状态并跳转到对应页面
          this.checkExistingStatus();
        } else {
          uni.showToast({ 
            title: res.msg || '提交失败', 
            icon: 'none'
          });
        }
      })
      .catch(err => {
        uni.hideLoading();
        // 检查是否是重复申请的错误
        if (err && err.status === 400 && err.msg === "居间服务已申请,请勿重复申请") {
          // 重复申请，检查状态并跳转到对应页面
          this.checkExistingStatus();
        } else {
          uni.showToast({ 
            title: err.msg || '提交失败，请稍后再试', 
            icon: 'none'
          });
        }
      });
    },
    // 检查已存在的申请状态
    checkExistingStatus() {
      uni.showLoading({ title: '获取状态...' });
      
      // 调用API查询申请状态
      request.get('group/apply/status', {
        type: 'intermediary'
      })
      .then(res => {
        uni.hideLoading();
        if (res.status === 200 && res.data) {
          if (res.data.has_apply && res.data.apply_info) {
            const applyInfo = res.data.apply_info;
            
            // 根据API返回的状态值跳转到对应页面
            // API状态: 0-待审核, 1-审核通过, 2-审核拒绝
            if (applyInfo.status === 0) {
              // 待审核，跳转到审核中页面
              uni.navigateTo({
                url: '/pages/intermediary_service/submitSuccess?status=2'
              });
            } else if (applyInfo.status === 1) {
              // 审核通过，跳转到审核通过页面
              uni.navigateTo({
                url: '/pages/intermediary_service/submitSuccess?status=3'
              });
            } else {
              // 其他状态，跳转到状态页面
              uni.navigateTo({
                url: '/pages/intermediary_service/status'
              });
            }
          } else {
            // 没有申请记录，跳转到状态页
            uni.navigateTo({
              url: '/pages/intermediary_service/status'
            });
          }
        } else {
          // 获取状态失败，跳转到状态页
          uni.navigateTo({
            url: '/pages/intermediary_service/status'
          });
        }
      })
      .catch(err => {
        uni.hideLoading();
        // 获取状态失败，跳转到状态页
        uni.navigateTo({
          url: '/pages/intermediary_service/status'
        });
      });
    }
  }
}
</script>

<style scoped lang="scss">
.base-info-page {
  background: #fff;
  min-height: 100vh;
  padding-bottom: 80px;
}
.header {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  height: 44px;
  padding: 0 16px;
  border-bottom: 1px solid #f2f2f2;
  font-size: 17px;
  color: #333;
  .cancel-btn { 
    color: #888; 
    width: 40px; 
  }
  .title { 
    flex: 1; 
    text-align: center; 
    font-weight: 500; 
    color: #222; 
  }
  .placeholder { 
    width: 40px; 
  }
}
.info-list {
  margin-top: 10px;
  background: #fff;
}
.info-item {
  display: flex;
  align-items: center;
  height: 54px;
  padding: 0 16px;
  border-bottom: 1px solid #f2f2f2;
  font-size: 16px;
  position: relative;
  .label { 
    color: #222; 
    width: 90px; 
    flex-shrink: 0;
  }
  .input {
    flex: 1;
    border: none;
    font-size: 16px;
    background: transparent;
    padding-left: 8px;
    padding-right: 30px;
    height: 100%;
  }
  .textarea {
    flex: 1;
    border: none;
    font-size: 16px;
    background: transparent;
    padding-left: 8px;
    padding-right: 30px;
    min-height: 80px;
    padding-top: 10px;
    padding-bottom: 10px;
  }
  .clear-btn {
    position: absolute;
    right: 16px;
    width: 20px;
    height: 20px;
    line-height: 20px;
    text-align: center;
    border-radius: 50%;
    background: #ccc;
    color: #fff;
    font-size: 14px;
  }
}
.info-item:last-child { 
  border-bottom: none; 
}
.textarea-container {
  height: auto;
  min-height: 100px;
  align-items: flex-start;
  padding-top: 10px;
  padding-bottom: 10px;
  
  .label {
    padding-top: 10px;
  }
  
  .clear-btn {
    top: 10px;
  }
}
.footer {
  position: fixed;
  left: 0; 
  right: 0; 
  bottom: 0;
  background: #fff;
  padding: 12px 16px 24px 16px;
  box-shadow: 0 -2px 8px rgba(0,0,0,0.03);
}
.submit-btn {
  width: 100%;
  height: 44px;
  background: #FE8D00;
  color: #fff;
  font-size: 18px;
  border-radius: 22px;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
