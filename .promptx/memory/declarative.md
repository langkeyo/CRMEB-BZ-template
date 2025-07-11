# 陈述性记忆

## 高价值记忆（评分 ≥ 7）

- 2025/07/10 11:28 START
# CRMEB uni-app 前端开发专业Prompt

## 项目分析与指导

```
作为专业前端开发工程师，我需要在CRMEB电商系统的uni-app项目中进行开发。请帮我完成以下任务，确保代码与现有系统高度兼容，并遵循最佳实践：

1. 我的项目是基于uni-app框架的CRMEB电商系统，版本5.6.0
2. 项目使用Vue 2作为前端框架，支持H5、小程序和App多端
3. 我需要在保持现有代码结构和风格的前提下进行开发
4. 我需要确保对原有功能进行最小改动，避免引入新的缺陷或连锁反应
5. 我需要注意与后端接口的一致性，确保数据交互正常
6. 我需要遵循项目现有的组件封装和API调用模式

具体需求：
[在这里描述您的具体开发需求]

请提供符合以下要求的代码实现或解决方案：
1. 与现有代码风格和架构保持一致
2. 考虑多端兼容性，尤其关注H5和小程序的差异
3. 优化性能并遵循uni-app的最佳实践
4. 确保与现有组件和API的无缝集成
5. 提供清晰的注释和必要的说明
```

## 常见开发场景模板

### 1. 新增页面开发

```
我需要在CRMEB uni-app项目中新增一个[页面名称]页面，要求如下：

1. 页面路径应为：pages/[路径]/[文件名]
2. 页面需要包含以下功能：
   - [功能1]
   - [功能2]
   - [功能3]
3. 页面需要与后端API交互，获取和提交数据
4. 页面样式应与现有系统设计风格保持一致
5. 需要考虑H5和小程序的兼容性差异

请提供完整的实现方案，包括：
- pages.json的路由配置
- 页面组件代码
- API调用代码
- 样式实现方案
```

### 2. 组件开发与优化

```
我需要开发/优化CRMEB uni-app项目中的[组件名称]组件，要求如下：

1. 组件应符合项目现有的组件设计模式
2. 组件需要提供以下功能/API：
   - [功能/API 1]
   - [功能/API 2]
3. 组件应考虑性能优化和复用性
4. 需要处理以下边缘情况：
   - [边缘情况1]
   - [边缘情况2]
5. 组件需要支持多端适配

请提供完整的组件实现代码，包括：
- 组件结构
- 组件逻辑
- props和events定义
- 样式处理方案
```

### 3. 性能优化

```
我需要对CRMEB uni-app项目中的[页面/组件/功能]进行性能优化，当前存在的问题是：

1. [问题描述1]
2. [问题描述2]

请分析可能的性能瓶颈并提供优化方案，包括：
1. 资源加载优化
2. 渲染性能优化
3. JavaScript执行效率优化
4. 数据处理优化
5. 网络请求优化

优化方案需要考虑多端兼容性，并且不影响现有功能的稳定性。
```

### 4. API集成

```
我需要在CRMEB uni-app项目中集成以下后端API：

API名称：[API名称]
请求方法：[GET/POST/PUT/DELETE]
接口路径：[接口路径]
请求参数：[参数列表]
返回数据格式：[返回数据结构]

请提供完整的API调用代码，包括：
1. 在api目录下添加/修改相应的接口函数
2. 处理请求参数和响应数据
3. 错误处理和异常情况
4. 与页面/组件的集成示例
```

### 5. 多端兼容性处理

```
我在CRMEB uni-app项目的[页面/组件/功能]中遇到了多端兼容性问题：

1. 在[平台A]上表现为：[问题描述]
2. 在[平台B]上表现为：[问题描述]

请提供兼容性解决方案，包括：
1. 条件编译处理
2. API差异适配
3. 样式兼容方案
4. 功能降级策略
5. 测试验证方法
```

## 代码片段模板

### 页面基本结构

```vue
<template>
  <view class="page-container">
    <view class="header">
      <!-- 页面标题区域 -->
    </view>
    
    <view class="content">
      <!-- 页面主要内容 -->
    </view>
    
    <view class="footer">
      <!-- 页面底部区域 -->
    </view>
  </view>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      // 页面数据
    };
  },
  computed: {
    ...mapGetters(['isLogin'])
  },
  onLoad(options) {
    // 页面加载时执行
  },
  onShow() {
    // 页面显示时执行
  },
  methods: {
    // 页面方法
  }
};
</script>

<style lang="scss" scoped>
.page-container {
  /* 页面样式 */
}
</style>
```

### API调用模板

```javascript
import request from '@/utils/request';

/**
 * 获取数据列表
 * @param {Object} params - 请求参数
 */
export function getDataList(params) {
  return request.get('/api/path', params);
}

/**
 * 提交数据
 * @param {Object} data - 提交的数据
 */
export function submitData(data) {
  return request.post('/api/path', data);
}
```

### 组件基本结构

```vue
<template>
  <view class="component-container">
    <!-- 组件内容 -->
  </view>
</template>

<script>
export default {
  name: 'ComponentName',
  props: {
    // 组件属性
  },
  data() {
    return {
      // 组件数据
    };
  },
  methods: {
    // 组件方法
  },
  // 生命周期
  mounted() {
    // 组件挂载后执行
  }
};
</script>

<style lang="scss" scoped>
.component-container {
  /* 组件样式 */
}
</style>
```

## 最佳实践提示

1. **代码风格与一致性**
   - 遵循项目现有的命名规范和代码组织结构
   - 使用现有的工具函数和辅助方法，避免重复实现
   - 保持样式命名一致，复用现有样式变量

2. **性能优化**
   - 合理使用uni-app的条件编译处理多端差异
   - 大型列表考虑虚拟滚动或分页加载
   - 合理使用缓存机制减少请求
   - 组件按需引入，避免全局注册所有组件

3. **多端兼容**
   - 使用rpx进行响应式布局
   - 关注平台差异，尤其是API可用性差异
   - 优先使用uni-app官方API代替原生API
   - 编写代码时考虑降级方案

4. **调试与测试**
   - 使用console.log进行调试时，确保发布前移除
   - 针对复杂逻辑编写注释说明
   - 修改功能后进行全面测试，确保不影响其他功能
   - 在多个终端上验证功能，不仅仅在开发环境 --tags CRMEB uni-app 前端开发 prompt 模板
--tags #最佳实践 #工具使用 #评分:8 #有效期:长期
- END

