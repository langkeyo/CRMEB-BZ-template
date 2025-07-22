<template>
  <view class="join-page">
    <!-- 使用通用头部导航组件 -->
    <CommonHeader title="加入流程" @back="goBack"></CommonHeader>

    <!-- 流程内容 -->
    <scroll-view scroll-y class="join-content">
      <!-- 步骤1 -->
      <view class="step-item">
        <view class="step-title">1. 提交申请</view>
        <view class="step-desc">在线填写申请人信息，社区位置一键提交表单。系统自动生成申请编号，实时反馈提交成功。</view>
        <image src="/static/images/join/step1.png" mode="widthFix" class="step-image"></image>
      </view>

      <!-- 步骤2 -->
      <view class="step-item">
        <view class="step-title">2. 审核沟通</view>
        <view class="step-desc">平台对申请资料进行评估（如资质匹配度、岗位契合度等）1-3个工作日反馈审核结果，将通过电话或在线沟通工具与申请人确认信息。</view>
        <image src="/static/images/join/step2.png" mode="widthFix" class="step-image"></image>
      </view>

      <!-- 步骤3 -->
      <view class="step-item">
        <view class="step-title">3. 线下培训</view>
        <view class="step-desc">通过电话与申请人预约线下专业培训（含业务流程、系统操作等），支持灵活调整时间，确保高效衔接。</view>
        <image src="/static/images/join/step3.png" mode="widthFix" class="step-image"></image>
      </view>

      <!-- 步骤4 -->
      <view class="step-item">
        <view class="step-title">4. 加入我们</view>
        <view class="step-desc">通过培训考核的申请人，与公司签署合作条款，明确岗位职责、分成比例等条款。开启职业新旅程。</view>
        <image src="/static/images/join/step4.png" mode="widthFix" class="step-image"></image>
      </view>
    </scroll-view>

    <!-- 底部按钮 -->
    <view class="next-btn" @tap="goToApply">下一步</view>
  </view>
</template>

<script>
import CommonHeader from '@/components/CommonHeader/index.vue';

export default {
  components: {
    CommonHeader
  },
  data () {
    return {
    }
  },
  methods: {
    goBack () {
      uni.navigateBack()
    },
    goToApply () {
      // 跳转到基本信息填写页面
      uni.navigateTo({
        url: '/pages/index/join/form'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.join-page {
  min-height: 100vh;
  background-color: #F5F6FA;
  position: relative;
  display: flex;
  flex-direction: column;
}



/* 流程内容 */
.join-content {
  flex: 1;
  padding: 20px 20px 90px;

  .step-item {
    background-color: #FFFFFF;
    border-radius: 12px;
    padding: 16px 20px;
    margin-bottom: 16px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.02);

    .step-title {
      font-size: 16px;
      font-weight: 500;
      color: #333333;
      margin-bottom: 8px;
    }

    .step-desc {
      font-size: 14px;
      color: #666666;
      line-height: 1.5;
      margin-bottom: 16px;
    }

    .step-image {
      width: 100%;
      border-radius: 8px;
      display: block;
    }
  }
}

/* 底部按钮 */
.next-btn {
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
</style>
