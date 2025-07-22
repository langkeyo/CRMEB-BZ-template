# CommonHeader 通用头部导航组件

## 设计规范

### 尺寸规范
- 头部导航高度：88rpx
- 标题字体大小：36rpx，字重：550（加粗效果）
- 返回图标大小：32rpx（比标题略小）
- 右侧文字大小：36rpx，字重：400（和标题一样大）
- 内边距：32rpx

### 颜色规范
- 标题颜色：#1A1A1A
- 右侧文字颜色：#1A1A1A
- 背景色：#FFFFFF
- 分割线：#F2F2F2

## 使用方法

### 1. 基本用法（只有标题和返回按钮）

```vue
<template>
  <view class="page">
    <CommonHeader title="页面标题" @back="goBack"></CommonHeader>
    <!-- 页面内容 -->
  </view>
</template>

<script>
import CommonHeader from '@/components/CommonHeader/index.vue';

export default {
  components: {
    CommonHeader
  },
  methods: {
    goBack() {
      uni.navigateBack();
    }
  }
}
</script>
```

### 2. 带右侧文字的用法

```vue
<template>
  <view class="page">
    <CommonHeader 
      title="我的站点" 
      :rightText="isSelectMode ? '取消' : '选择'"
      @back="goBack"
      @rightClick="toggleSelectMode">
    </CommonHeader>
    <!-- 页面内容 -->
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
      isSelectMode: false
    }
  },
  methods: {
    goBack() {
      uni.navigateBack();
    },
    toggleSelectMode() {
      this.isSelectMode = !this.isSelectMode;
    }
  }
}
</script>
```

### 3. 带右侧图标的用法

```vue
<template>
  <view class="page">
    <CommonHeader 
      title="设置" 
      rightIcon="/static/icons/more.svg"
      @back="goBack"
      @rightClick="showMore">
    </CommonHeader>
    <!-- 页面内容 -->
  </view>
</template>
```

### 4. 自定义背景色和无边框

```vue
<template>
  <view class="page">
    <CommonHeader 
      title="透明头部" 
      backgroundColor="transparent"
      :showBorder="false"
      @back="goBack">
    </CommonHeader>
    <!-- 页面内容 -->
  </view>
</template>
```

### 5. 不显示返回按钮

```vue
<template>
  <view class="page">
    <CommonHeader 
      title="首页" 
      :showBack="false"
      rightText="设置"
      @rightClick="goToSettings">
    </CommonHeader>
    <!-- 页面内容 -->
  </view>
</template>
```

## Props 参数

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| title | String | '' | 页面标题 |
| showBack | Boolean | true | 是否显示返回按钮 |
| rightText | String | '' | 右侧文字 |
| rightIcon | String | '' | 右侧图标路径 |
| backgroundColor | String | '#FFFFFF' | 背景色 |
| showBorder | Boolean | true | 是否显示底部边框 |

## Events 事件

| 事件名 | 说明 | 参数 |
|--------|------|------|
| back | 返回按钮点击事件 | - |
| rightClick | 右侧按钮点击事件 | - |

## 注意事项

1. 如果不监听 `@back` 事件，组件会自动执行 `uni.navigateBack()`
2. `rightText` 和 `rightIcon` 只能选择其一，优先显示 `rightText`
3. 组件会自动获取状态栏高度，适配不同设备
4. 使用 rpx 单位，自动适配不同屏幕尺寸

## 迁移指南

### 从旧的头部导航迁移

**旧代码：**
```vue
<!-- 状态栏占位 -->
<view class="status-bar" :style="'height:' + statusBarHeight + 'px'"></view>

<!-- 顶部导航 -->
<view class="header">
  <view class="back-icon" @tap="goBack">
    <image src="/static/common/icons/navigation/back_arrow.svg" class="icon-image"></image>
  </view>
  <text class="page-title">页面标题</text>
  <view class="right-placeholder"></view>
</view>

<view class="divider"></view>
```

**新代码：**
```vue
<CommonHeader title="页面标题" @back="goBack"></CommonHeader>
```

这样可以大大简化代码，并确保所有页面的头部样式统一。
