<template>
  <view class="site-list-page">
    <!-- 顶部导航栏 -->
    <view class="header">
      <view class="back-btn" @click="goBack">
        <text class="iconfont icon-fanhui"></text>
      </view>
      <view class="title">站点</view>
      <view class="right-btn" @click="toggleSelectMode">{{ isSelectMode ? '完成' : '选择' }}</view>
    </view>

    <!-- 我的站点 -->
    <view class="section" v-if="myCommunity">
      <view class="section-title">我的站点</view>
      <view class="site-card" @click="viewSiteDetail(myCommunity)">
        <image class="site-logo" src="/static/images/today-group-buying/site-logo.png" />
        <view class="site-row">
          <view class="site-name">{{ myCommunity.name }}</view>
          <view class="site-right">
            <view class="site-status current">当前取货点</view>
            <image class="location-icon" src="/static/images/location_icon.svg" />
            <view class="site-distance">{{ myCommunity.distance || '100m' }}</view>
          </view>
        </view>
      </view>
    </view>

    <!-- 其他站点 -->
    <view class="section" v-if="nearbyCommunities.length > 0">
      <view class="section-title">其他站点</view>
      <view class="site-card" v-for="(item, index) in nearbyCommunities" :key="item.id" @click="selectSite(item)">
        <view v-if="isSelectMode" class="radio-circle" :class="{selected: selectedCommunityId === item.id}"></view>
        <image class="site-logo" src="/static/images/today-group-buying/site-logo.png" />
        <view class="site-row">
          <view class="site-name">{{ item.name }}</view>
          <view class="site-right">
            <view class="site-status">附近取货点</view>
            <image class="location-icon" src="/static/images/location_icon.svg" />
            <view class="site-distance">{{ item.distance || '未知' }}</view>
          </view>
        </view>
      </view>
    </view>

    <!-- 加载中 -->
    <view class="loading-section" v-if="isLoading">
      <text class="loading-text">加载中...</text>
    </view>

    <!-- 空状态 -->
    <view class="empty-section" v-if="!isLoading && nearbyCommunities.length === 0">
      <text class="empty-text">暂无可用站点</text>
    </view>

    <!-- 底部进入站点按钮，仅在选择模式下显示 -->
    <view v-if="isSelectMode" class="footer-btn-safe">
      <button class="enter-btn" @click="onEnterSite">进入站点</button>
    </view>
  </view>
</template>

<script>
import { checkLogin } from '@/libs/login';
import { HTTP_REQUEST_URL } from '@/config/app';
import store from '@/store';

