<template>
  <view class="select-page">
    <!-- 顶部导航栏 -->
    <view class="header">
      <view class="back-btn" @click="goBack">
        <text class="iconfont icon-fanhui"></text>
      </view>
      <view class="title">添加站点</view>
      <view class="right-placeholder"></view>
    </view>
    
    <!-- 收货姓名输入 -->
    <view class="input-section">
      <view class="input-label">收货姓名：</view>
      <input class="input-field" type="text" placeholder="收货人姓名" v-model="form.name" />
    </view>
    
    <!-- 配送地址选择 -->
    <view class="delivery-section">
      <view class="delivery-title">配送至</view>
      <view class="region-selector">
        <view class="region-item" @click="selectProvince">{{ selectedRegion.province || '省' }}</view>
        <view class="region-item" @click="selectCity">{{ selectedRegion.city || '市' }}</view>
        <view class="region-item active" @click="selectDistrict">{{ selectedRegion.district || '区' }}</view>
        <view class="region-item highlight">{{ selectedRegion.street || '街道' }}</view>
        <view class="region-item">站点</view>
      </view>
      
      <!-- 街道列表 -->
      <scroll-view class="street-list" scroll-y>
        <view 
          class="street-item" 
          v-for="(item, index) in streetList" 
          :key="index"
          :class="{'active': selectedStreet === item}"
          @click="selectStreet(item)"
        >
          {{ item }}
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      form: {
        name: '',
        phone: '',
      },
      sourceFrom: '', // 来源页面：'add'或'edit'
      selectedRegion: {
        province: '北京',
        city: '朝阳区',
        district: '社区街道',
        street: '',
      },
      selectedStreet: '',
      streetList: [
        '安贞街道',
        '奥运村街道',
        '八里庄街道',
        '常营街道',
        '朝外街道',
        '崔各庄地区',
        '大屯街道',
        '东坝地区',
        '东风地区',
        '东湖街道',
        '豆各庄街道',
        '高碑店地区',
        '和平街街道'
      ],
      errors: {
        name: '',
        phone: ''
      }
    };
  },
  onLoad(options) {
    // 获取来源页面，用于返回时传递数据
    if (options.from) {
      this.sourceFrom = options.from;
    }
    
    // 如果有预设的地区数据，加载它们
    if (options.province) {
      this.selectedRegion.province = decodeURIComponent(options.province);
    }
    if (options.city) {
      this.selectedRegion.city = decodeURIComponent(options.city);
    }
    if (options.district) {
      this.selectedRegion.district = decodeURIComponent(options.district);
    }
  },
  methods: {
    goBack() {
      uni.navigateBack();
    },
    validateField(field) {
      // 重置错误
      this.errors[field] = '';
      
      // 验证必填字段
      switch(field) {
        case 'name':
          if (!this.form.name.trim()) {
            this.errors.name = '请输入收货人姓名';
            return false;
          }
          break;
        case 'phone':
          if (this.form.phone && !/^1[3-9]\d{9}$/.test(this.form.phone)) {
            this.errors.phone = '请输入有效的手机号码';
            return false;
          }
          break;
      }
      
      return true;
    },
    selectProvince() {
      // 省份选择逻辑，可以打开选择器
      uni.showToast({
        title: '省份选择功能开发中',
        icon: 'none'
      });
    },
    selectCity() {
      // 城市选择逻辑
      uni.showToast({
        title: '城市选择功能开发中',
        icon: 'none'
      });
    },
    selectDistrict() {
      // 区域选择逻辑
      uni.showToast({
        title: '区域选择功能开发中',
        icon: 'none'
      });
    },
    selectStreet(street) {
      this.selectedStreet = street;
      this.selectedRegion.street = street;
      
      // 验证收货人姓名
      this.validateField('name');
      
      if (!this.form.name.trim()) {
        uni.showToast({
          title: '请输入收货人姓名',
          icon: 'none'
        });
        return;
      }
      
      // 选择完街道后，根据来源页面决定下一步操作
      setTimeout(() => {
        if (this.sourceFrom === 'add' || this.sourceFrom === 'edit') {
          // 如果是从添加/编辑页面来，返回并传递选择的地区信息
          const pages = getCurrentPages();
          const prevPage = pages[pages.length - 2];
          
          // 参数传递方式一：直接修改上一页数据（不推荐，仅在特殊场景使用）
          if (prevPage && prevPage.$vm) {
            prevPage.$vm.form.province = this.selectedRegion.province;
            prevPage.$vm.form.city = this.selectedRegion.city;
            prevPage.$vm.form.district = this.selectedRegion.district;
          }
          
          // 参数传递方式二：通过url参数传递
          const url = `../${this.sourceFrom}?province=${encodeURIComponent(this.selectedRegion.province)}&city=${encodeURIComponent(this.selectedRegion.city)}&district=${encodeURIComponent(this.selectedRegion.district)}`;
          
          uni.navigateTo({
            url: url
          });
        } else {
          // 默认跳转到站点列表
          uni.navigateTo({
            url: `./site_list?street=${encodeURIComponent(street)}&province=${encodeURIComponent(this.selectedRegion.province)}&city=${encodeURIComponent(this.selectedRegion.city)}&district=${encodeURIComponent(this.selectedRegion.district)}`
          });
        }
      }, 300);
    }
  }
};
</script>

<style lang="scss" scoped>
.select-page {
  background-color: #FFFFFF;
  min-height: 100vh;
}

/* 顶部导航栏 */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 88rpx;
  padding: 0 30rpx;
  background-color: #FFFFFF;
  border-bottom: 1px solid #F5F5F5;
  
  .back-btn {
    width: 44rpx;
    height: 44rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    
    .iconfont {
      font-size: 36rpx;
      color: #333333;
    }
  }
  
  .title {
    font-size: 36rpx;
    font-weight: 500;
    color: #333333;
  }
  
  .right-placeholder {
    width: 44rpx;
  }
}

/* 输入区域 */
.input-section {
  display: flex;
  align-items: center;
  padding: 30rpx;
  border-bottom: 1rpx solid #EEEEEE;
  
  .input-label {
    font-size: 28rpx;
    color: #333333;
    width: 180rpx;
  }
  
  .input-field {
    flex: 1;
    height: 60rpx;
    font-size: 28rpx;
  }
}

/* 配送区域 */
.delivery-section {
  padding: 30rpx;
  
  .delivery-title {
    font-size: 32rpx;
    font-weight: 500;
    color: #333333;
    margin-bottom: 30rpx;
    text-align: center;
  }
  
  .region-selector {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 40rpx;
    
    .region-item {
      padding: 10rpx 20rpx;
      font-size: 28rpx;
      color: #666666;
      position: relative;
      
      &.active {
        color: #333333;
        font-weight: 500;
      }
      
      &.highlight {
        color: #FF6C00;
        font-weight: 500;
      }
      
      &:not(:last-child)::after {
        content: '';
        position: absolute;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 1rpx;
        height: 28rpx;
        background-color: #DDDDDD;
      }
    }
  }
  
  .street-list {
    height: calc(100vh - 300rpx);
    
    .street-item {
      padding: 30rpx 0;
      font-size: 28rpx;
      color: #333333;
      border-bottom: 1rpx solid #F5F5F5;
      
      &.active {
        color: #FF6C00;
      }
    }
  }
}
</style>
