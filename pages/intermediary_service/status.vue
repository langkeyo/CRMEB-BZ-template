<template>
  <view class="status-page">
    <view class="header">
      <text class="back-btn" @click="goBack">&#60;</text>
      <text class="title">居间服务</text>
      <text class="placeholder"></text>
    </view>
    <view class="center-content">
      <image class="status-icon" :src="statusIcon" mode="aspectFit" @click="checkStatus" />
      <view class="status-title">{{ statusTitle }}</view>
      <view class="status-desc">{{ statusDesc }}</view>
      <button class="refresh-btn" @click="checkStatus">刷新状态</button>
    </view>
  </view>
</template>

<script>
import request from '@/utils/request';

export default {
  data() {
    return {
      applyInfo: null,
      loading: false
    }
  },
  computed: {
    statusIcon() {
      if (!this.applyInfo) return '/static/icons/submit-twice.svg';
      
      // 根据API状态返回对应图标
      const icons = {
        0: '/static/icons/verifying.svg', // 待审核
        1: '/static/icons/verified-success.svg', // 审核通过
        2: '/static/icons/verified-fail.svg' // 审核拒绝
      };
      return icons[this.applyInfo.status] || '/static/icons/submit-twice.svg';
    },
    statusTitle() {
      if (!this.applyInfo) return '申请已提交';
      
      // 根据API状态返回对应标题
      const titles = {
        0: '审核中',
        1: '审核已通过',
        2: '审核未通过'
      };
      return titles[this.applyInfo.status] || '申请已提交';
    },
    statusDesc() {
      if (!this.applyInfo) return '您的信息已经提交，稍后会有专业人员与您联系，请耐心等待哦~';
      
      // 根据API状态返回对应描述
      const descs = {
        0: '您的申请正在审核中，请耐心等待结果',
        1: '恭喜您，申请已通过审核！',
        2: '很遗憾，您的申请未通过审核'
      };
      return descs[this.applyInfo.status] || '您的信息已经提交，稍后会有专业人员与您联系，请耐心等待哦~';
    }
  },
  onLoad() {
    // 页面加载时检查状态
    this.checkStatus();
  },
  methods: {
    goBack() {
      uni.navigateBack();
    },
    goToVerifying() {
      // 跳转到审核中状态页面
      uni.navigateTo({
        url: '/pages/intermediary_service/submitSuccess?status=2'
      });
    },
    checkStatus() {
      if (this.loading) return;
      this.loading = true;
      
      uni.showLoading({ title: '加载中...' });
      
      // 调用API查询申请状态
      request.get('group/apply/status', {
        type: 'intermediary' // 指定查询居间服务申请状态
      })
      .then(res => {
        uni.hideLoading();
        this.loading = false;
        
        if (res.status === 200 && res.data) {
          if (res.data.has_apply && res.data.apply_info) {
            this.applyInfo = res.data.apply_info;
            
            // 如果审核通过，可以在此添加其他逻辑
            if (this.applyInfo.status === 1) {
              setTimeout(() => {
                uni.showToast({
                  title: '恭喜您，申请已通过！',
                  icon: 'success'
                });
              }, 500);
            }
          } else {
            // 没有申请记录
            uni.showToast({
              title: '未找到申请记录',
              icon: 'none'
            });
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
        this.loading = false;
        uni.showToast({ 
          title: err.msg || '获取申请状态失败', 
          icon: 'none'
        });
      });
    }
  }
}
</script>

<style scoped lang="scss">
.status-page {
  background: #fff;
  min-height: 100vh;
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
.center-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 80px;
}
.status-icon {
  width: 120px;
  height: 120px;
  margin-bottom: 24px;
}
.status-title {
  font-size: 20px;
  font-weight: 500;
  color: #333;
  margin-bottom: 16px;
  text-align: center;
}
.status-desc {
  color: #888;
  font-size: 15px;
  text-align: center;
  line-height: 1.6;
  max-width: 80vw;
  margin-bottom: 40px;
}
.refresh-btn {
  width: 180px;
  height: 40px;
  background: #FF9800;
  color: #fff;
  font-size: 16px;
  border-radius: 20px;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style> 