export default {
  data() {
    return {
      isSelectMode: false,
      isLoading: true,
      myCommunity: null,
      nearbyCommunities: [],
      selectedCommunityId: null,
      location: {
        longitude: '',
        latitude: ''
      }
    };
  },
  onLoad() {
    // 检查登录状态
    if (checkLogin()) {
      // 先获取我的社区信息
      this.getMyCommunity();
      
      // 直接尝试获取社区列表，不依赖于位置信息
      this.loadCommunityData();
    } else {
      uni.showToast({
        title: '请先登录',
        icon: 'none',
        duration: 2000
      });
    }
  },
  
  methods: {
    // 加载社区数据的主函数
    loadCommunityData() {
      // 先尝试获取位置并加载附近社区
      this.getLocation();
      
      // 设置一个定时器，如果3秒内位置获取和附近社区API没有成功，则调用社区列表API
      setTimeout(() => {
        if (this.isLoading && this.nearbyCommunities.length === 0) {
          console.log('位置获取超时或附近没有社区，加载所有社区列表');
          this.getCommunityList();
        }
      }, 3000);
    },
    
    goBack() {
      uni.navigateBack();
    },
    
    toggleSelectMode() {
      this.isSelectMode = !this.isSelectMode;
      if (this.isSelectMode) {
        // 进入选择模式时默认选中第一个其他站点
        if (this.nearbyCommunities.length > 0) {
          this.selectedCommunityId = this.nearbyCommunities[0].id;
        }
      } 
      // 移除退出选择模式时绑定站点的逻辑
      // else if (this.selectedCommunityId) {
      //   // 退出选择模式时，如果有选中的站点，则绑定该站点
      //   this.bindCommunity(this.selectedCommunityId);
      // }
    },
    selectSite(community) {
      if (this.isSelectMode) {
        this.selectedCommunityId = community.id;
      } else {
        this.viewSiteDetail(community);
      }
    },
    viewSiteDetail(community) {
      // 查看站点详情的逻辑
      console.log('查看站点详情:', community);
    },
    onEnterSite() {
      // 进入站点的逻辑，比如跳转到站点详情页或首页
      if (!this.selectedCommunityId) {
        uni.showToast({ title: '请选择站点', icon: 'none' });
        return;
      }
      
      // 找到选中的社区对象
      const selectedCommunity = this.nearbyCommunities.find(item => item.id === this.selectedCommunityId);
      if (!selectedCommunity) {
        uni.showToast({ title: '站点信息不存在', icon: 'none' });
        return;
      }
      
      // 这里根据业务需求跳转到对应站点页面
      console.log('进入站点:', selectedCommunity);
      
      // 例如：跳转到首页并传递站点信息
      uni.navigateTo({
        url: `/pages/index/index?site_id=${selectedCommunity.id}&site_name=${encodeURIComponent(selectedCommunity.name)}`,
        fail: (err) => {
          console.error('跳转失败:', err);
          // 如果跳转失败，尝试使用reLaunch
          uni.reLaunch({
            url: `/pages/index/index?site_id=${selectedCommunity.id}&site_name=${encodeURIComponent(selectedCommunity.name)}`
          });
        }
      });
    },
    
    // 获取位置信息
    getLocation() {
      this.isLoading = true;
      uni.getLocation({
        type: 'gcj02',
        success: (res) => {
          console.log('位置获取成功:', res);
          this.location.longitude = res.longitude;
          this.location.latitude = res.latitude;
          this.getNearByCommunities();
        },
        fail: (err) => {
          console.error('获取位置失败:', err);
          // 如果获取位置失败，则获取社区列表
          this.getCommunityList();
        }
      });
    },
    
    // 获取社区列表
    getCommunityList() {
      console.log('开始获取社区列表');
      this.isLoading = true;
      
      const params = {
        page: 1,
        limit: 20
      };
      
      this.request('GET', 'group/community/list', params, res => {
        this.isLoading = false;
        console.log('社区列表API返回:', res);
        
        if (res.data && res.data.list) {
          // 过滤掉已经是我的社区的项目
          if (this.myCommunity) {
            this.nearbyCommunities = res.data.list.filter(item => item.id !== this.myCommunity.id);
          } else {
            this.nearbyCommunities = res.data.list;
          }
          
          // 如果是选择模式，默认选中第一个
          if (this.isSelectMode && this.nearbyCommunities.length > 0) {
            this.selectedCommunityId = this.nearbyCommunities[0].id;
          }
        }
      }, () => {
        this.isLoading = false;
        console.error('获取社区列表失败');
        uni.showToast({
          title: '获取站点列表失败',
          icon: 'none',
          duration: 2000
        });
      });
    },
    
    // 获取我的社区信息
    getMyCommunity() {
      this.request('GET', 'group/community/my_info', {}, res => {
        if (res.data && res.data.is_bind) {
          this.myCommunity = res.data.community;
        }
      });
    },
    
    // 获取附近社区
    getNearByCommunities() {
      console.log('开始获取附近社区');
      const params = {
        limit: 10
      };
      
      // 如果有位置信息，添加到请求参数
      if (this.location.longitude && this.location.latitude) {
        params.longitude = this.location.longitude;
        params.latitude = this.location.latitude;
      } else {
        // 如果没有位置信息，直接获取社区列表
        this.getCommunityList();
        return;
      }
      
      this.request('GET', 'group/community/nearby', params, res => {
        this.isLoading = false;
        console.log('附近社区API返回:', res);
        
        // 过滤掉已经是我的社区的项目
        if (this.myCommunity) {
          this.nearbyCommunities = res.data.filter(item => item.id !== this.myCommunity.id);
        } else {
          this.nearbyCommunities = res.data;
        }
        
        // 如果是选择模式，默认选中第一个
        if (this.isSelectMode && this.nearbyCommunities.length > 0) {
          this.selectedCommunityId = this.nearbyCommunities[0].id;
        }
        
        // 如果附近没有站点，则获取社区列表
        if (this.nearbyCommunities.length === 0) {
          console.log('附近没有社区，获取所有社区列表');
          this.getCommunityList();
        }
      }, () => {
        console.error('获取附近社区失败');
        this.isLoading = false;
        // 如果获取附近站点失败，则获取社区列表
        this.getCommunityList();
      });
    },
    // 注释掉或移除bindCommunity方法，因为不再需要
    // bindCommunity(communityId) {
    //   uni.showLoading({
    //     title: '正在设置...'
    //   });
    //   
    //   this.request('POST', 'group/community/bind', {
    //     community_id: communityId
    //   }, res => {
    //     uni.hideLoading();
    //     // 移除成功提示
    //     // uni.showToast({
    //     //   title: '设置成功',
    //     //   icon: 'success'
    //     // });
    //     // 重新获取我的社区信息
    //     this.getMyCommunity();
    //     // 返回上一页或刷新页面
    //     setTimeout(() => {
    //       uni.navigateBack();
    //     }, 500); // 减少延迟时间
    //   }, () => {
    //     uni.hideLoading();
    //   });
    // },
    // 统一请求方法
    request(method, url, data, successCallback, failCallback) {
      const token = store.state.app.token;
      uni.request({
        url: `${HTTP_REQUEST_URL}/api/${url}`,
        method: method,
        data: data,
        header: {
          'Authorization': token ? `Bearer ${token}` : ''
        },
        success: (res) => {
          if (res.data && res.data.status === 200) {
            successCallback && successCallback(res.data);
          } else if ([110002, 110003, 110004].indexOf(res.data.status) !== -1) {
            // 登录状态失效
            uni.showToast({
              title: '登录已过期，请重新登录',
              icon: 'none',
              duration: 2000
            });
          } else {
            uni.showToast({
              title: res.data?.msg || '请求失败',
              icon: 'none',
              duration: 2000
            });
            failCallback && failCallback(res.data);
          }
        },
        fail: (err) => {
          console.error('请求失败:', err);
          uni.showToast({
            title: '网络请求失败',
            icon: 'none',
            duration: 2000
          });
          failCallback && failCallback(err);
        }
      });
    }
  },
};
</script>

