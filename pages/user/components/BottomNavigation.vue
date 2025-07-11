<template>
  <view class="bottom-navigation">
    <view 
      v-for="(item, index) in navItems" 
      :key="index" 
      class="nav-item" 
      :class="{ active: activeTab === item.name }"
      @click="onNavItemClick(item.name)"
    >
      <image class="nav-icon" :src="activeTab === item.name ? item.activeIcon : item.icon" />
      <text class="nav-label">{{ item.label }}</text>
    </view>
  </view>
</template>

<script>
export default {
  name: 'BottomNavigation',
  props: {
    activeTab: {
      type: String,
      default: 'profile'
    }
  },
  data() {
    return {
      navItems: [
        {
          name: 'home',
          label: '首页',
          icon: '/static/images/tabbar/home.png',
          activeIcon: '/static/images/tabbar/home_active.png'
        },
        {
          name: 'category',
          label: '分类',
          icon: '/static/images/tabbar/category.png',
          activeIcon: '/static/images/tabbar/category_active.png'
        },
        {
          name: 'cart',
          label: '购物车',
          icon: '/static/images/tabbar/cart.png',
          activeIcon: '/static/images/tabbar/cart_active.png'
        },
        {
          name: 'profile',
          label: '我的',
          icon: '/static/images/tabbar/profile.png',
          activeIcon: '/static/images/tabbar/profile_active.png'
        }
      ]
    };
  },
  methods: {
    onNavItemClick(name) {
      if (name === this.activeTab) return;
      this.$emit('tab-change', name);
      
      // 根据选项卡名称进行页面跳转
      const routes = {
        home: '/pages/index/index',
        category: '/pages/goods_category/index',
        cart: '/pages/cart/index',
        profile: '/pages/user/index'
      };
      
      if (routes[name]) {
        uni.switchTab({
          url: routes[name]
        });
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.bottom-navigation {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100rpx;
  background-color: #FFFFFF;
  display: flex;
  justify-content: space-around;
  align-items: center;
  border-top: 1rpx solid #E0E0E0;
  z-index: 100;
  padding-bottom: env(safe-area-inset-bottom);
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  height: 100%;
}

.nav-icon {
  width: 40rpx;
  height: 40rpx;
  margin-bottom: 10rpx;
}

.nav-label {
  font-family: 'PingFang SC', sans-serif;
  font-weight: 400;
  font-size: 22rpx;
  line-height: 31rpx;
  color: #4D4D4D;
}

.nav-item.active .nav-label {
  color: #FF840B;
}
</style>
