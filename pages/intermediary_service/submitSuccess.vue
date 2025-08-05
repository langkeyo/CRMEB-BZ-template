<template>
  <view class="success-page">
    <view class="header">
      <text class="back-btn" @click="goBack">&#60;</text>
      <text class="title">资料审核</text>
      <text class="placeholder"></text>
    </view>
    <view class="progress-container">
      <view class="progress-bar">
        <view class="progress-bg"></view>
        <view class="progress-dots">
          <view class="dot-wrapper">
            <view class="dot" :class="{ active: status >= 1 }"></view>
            <text class="dot-text" :class="{ active: status >= 1 }">信息提交</text>
          </view>
          <view class="dot-wrapper">
            <view class="dot" :class="{ active: status >= 2 }"></view>
            <text class="dot-text" :class="{ active: status >= 2 }">审核中</text>
          </view>
          <view class="dot-wrapper">
            <view class="dot" :class="{ active: status >= 3 }"></view>
            <text class="dot-text" :class="{ active: status >= 3 }">完成</text>
          </view>
        </view>
      </view>
    </view>
    <view class="icon-area">
      <image class="success-icon" :src="statusIcon" mode="aspectFit" />
    </view>
    <view class="success-text">{{ statusTitle }}</view>
    <view class="desc" v-if="status < 3">{{ statusDesc }}</view>
    <button class="next-btn" @click="handleAction">{{ buttonText }}</button>
  </view>
</template>

<script>
import request from '@/utils/request';

export default {
  data() {
    return {
      status: 1, // 默认为信息提交状态
      applyInfo: null // 存储申请信息
    }
  },
  onLoad(options) {
    // 从URL参数获取状态
    if (options.status) {
      this.status = parseInt(options.status);
    }
    
    // 加载申请状态
    this.checkApplyStatus();
  },
  computed: {
    statusIcon() {
      const icons = {
        1: '/static/icons/submit-success.svg',
        2: '/static/icons/verifying.svg',
        3: '/static/icons/verified-success.svg'
      };
      return icons[this.status];
    },
    statusTitle() {
      const titles = {
        1: '信息提交成功',
        2: '正在审核',
        3: '审核通过'
      };
      return titles[this.status];
    },
    statusDesc() {
      const descs = {
        1: '工作人员将在3个工作日内处理',
        2: '请耐心等待'
      };
      return descs[this.status] || '';
    },
    buttonText() {
      const texts = {
        1: '下一步',
        2: '刷新',
        3: '去看看'
      };
      return texts[this.status];
    }
  },
  methods: {
    goBack() {
      uni.navigateBack();
    },
    // 检查申请状态
    checkApplyStatus() {
      uni.showLoading({ title: '加载中...' });
      
      // 调用API查询申请状态
      request.get('group/apply/status', {
        type: 'intermediary' // 指定查询居间服务申请状态
      })
      .then(res => {
        uni.hideLoading();
        if (res.status === 200 && res.data) {
          this.applyInfo = res.data.apply_info;
          
          // 根据返回的状态更新页面状态
          if (res.data.has_apply && this.applyInfo) {
            // 根据API返回的状态值更新本地状态
            // API状态: 0-待审核, 1-审核通过, 2-审核拒绝
            // 本地状态: 1-信息提交成功, 2-审核中, 3-审核通过
            if (this.applyInfo.status === 0) {
              this.status = 2; // 待审核 -> 审核中
            } else if (this.applyInfo.status === 1) {
              this.status = 3; // 审核通过 -> 完成
            }
          }
        } else {
          uni.showToast({ 
            title: res.msg || '获取申请状态失败', 
            icon: 'none'
          });
        }
      })
      .catch(err => {
        uni.hideLoading();
        uni.showToast({ 
          title: err.msg || '获取申请状态失败', 
          icon: 'none'
        });
      });
    },
    handleAction() {
      switch (this.status) {
        case 1:
          // 提交成功，点击下一步进入审核中状态
          this.status = 2; // 直接更新状态为审核中
          break;
        case 2:
          // 审核中，刷新状态
          this.checkApplyStatus();
          break;
        case 3:
          // 审核通过，去看看（跳转到相关页面）
          uni.navigateTo({ url: '/pages/intermediary_service/index' });
          break;
      }
    }
  }
}
</script>

<style scoped lang="scss">
.success-page {
  background: #fff;
  min-height: 100vh;
  padding-bottom: 60px;
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
  .back-btn {
    color: #888;
    width: 40px;
    font-size: 22px;
    text-align: left;
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

.progress-container {
  padding: 30px 20px;
}

.progress-bar {
  position: relative;
  height: 70px;
}

.progress-bg {
  position: absolute;
  top: 10px; /* 调整背景线的位置 */
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
  margin-top: 4px; /* 精确调整圆点位置，使其垂直居中在线上 */
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

.icon-area {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 32px 0 12px 0;
}

.success-icon {
  width: 80px;
  height: 80px;
}

.success-text {
  text-align: center;
  font-size: 20px;
  color: #222;
  font-weight: 500;
  margin-top: 8px;
}

.desc {
  text-align: center;
  font-size: 15px;
  color: #bbb;
  margin-top: 8px;
  margin-bottom: 32px;
}

.next-btn {
  display: block;
  width: 120px;
  height: 40px;
  margin: 0 auto;
  background: #FF9800;
  color: #fff;
  font-size: 20px;
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