<style scoped>
.site-list-page {
  background: #f5f5f5;
  min-height: 100vh;
  padding: 0 0 20px 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;
  height: 44px;
  background: #fff;
  border-bottom: 1px solid #eee;
}
.back-btn {
  width: 40px;
  display: flex;
  align-items: center;
}
.title {
  font-size: 18px;
  font-weight: bold;
}
.right-btn {
  width: 40px;
  text-align: right;
  color: #666;
  font-size: 16px;
}
.section {
  margin-top: 18px;
  padding: 0 16px;
}
.section-title {
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 10px;
  color: #232323;
  padding-left: 4px;
}
.site-card {
  display: flex;
  align-items: center;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.03);
  padding: 12px 16px;
  margin-bottom: 12px;
  cursor: pointer;
}
.radio-circle {
  width: 22px;
  height: 22px;
  border: 1.5px solid #FF840B;
  border-radius: 50%;
  margin-right: 12px;
  box-sizing: border-box;
  background: #fff;
  position: relative;
  flex-shrink: 0;
}
.radio-circle.selected {
  background: #FF840B;
  border-color: #FF840B;
}
/* 移除选中状态的白色中心点 */
.radio-circle.selected::after {
  display: none;
}
.site-logo {
  width: 36px;
  height: 36px;
  border-radius: 6px;
  margin-right: 12px;
  flex-shrink: 0;
}
.site-row {
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: space-between;
}
.site-name {
  font-size: 15px;
  color: #232323;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 40vw;
}
.site-right {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}
.site-status {
  font-size: 12px;
  color: #999;
  background: #f5f5f5;
  border-radius: 4px;
  padding: 2px 6px;
  margin-right: 2px;
}
.site-status.current {
  color: #4A6BFE;
  background: #eaf0ff;
}
.location-icon {
  width: 14px;
  height: 14px;
  margin-right: 2px;
}
.site-distance {
  font-size: 12px;
  color: #999;
}
.loading-section, .empty-section {
  display: flex;
  justify-content: center;
  padding: 30px 0;
}
.loading-text, .empty-text {
  font-size: 14px;
  color: #999;
}
.footer-btn-safe {
  position: fixed;
  left: 0;
  right: 0;
  bottom: env(safe-area-inset-bottom, 0);
  padding: 0 24px 24px 24px;
  background: transparent;
  z-index: 100;
  display: flex;
  justify-content: center;
}
.enter-btn {
  width: 100%;
  max-width: 320px;
  height: 44px;
  background: #FF840B;
  color: #fff;
  font-size: 16px;
  border: none;
  border-radius: 24px;
  text-align: center;
  line-height: 44px;
  box-shadow: 0 2px 8px rgba(255,132,11,0.08);
  margin: 0 auto;
  font-weight: 500;
}
.enter-btn:active {
  opacity: 0.85;
}
</style> 