<template>
  <view class="status-page">
    <!-- 自定义头部 -->
    <view class="custom-header">
      <view class="back-btn" @click="goBack">
        <image src="/static/icons/back-arrow.svg" mode="aspectFit" class="back-icon"></image>
      </view>
      <text class="title">资料审核</text>
      <text class="placeholder"></text>
    </view>
    
    <!-- 进度条 -->
    <view class="progress-container">
      <view class="progress-bar">
        <view class="progress-bg"></view>
        <view class="progress-dots">
          <view class="dot-wrapper">
            <view class="dot" :class="{ active: true }"></view>
            <text class="dot-text" :class="{ active: true }">信息提交</text>
          </view>
          <view class="dot-wrapper">
            <view class="dot" :class="{ active: status === 'reviewing' || status === 'approved' }"></view>
            <text class="dot-text" :class="{ active: status === 'reviewing' || status === 'approved' }">审核中</text>
          </view>
          <view class="dot-wrapper">
            <view class="dot" :class="{ active: status === 'approved' }"></view>
            <text class="dot-text" :class="{ active: status === 'approved' }">完成</text>
          </view>
        </view>
      </view>
    </view>
    
    <!-- 提交成功/待审核状态 -->
    <view class="status-content" v-if="status === 'success'">
      <view class="icon-area">
        <image class="status-icon" src="/static/icons/submit-success.svg" mode="aspectFit"></image>
      </view>
      <view class="status-title">信息提交成功</view>
      <view class="status-desc">相关人员将在3个工作日内处理</view>
      <button class="next-btn" @tap="handleNextStep">下一步</button>
    </view>
    
    <!-- 审核中状态 -->
    <view class="status-content" v-else-if="status === 'reviewing'">
      <view class="icon-area">
        <image class="status-icon" src="/static/icons/verifying.svg" mode="aspectFit"></image>
      </view>
      <view class="status-title">正在审核</view>
      <view class="status-desc">请耐心等待</view>
      <button class="next-btn" @tap="checkStatus">刷新</button>
    </view>
    
    <!-- 审核通过状态 -->
    <view class="status-content" v-else-if="status === 'approved'">
      <view class="icon-area">
        <image class="status-icon" src="/static/icons/verified-success.svg" mode="aspectFit"></image>
      </view>
      <view class="status-title">审核通过</view>
      <button class="next-btn" @tap="goToHome">去看看</button>
    </view>
    
    <!-- 审核拒绝状态 -->
    <view class="status-content" v-else-if="status === 'rejected'">
      <view class="icon-area">
        <image class="status-icon" src="/static/icons/submit-twice.svg" mode="aspectFit"></image>
      </view>
      <view class="status-title">审核未通过</view>
      <view class="status-desc">抱歉，您的申请未通过审核</view>
      <view class="status-tips">原因：{{rejectReason || '信息不符合要求'}}</view>
      <button class="next-btn" @tap="reapply">重新申请</button>
    </view>
  </view>
</template>

<script>
import CommonHeader from '@/components/CommonHeader/index.vue';
import { applyLeader } from '@/api/group.js';
import request from '@/utils/request'; // Added import for request

