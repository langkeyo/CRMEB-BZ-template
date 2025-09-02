<template>
  <view class="success-page">
    <view class="header">
      <view class="back-btn" @click="goBack">
        <image src="/static/icons/back-arrow.svg" mode="aspectFit" class="back-icon"></image>
      </view>
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

    // 如果是信息提交成功状态，先检查是否已有申请记录
    if (this.status === 1) {
      this.checkExistingApplication();
    } else {
      // 其他状态直接加载申请状态
      this.checkApplyStatus();
    }
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
      // 如果是提交成功或审核中状态，返回首页
      if (this.status === 1 || this.status === 2) {
        uni.switchTab({
          url: '/pages/index/index'
        });
      } else {
        uni.navigateBack();
      }
    },

    // 检查是否已有申请记录
    checkExistingApplication() {
      console.log('检查是否已有居间服务申请记录...');

      // 调用API获取申请状态
      request.get("group/apply/status", {
        type: 'intermediary' // 指定查询居间服务申请状态
      })
      .then(res => {
        console.log('获取申请状态结果：', res);

        if (res.status === 200 && res.data) {
          if (res.data.has_apply && res.data.apply_info) {
            const applyInfo = res.data.apply_info;
            this.applyInfo = applyInfo;

            // 如果已有申请记录，根据状态直接跳转
            if (applyInfo.status === 0) {
              // 待审核状态，直接显示审核中
              console.log('检测到已有待审核申请，直接显示审核中状态');
              this.status = 2;
            } else if (applyInfo.status === 1) {
              // 审核通过
              console.log('检测到申请已通过');
              this.status = 3;
            } else if (applyInfo.status === 2) {
              // 审核拒绝，保持当前状态或跳转到拒绝页面
              console.log('检测到申请被拒绝');
              // 可以根据需要添加拒绝状态的处理
            }
          } else {
            // 没有申请记录，保持成功状态，等待用户点击下一步
            console.log('没有申请记录，显示正常提交成功状态');
            this.status = 1;
          }
        } else {
          // 获取状态失败，保持成功状态
          console.log('获取申请状态失败，保持成功状态');
          this.status = 1;
        }
      }).catch(err => {
        console.error('检查申请状态失败：', err);
        // 检查失败，保持成功状态
        this.status = 1;
      });
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
          // 注意：这里不需要实际提交数据，因为接口不变，只是状态切换
          this.status = 2; // 直接更新状态为审核中
          break;
        case 2:
          // 审核中，刷新状态
          this.checkApplyStatus();
          break;
        case 3:
          // 审核通过，去看看（跳转到相关页面）
          uni.switchTab({ url: '/pages/index/index' });
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