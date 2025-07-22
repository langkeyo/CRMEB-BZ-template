<template>
  <view class="status-page">
    <!-- 使用通用头部导航组件 -->
    <CommonHeader title="资料审核" @back="goBack"></CommonHeader>
    
    <!-- 提交成功/待审核状态 -->
    <view class="status-content" v-if="status === 'success'">
      <image class="status-image" src="/static/images/index/join/status_waiting.svg" mode="aspectFit"></image>
      <view class="status-title">提交成功</view>
      <view class="status-desc">您的申请已提交，我们会尽快审核，请耐心等待</view>
      <view class="status-tips">预计审核时间：1-3个工作日</view>
      <view class="btn-primary" @tap="goToHome">返回首页</view>
    </view>
    
    <!-- 审核中状态 -->
    <view class="status-content" v-else-if="status === 'reviewing'">
      <image class="status-image" src="/static/images/index/join/status_reviewing.svg" mode="aspectFit"></image>
      <view class="status-title">审核中</view>
      <view class="status-desc">您的申请正在审核中，请耐心等待</view>
      <view class="status-tips">预计审核时间：1-3个工作日</view>
      <view class="btn-primary" @tap="goToHome">返回首页</view>
    </view>
    
    <!-- 审核通过状态 -->
    <view class="status-content" v-else-if="status === 'approved'">
      <image class="status-image" src="/static/images/index/join/status_approved.svg" mode="aspectFit"></image>
      <view class="status-title">审核通过</view>
      <view class="status-desc">恭喜您！您的申请已通过审核</view>
      <view class="status-tips">请联系社区团长开通账号</view>
      <view class="btn-primary" @tap="goToHome">返回首页</view>
    </view>
    
    <!-- 审核拒绝状态 -->
    <view class="status-content" v-else-if="status === 'rejected'">
      <image class="status-image" src="/static/images/index/join/status_rejected.svg" mode="aspectFit"></image>
      <view class="status-title">审核未通过</view>
      <view class="status-desc">抱歉，您的申请未通过审核</view>
      <view class="status-tips">原因：{{rejectReason || '信息不符合要求'}}</view>
      <view class="btn-primary" @tap="reapply">重新申请</view>
      <view class="btn-secondary" @tap="goToHome">返回首页</view>
    </view>
  </view>
</template>

<script>
import CommonHeader from '@/components/CommonHeader/index.vue';

export default {
  components: {
    CommonHeader
  },
  data() {
    return {
      status: 'success', // 默认为提交成功状态
      rejectReason: '', // 拒绝原因
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
  },
  methods: {
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



/* 状态内容 */
.status-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 60px;
  
  .status-image {
    width: 180px;
    height: 180px;
    margin-bottom: 24px;
  }
  
  .status-title {
    font-size: 20px;
    font-weight: 600;
    color: #333333;
    margin-bottom: 16px;
  }
  
  .status-desc {
    font-size: 16px;
    color: #666666;
    margin-bottom: 12px;
    text-align: center;
    padding: 0 40px;
  }
  
  .status-tips {
    font-size: 14px;
    color: #999999;
    margin-bottom: 40px;
    text-align: center;
  }
}

/* 按钮样式 */
.btn-primary {
  width: 280px;
  height: 48px;
  line-height: 48px;
  text-align: center;
  background-color: #FE8D00;
  color: #FFFFFF;
  font-size: 16px;
  font-weight: 500;
  border-radius: 24px;
  margin-bottom: 16px;
}

.btn-secondary {
  width: 280px;
  height: 48px;
  line-height: 48px;
  text-align: center;
  background-color: #F5F5F5;
  color: #666666;
  font-size: 16px;
  font-weight: 500;
  border-radius: 24px;
}
</style>