export default {
  components: {
    CommonHeader
  },
  data() {
    return {
      status: 'success', // 默认为提交成功状态
      rejectReason: '', // 拒绝原因
      formData: {} // 存储表单数据
    }
  },
  onLoad(options) {
    // 根据传入的type参数设置状态
    if (options.type) {
      this.status = options.type;
    }

    // 如果有拒绝原因
    if (options.reason) {
      this.rejectReason = decodeURIComponent(options.reason);
    }

    // 接收表单数据
    if (options.formData) {
      try {
        this.formData = JSON.parse(decodeURIComponent(options.formData));
        console.log('接收到表单数据:', this.formData);
      } catch (e) {
        console.error('解析表单数据失败:', e);
      }
    }

    // 如果是成功状态，先检查是否已有申请记录
    if (this.status === 'success') {
      this.checkExistingApplication();
    } else if (this.status === 'reviewing') {
      // 如果是审核中状态，调用API获取最新状态
      this.checkStatus();
    }
  },
  methods: {
    // 处理下一步按钮点击
    handleNextStep() {
      if (this.status === 'success') {
        // 在成功状态下，点击下一步才真正提交数据
        this.submitFormData();
      } else {
        // 其他状态直接跳转到首页
        this.goToHome();
      }
    },

    // 检查是否已有申请记录
    checkExistingApplication() {
      console.log('检查是否已有申请记录...');

      // 调用API获取申请状态
      request.get("group/apply/status", {
        type: 'leader' // 指定查询团长申请状态
      })
      .then(res => {
        console.log('获取申请状态结果：', res);

        if (res.status === 200 && res.data) {
          if (res.data.has_apply && res.data.apply_info) {
            const applyInfo = res.data.apply_info;

            // 如果已有申请记录，根据状态直接跳转
            if (applyInfo.status === 0) {
              // 待审核状态，直接显示审核中
              console.log('检测到已有待审核申请，直接显示审核中状态');
              this.status = 'reviewing';
            } else if (applyInfo.status === 1) {
              // 审核通过
              console.log('检测到申请已通过');
              this.status = 'approved';
            } else if (applyInfo.status === 2) {
              // 审核拒绝
              console.log('检测到申请被拒绝');
              this.status = 'rejected';
              if (applyInfo.reason) {
                this.rejectReason = applyInfo.reason;
              }
            }
          } else {
            // 没有申请记录，保持成功状态，等待用户点击下一步
            console.log('没有申请记录，显示正常提交成功状态');
            this.status = 'success';
          }
        } else {
          // 获取状态失败，保持成功状态
          console.log('获取申请状态失败，保持成功状态');
          this.status = 'success';
        }
      }).catch(err => {
        console.error('检查申请状态失败：', err);
        // 检查失败，保持成功状态
        this.status = 'success';
      });
    },

    // 提交表单数据到服务器
    submitFormData() {
      if (!this.formData || !this.formData.name) {
        uni.showToast({
          title: '表单数据丢失，请重新填写',
          icon: 'none'
        });
        return;
      }

      uni.showLoading({
        title: '提交中...'
      });

      console.log('开始提交表单数据...', this.formData);

      applyLeader(this.formData).then(res => {
        uni.hideLoading();
        console.log('提交表单返回结果：', res);

        if (res.status === 0) {
          // 提交成功，切换到审核中状态
          this.status = 'reviewing';
        } else {
          // 检查是否是重复申请的错误
          if (res.msg && res.msg.includes('已申请') && res.msg.includes('重复申请')) {
            console.log('检测到重复申请，切换到审核中状态');
            this.status = 'reviewing';
          } else {
            // 其他错误，显示错误信息
            uni.showToast({
              title: res.msg || '申请失败',
              icon: 'none',
              duration: 2000
            });
          }
        }
      }).catch(err => {
        uni.hideLoading();
        console.error('提交表单失败：', err);

        // 检查错误信息是否包含"重复申请"
        if (err && ((typeof err === 'string' && err.includes('重复申请')) ||
            (err.msg && err.msg.includes('重复申请')))) {
          console.log('捕获到重复申请错误，切换到审核中状态');
          this.status = 'reviewing';
        } else {
          // 显示错误信息
          let errorMsg = '';
          if (typeof err === 'string') {
            errorMsg = err;
          } else if (err && err.msg) {
            errorMsg = err.msg;
          } else {
            errorMsg = '申请失败';
          }

          uni.showToast({
            title: errorMsg,
            icon: 'none',
            duration: 2000
          });
        }
      });
    },

    goBack() {
      // 如果是提交成功或审核中状态，返回首页
      if (this.status === 'success' || this.status === 'reviewing') {
        this.goToHome();
      } else {
        uni.navigateBack();
      }
    },
    goToHome() {
      // 返回首页
      uni.switchTab({
        url: '/pages/index/index'
      });
    },
    reapply() {
      // 重新申请，返回基本信息填写页面
      uni.navigateTo({
        url: '/pages/index/join/form'
      });
    },
    checkStatus() {
      // 刷新状态，调用API获取最新状态
      uni.showLoading({
        title: '加载中...'
      });
      
      // 调用API获取申请状态，使用正确的参数
      request.get("group/apply/status", {
        type: 'leader' // 指定查询团长申请状态
      })
      .then(res => {
        uni.hideLoading();
        console.log('获取申请状态结果：', res);
        
        if (res.status === 200 && res.data) {
          // 根据API返回的状态更新页面状态
          if (res.data.has_apply && res.data.apply_info) {
            const applyInfo = res.data.apply_info;
            
            // 根据API返回的状态值更新本地状态
            // API状态: 0-待审核, 1-审核通过, 2-审核拒绝
            if (applyInfo.status === 0) {
              this.status = 'reviewing'; // 待审核 -> 审核中
              uni.showToast({
                title: applyInfo.status_text || '审核中',
                icon: 'none'
              });
            } else if (applyInfo.status === 1) {
              this.status = 'approved'; // 审核通过
              uni.showToast({
                title: applyInfo.status_text || '审核通过',
                icon: 'success'
              });
            } else if (applyInfo.status === 2) {
              this.status = 'rejected'; // 审核拒绝
              if (applyInfo.reason) {
                this.rejectReason = applyInfo.reason;
              }
              uni.showToast({
                title: applyInfo.status_text || '审核拒绝',
                icon: 'none'
              });
            } else {
              uni.showToast({
                title: applyInfo.status_text || '状态已更新',
                icon: 'none'
              });
            }
          } else {
            // 没有申请记录
            this.status = 'success'; // 重置为提交成功状态
            uni.showToast({
              title: '未找到申请记录',
              icon: 'none'
            });
          }
        } else {
          // 获取状态失败
          uni.showToast({
            title: res.msg || '获取状态失败',
            icon: 'none'
          });
        }
      }).catch(err => {
        uni.hideLoading();
        console.error('获取申请状态失败：', err);
        
        uni.showToast({
          title: '获取状态失败，请重试',
          icon: 'none'
        });
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.status-page {
  min-height: 100vh;
  background-color: #FFFFFF;
  position: relative;
  display: flex;
  flex-direction: column;
}

/* 自定义头部 */
.custom-header {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  height: 44px;
  padding: 0 16px;
  border-bottom: 1px solid #f2f2f2;
  font-size: 17px;
  color: #333;
  
  .back-btn {
    width: 40px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }
  
  .back-icon {
    width: 12px;
    height: 20px;
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

/* 进度条样式 */
.progress-container {
  padding: 30px 20px;
}

.progress-bar {
  position: relative;
  height: 70px;
}

.progress-bg {
  position: absolute;
  top: 10px;
  left: 0;
  right: 0;
  height: 8px;
  background: linear-gradient(90deg, #FF9800 30%, #FFE0B2 70%);
  border-radius: 4px;
}

.progress-dots {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
}

.dot-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 33.33%;
}

.dot {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: #fff;
  border: 3px solid #FFE0B2;
  box-sizing: border-box;
  margin-top: 4px;
  margin-bottom: 8px;
}

.dot.active {
  background-color: #FF9800;
  border-color: #FF9800;
}

.dot-text {
  font-size: 14px;
  color: #bbb;
}

.dot-text.active {
  color: #FF9800;
  font-weight: 500;
}

/* 状态内容 */
.status-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 20px;
}

.icon-area {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 32px 0 12px 0;
}

.status-icon {
  width: 80px;
  height: 80px;
}

.status-title {
  text-align: center;
  font-size: 20px;
  color: #222;
  font-weight: 500;
  margin-top: 8px;
}

.status-desc {
  text-align: center;
  font-size: 15px;
  color: #bbb;
  margin-top: 8px;
  margin-bottom: 32px;
}

.status-tips {
  font-size: 14px;
  color: #999999;
  margin-bottom: 40px;
  text-align: center;
}

/* 下一步按钮 */
.next-btn {
  display: block;
  width: 120px;
  height: 40px;
  margin: 0 auto;
  background: #FF9800;
  color: #fff;
  font-size: 16px;
  border-radius: 0;
  border: none;
  margin-top: 24px;
  text-align: center;
  line-height: 40px;
  font-weight: 400;
  box-shadow: none;
  padding: 0;
}
</style>
