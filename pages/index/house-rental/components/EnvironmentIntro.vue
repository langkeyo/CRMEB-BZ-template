<!--
EnvironmentIntro 环境介绍组件
用于显示可展开/收起的环境介绍文字

Props:
- introText: String - 介绍文字 (必需)
- title: String - 标题 (默认: '环境介绍')
- maxLength: Number - 收起时显示的最大字符数 (默认: 150)
-->

<template>
  <view class="section environment-intro-section">
    <view class="section-header">
      <text class="section-title">{{ title }}</text>
    </view>
    <view class="environment-intro">
      <text class="intro-text" :class="{expanded: showFullIntro}">
        {{ showFullIntro ? introText : (introText.length > maxLength ? introText.substring(0, maxLength) + '...' : introText) }}
      </text>
      <view class="view-more" @click="toggleIntroExpand" v-if="introText.length > maxLength">
        <text>{{ showFullIntro ? '收起' : '查看更多' }}</text>
        <view class="arrow" :class="{rotated: showFullIntro}"></view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'EnvironmentIntro',
  props: {
    introText: {
      type: String,
      required: true,
      default: ''
    },
    title: {
      type: String,
      default: '环境介绍'
    },
    maxLength: {
      type: Number,
      default: 150
    }
  },
  data() {
    return {
      showFullIntro: false
    }
  },
  methods: {
    toggleIntroExpand() {
      this.showFullIntro = !this.showFullIntro;
      this.$emit('toggleExpand', this.showFullIntro);
    }
  }
}
</script>

<style lang="scss" scoped>
/* 环境介绍 */
.section {
  background-color: #FFFFFF;
  padding: 30rpx;
  margin-bottom: 20rpx;

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20rpx;

    .section-title {
      font-size: 32rpx;
      font-weight: 500;
      color: #333333;
    }
  }

  .environment-intro {
    .intro-text {
      font-size: 28rpx;
      color: #666666;
      line-height: 1.6;
      display: block;
      margin-bottom: 20rpx;

      &.expanded {
        // 展开状态的样式
      }
    }

    .view-more {
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;

      text {
        font-size: 26rpx;
        color: #FF6B35;
        margin-right: 8rpx;
      }

      .arrow {
        width: 0;
        height: 0;
        border-left: 8rpx solid transparent;
        border-right: 8rpx solid transparent;
        border-top: 8rpx solid #FF6B35;
        transition: transform 0.3s ease;

        &.rotated {
          transform: rotate(180deg);
        }
      }
    }
  }
}
</style>
