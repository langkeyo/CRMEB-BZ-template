<template>
  <view class="service-page">
    <!-- 使用通用头部导航组件 -->
    <CommonHeader title="居间服务" @back="goBack"></CommonHeader>
    
    <!-- 服务列表 -->
    <scroll-view scroll-y class="service-list">
      <!-- 服务项1：免费投融咨询 -->
      <view class="service-item">
        <image src="/static/images/intermediary/service1.jpg" mode="aspectFill" class="service-image"></image>
        <view class="service-overlay">
          <view class="service-content">
            <text class="service-number">1.免费投融咨询</text>
            <text class="service-desc">针对个人创业者，中小企业商，想获得投融资需求的企业，免费为其提供各类融资、理财、保险、法律等咨询问题，帮您提供全面查询。</text>
          </view>
        </view>
      </view>
      
      <!-- 服务项2：优惠中介服务 -->
      <view class="service-item">
        <image src="/static/images/intermediary/service2.jpg" mode="aspectFill" class="service-image"></image>
        <view class="service-overlay">
          <view class="service-content">
            <text class="service-number">2.优惠中介服务</text>
            <text class="service-desc">合作机构提供优惠费用的中介，强化贷款流程，操作中遇到的问题，单一客户难以解决的通过，高效优化银行产品，筛选您更优心。</text>
          </view>
        </view>
      </view>
      
      <!-- 服务项3：正规银行优质利率 -->
      <view class="service-item">
        <image src="/static/images/intermediary/service3.jpg" mode="aspectFill" class="service-image"></image>
        <view class="service-overlay">
          <view class="service-content">
            <text class="service-number">3.正规银行优质利率</text>
            <text class="service-desc">专业团队在国内各家银行，长期合作积累，建议使用一手渠道，获取正规银行的贷款产品，综合利用与银行影响，解决"融资难"问题，解决"融资贵"问题，一站式服务。</text>
          </view>
        </view>
      </view>
      
      <!-- 服务项4：一对一约见服务 -->
      <view class="service-item">
        <image src="/static/images/intermediary/service4.jpg" mode="aspectFill" class="service-image"></image>
        <view class="service-overlay">
          <view class="service-content">
            <text class="service-number">4.一对一约见服务</text>
            <text class="service-desc">专业顾问提供直接随时，精准，高效的银行经理约见咨询服务，助你告别烦琐的前期咨询，即使专属专家，即使各种借贷产品，双线对接解决您的难题。</text>
          </view>
        </view>
      </view>
    </scroll-view>
    
    <!-- 底部按钮 -->
    <view class="bottom-button" @click="nextStep">下一步</view>
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
      
    };
  },
  methods: {
    goBack() {
      uni.navigateBack();
    },
    nextStep() {
      // 跳转到下一个页面
      uni.navigateTo({
        url: '/pages/intermediary_service/apply'
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.service-page {
  min-height: 100vh;
  background-color: #FFFFFF;
  display: flex;
  flex-direction: column;
}

/* 顶部导航栏 */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 44px;
  padding: 0 15px;
  background-color: #FFFFFF;
  
  .back-icon {
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    position: relative;
    padding-left: 5px;
    
    .back-arrow {
      width: 10px;
      height: 10px;
      border-top: 1.5px solid #1A1A1A;
      border-left: 1.5px solid #1A1A1A;
      transform: rotate(-45deg);
    }
  }
  
  .title {
    font-size: 18px;
    color: #1A1A1A;
    font-weight: 400;
    font-family: 'PingFang SC', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Helvetica, Segoe UI, Arial, Roboto, 'miui', 'Hiragino Sans GB', 'Microsoft Yahei', sans-serif;
  }
  
  .placeholder {
    width: 30px;
  }
}

/* 服务列表 */
.service-list {
  flex: 1;
  overflow-y: auto;
}

.service-item {
  position: relative;
  height: 200px;
  margin: 15px;
  border-radius: 2px;
  
  .service-image {
    width: 100%;
    height: 100%;
  }
  
  .service-overlay {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    background: linear-gradient(to right, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0));
    display: flex;
    align-items: flex-end;
    padding: 15px;
  }
  
  .service-content {
    max-width: 80%;
  }
  
  .service-number {
    font-size: 16px;
    color: #FFFFFF;
    display: block;
    margin-bottom: 5px;
    font-weight: 400;
    font-family: 'PingFang SC', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Helvetica, Segoe UI, Arial, Roboto, 'miui', 'Hiragino Sans GB', 'Microsoft Yahei', sans-serif;
  }
  
  .service-desc {
    font-size: 14px;
    color: #FFFFFF;
    line-height: 1.4;
    display: block;
    font-family: 'PingFang SC', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Helvetica, Segoe UI, Arial, Roboto, 'miui', 'Hiragino Sans GB', 'Microsoft Yahei', sans-serif;
  }
}

/* 底部按钮 */
.bottom-button {
  height: 45px;
  line-height: 45px;
  background-color: #FE8D00;
  color: #FFFFFF;
  font-size: 16px;
  text-align: center;
  margin: 15px;
  border-radius: 22.5px;
  font-family: 'PingFang SC', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Helvetica, Segoe UI, Arial, Roboto, 'miui', 'Hiragino Sans GB', 'Microsoft Yahei', sans-serif;
}
</style>
