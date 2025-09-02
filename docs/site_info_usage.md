# 全局站点信息使用指南

## 简介

为了提高性能并避免重复加载站点信息，我们实现了站点信息的全局存储机制。站点信息包括站点名称、位置、配送时间等数据，这些数据一般不会频繁变更，因此适合全局存储。

系统会自动从 API 获取社区信息并更新到全局站点信息中，确保数据的准确性。此外，商品详情中的收货时间信息也会自动更新到全局站点信息中。

## 数据结构

全局站点信息包含以下字段：

```js
{
  name: '', // 站点名称/收货人姓名
  location: '', // 站点位置/详细地址
  deliveryTime: '', // 配送时间，来自商品详情的receiving_time_text或格式化的receiving_time
  type: '', // 站点类型，如"站点自提"
  community: {}, // 完整的社区信息对象（仅当从API获取成功时存在）
  lastUpdated: 1689123456789 // 最后更新时间戳
}
```

当从 API 获取社区信息成功时，`community` 字段会包含完整的社区信息：

```js
community: {
  id: 5, // 社区ID
  name: "阳光花园站点B", // 社区名称
  province: "广东省", // 省份
  city: "深圳市", // 城市
  district: "南山区", // 区域
  address: "科技园南区阳光花园", // 地址
  full_address: "广东省深圳市南山区科技园南区阳光花园", // 完整地址
  longitude: "113.9235", // 经度
  latitude: "22.5431", // 纬度
  image: "/uploads/attach/community.jpg" // 社区图片
}
```

## 访问方式

### 方式一：通过 Vuex store 访问（推荐）

在组件中使用 mapGetters 访问：

```js
import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters(['siteInfo'])
  },
  methods: {
    doSomething() {
      console.log(this.siteInfo.location); // 访问站点位置
      console.log(this.siteInfo.deliveryTime); // 访问配送时间
      
      // 如果需要访问完整社区信息
      if (this.siteInfo.community) {
        console.log(this.siteInfo.community.longitude); // 访问经度
        console.log(this.siteInfo.community.latitude); // 访问纬度
      }
    }
  }
}
```

在模板中直接使用：

```html
<view class="address-detail">{{ siteInfo.location }}</view>
```

### 方式二：通过 App globalData 访问

在任何页面或组件中可以通过 getApp() 访问：

```js
const app = getApp();
const siteInfo = app.globalData.siteInfo;
console.log(siteInfo.location);
```

### 方式三：通过缓存访问

直接使用 Cache 工具类访问：

```js
import Cache from '@/utils/cache';
import { SITE_INFO } from '@/config/cache';

const siteInfo = Cache.get(SITE_INFO);
```

## 修改站点信息

要更新全局站点信息，建议使用 Vuex action：

```js
// 更新站点信息
this.$store.dispatch('SET_SITEINFO', {
  name: '新站点名称',
  location: '新地址',
  deliveryTime: '新配送时间',
  type: '新站点类型'
});
```

## 数据加载流程

系统会按照以下流程加载站点信息：

1. 应用启动时，首先尝试从缓存加载站点信息
2. 如果缓存中没有，则设置默认值
3. 如果用户已登录，尝试从 API 获取社区信息（`/api/group/community/my_info`）
4. 如果 API 请求成功，使用返回的社区信息更新站点信息，同时保留现有的配送时间信息
5. 当用户登录状态变化时（登录成功），会自动重新获取社区信息
6. 加载商品详情时，如果有收货时间信息（`receiving_time_text` 或 `receiving_time`），会自动更新到全局站点信息中

## 商品收货时间

商品详情 API（如 `/api/group/combination/detail/20`）会返回收货时间信息：

```js
{
  "receiving_time": 1753985716, // 时间戳格式的收货时间
  "receiving_time_text": "2025-08-01", // 格式化的收货时间文本
}
```

系统会自动处理这些信息：

1. 优先使用 `receiving_time_text` 字段（如果存在）
2. 如果没有文本格式，则使用 `receiving_time` 时间戳并格式化
3. 将格式化后的时间更新到全局站点信息的 `deliveryTime` 字段

## 最佳实践

1. 优先使用 Vuex 方式访问站点信息，这样能够确保响应式更新
2. 站点信息不应频繁修改，一般只在首次设置或特定场景下更新
3. 在页面初始化时，检查站点信息是否已设置，如果未设置则初始化默认值
4. 需要使用社区的地理位置信息时，可以通过 `siteInfo.community` 获取经纬度等详细信息
5. 创建订单时，如果有社区ID，应该将其添加到订单数据中

## 示例

在 pages/goods/order_confirm/new_order_confirm.vue 中，我们使用了全局站点信息：

```html
<view class="address-box">
  <view class="address-tag">{{ siteInfo.type || '站点自提' }}</view>
  <view class="address-content">
    <view class="user-info"><text class="user-name">收货人：</text>{{ userInfo.nickname || '未登录' }}</view>
    <view class="address-detail"><text class="address-text">收货地址：</text>{{ siteInfo.location || '北京尚德井小区菜鸟驿站' }}</view>
    <view class="delivery-time"><text class="time-text">送货时间：</text>{{ siteInfo.deliveryTime || '今日8：00前送达' }}</view>
  </view>
</view>
```

初始化站点信息的方法：

```js
initSiteInfo() {
  // 如果全局站点信息为空，则设置默认站点信息
  if (!this.siteInfo.name || !this.siteInfo.location) {
    const defaultSiteInfo = {
      name: this.userInfo.nickname || 'Eetin',
      location: '北京尚德井小区菜鸟驿站',
      deliveryTime: '今日8：00前送达',
      type: '站点自提'
    };
    
    // 存储到全局
    this.$store.dispatch('SET_SITEINFO', defaultSiteInfo);
  }
}
```

创建订单时使用社区ID：

```js
async createOrder() {
  // ... 其他代码 ...
  
  // 构建订单数据
  const orderData = {
    combination_id: this.combination_id,
    quantity: this.goods.quantity,
    user_coupon_ids: this.selectedCoupons.join(','),
    remark: this.remark
  };
  
  // 如果有社区信息，添加社区ID
  if (this.siteInfo.community && this.siteInfo.community.id) {
    orderData.community_id = this.siteInfo.community.id;
  }
  
  // 调用创建订单API
  const response = await createGroupOrder(orderData);
  
  // ... 其他代码 ...
}
``` 