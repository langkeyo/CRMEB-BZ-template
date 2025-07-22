<template>
  <view class="add-page">
    <!-- 使用通用头部导航组件 -->
    <CommonHeader
      title="添加站点"
      rightText="保存"
      @back="goBack"
      @rightClick="saveSite">
    </CommonHeader>
    
    <!-- 表单内容 -->
    <view class="form-content">
      <!-- 收货姓名 -->
      <view class="form-item" id="nameInput">
        <view class="form-label required">收货姓名</view>
        <input 
          class="form-input" 
          type="text" 
          v-model="form.contactName"
          placeholder="请输入收货人姓名"
          @blur="validateField('contactName')"
        />
        <view class="error-tip" v-if="errors.contactName">{{ errors.contactName }}</view>
      </view>
      
      <!-- 地区选择 -->
      <view class="form-item">
        <view class="form-label required">所在地区</view>
        <view class="form-input location-picker" @click="selectLocation">
          <text v-if="form.province && form.city && form.district">{{ form.province + ' ' + form.city + ' ' + form.district }}</text>
          <text v-else class="placeholder">请选择所在地区</text>
          <text class="iconfont icon-right"></text>
        </view>
        <view class="error-tip" v-if="errors.location">{{ errors.location }}</view>
      </view>
      
      <!-- 详细地址 -->
      <view class="form-item">
        <view class="form-label required">详细地址</view>
        <input 
          class="form-input" 
          type="text" 
          v-model="form.address"
          placeholder="请输入详细地址"
          @blur="validateField('address')"
        />
        <view class="error-tip" v-if="errors.address">{{ errors.address }}</view>
      </view>
      
      <!-- 楼栋信息 -->
      <view class="form-item">
        <view class="form-label required">楼栋信息</view>
        <input 
          class="form-input" 
          type="text" 
          v-model="form.building"
          placeholder="如：1号楼2单元303室"
          @blur="validateField('building')"
        />
        <view class="error-tip" v-if="errors.building">{{ errors.building }}</view>
      </view>
      
      <!-- 手机号码 -->
      <view class="form-item">
        <view class="form-label required">手机号码</view>
        <input 
          class="form-input" 
          type="number" 
          v-model="form.contactPhone"
          placeholder="请输入手机号码"
          maxlength="11"
          @blur="validateField('contactPhone')"
        />
        <view class="error-tip" v-if="errors.contactPhone">{{ errors.contactPhone }}</view>
      </view>
      
      <!-- 设为默认 -->
      <view class="form-item switch-item">
        <view class="form-label">设为默认站点</view>
        <switch 
          color="#FF6C00" 
          :checked="form.isDefault" 
          @change="switchDefaultChange"
        />
      </view>
    </view>
    <SelectPopup v-if="showSelectPopup" :top="popupTop" @close="showSelectPopup=false">
      <!-- 配送地址选择 -->
      <view class="delivery-section">
        <view class="delivery-title">配送至</view>
        <view class="region-selector">
          <view class="region-item" :class="{'active': currentStep === 'province'}" @click="switchStep('province')">{{ form.province || '北京' }}</view>
          <view class="region-item" :class="{'active': currentStep === 'city'}" @click="switchStep('city')">{{ form.city || '朝阳区' }}</view>
          <view class="region-item" :class="{'active': currentStep === 'district'}" @click="switchStep('district')">{{ form.district || '安贞街道' }}</view>
          <view class="region-item" :class="{'active': currentStep === 'street'}" @click="switchStep('street')">街道</view>
          <view class="region-item" :class="{'active': currentStep === 'site'}" @click="switchStep('site')">站点</view>
        </view>
        
        <!-- 街道列表 -->
        <scroll-view class="street-list" scroll-y>
          <view 
            class="street-item" 
            v-for="(item, index) in currentList" 
            :key="index"
            :class="{'active': getIsActive(item)}"
            @click="selectItem(item)"
          >
            {{ item }}
          </view>
        </scroll-view>
      </view>
    </SelectPopup>
  </view>
</template>

<script>
import SelectPopup from '@/components/select-popup.vue';
import CommonHeader from '@/components/CommonHeader/index.vue';

export default {
  components: {
    SelectPopup,
    CommonHeader
  },
  data() {
    return {
      form: {
        province: '北京',
        city: '朝阳区',
        district: '',
        address: '',
        building: '',
        contactName: '',
        contactPhone: '',
        isDefault: false
      },
      errors: {
        location: '',
        address: '',
        building: '',
        contactName: '',
        contactPhone: ''
      },
      showSelectPopup: false,
      popupTop: 0,
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
      provinceList: ['北京', '天津', '上海', '重庆', '河北', '山西', '辽宁'],
      cityList: ['朝阳区', '海淀区', '东城区', '西城区', '丰台区', '石景山区'],
      currentStep: 'district', // 控制弹窗中的步骤
      selectedStreet: '' // 记录当前选中的街道
    };
  },
  computed: {
    currentList() {
      switch(this.currentStep) {
        case 'province':
          return this.provinceList;
        case 'city':
          return this.cityList;
        case 'district':
        case 'street':
          return this.streetList;
        case 'site':
          return ['暂无站点'];
        default:
          return this.streetList;
      }
    }
  },
  onLoad(options) {
    // 如果从地址选择页面返回，处理选择的地址数据
    if (options.province && options.city && options.district) {
      this.form.province = decodeURIComponent(options.province);
      this.form.city = decodeURIComponent(options.city);
      this.form.district = decodeURIComponent(options.district);
    }
  },
  methods: {
    goBack() {
      uni.navigateBack();
    },
    selectLocation() {
      // 动态获取收货姓名输入框底部
      uni.createSelectorQuery().in(this).select('#nameInput').boundingClientRect(rect => {
        if (rect) {
          this.popupTop = rect.bottom;
          this.showSelectPopup = true;
          this.currentStep = 'district'; // 打开弹窗时默认显示区域选择
          this.selectedStreet = ''; // 清空选中的街道
        } else {
          // 如果获取不到元素，使用默认值
          this.popupTop = 200;
          this.showSelectPopup = true;
          console.log('无法获取nameInput元素位置，使用默认值');
        }
      }).exec();
    },
    // 切换步骤
    switchStep(step) {
      this.currentStep = step;
    },
    // 判断列表项是否激活
    getIsActive(item) {
      switch(this.currentStep) {
        case 'province':
          return this.form.province === item;
        case 'city':
          return this.form.city === item;
        case 'district':
        case 'street':
          return this.selectedStreet === item || this.form.district === item;
        default:
          return false;
      }
    },
    // 选择列表项
    selectItem(item) {
      switch(this.currentStep) {
        case 'province':
          this.form.province = item;
          this.currentStep = 'city';
          break;
        case 'city':
          this.form.city = item;
          this.currentStep = 'district';
          break;
        case 'district':
        case 'street':
          this.selectStreet(item);
          break;
      }
    },
    validateField(field) {
      // 重置错误
      this.errors[field] = '';
      
      // 验证必填字段
      switch (field) {
        case 'location':
          if (!this.form.province || !this.form.city || !this.form.district) {
            this.errors.location = '请选择所在地区';
            return false;
          }
          break;
        case 'address':
          if (!this.form.address.trim()) {
            this.errors.address = '请输入详细地址';
            return false;
          }
          break;
        case 'building':
          if (!this.form.building.trim()) {
            this.errors.building = '请输入楼栋信息';
            return false;
          }
          break;
        case 'contactName':
          if (!this.form.contactName.trim()) {
            this.errors.contactName = '请输入收货人姓名';
            return false;
          }
          break;
        case 'contactPhone':
          if (!this.form.contactPhone) {
            this.errors.contactPhone = '请输入手机号码';
            return false;
          } else if (!/^1[3-9]\d{9}$/.test(this.form.contactPhone)) {
            this.errors.contactPhone = '请输入有效的手机号码';
            return false;
          }
          break;
      }
      
      return true;
    },
    validateForm() {
      // 验证所有字段
      const fields = ['contactName', 'location', 'address', 'building', 'contactPhone'];
      let isValid = true;
      
      fields.forEach(field => {
        // 如果任一字段验证失败，整体验证失败
        if (!this.validateField(field)) {
          isValid = false;
        }
      });
      
      return isValid;
    },
    switchDefaultChange(e) {
      this.form.isDefault = e.detail.value;
    },
    saveSite() {
      // 表单验证
      if (!this.validateForm()) {
        uni.showToast({
          title: '请完善必填信息',
          icon: 'none'
        });
        return;
      }
      
      // 构建站点对象
      const site = {
        id: Date.now(), // 使用时间戳作为ID
        fullAddress: this.form.province + this.form.city + this.form.district + this.form.address,
        building: this.form.building,
        contactName: this.form.contactName,
        contactPhone: this.form.contactPhone,
        isDefault: this.form.isDefault
      };
      
      try {
        // 获取已有站点列表
        let siteList = uni.getStorageSync('SITE_LIST') || '[]';
        siteList = JSON.parse(siteList);
        
        // 添加到列表
        siteList.push(site);
        
        // 如果设为默认，更新其他站点的默认状态
        if (site.isDefault) {
          siteList.forEach(item => {
            if (item.id !== site.id) {
              item.isDefault = false;
            }
          });
          
          // 更新当前站点
          uni.setStorageSync('CURRENT_SITE', JSON.stringify(site));
          uni.setStorageSync('CURRENT_SITE_ID', site.id);
        }
        
        // 保存站点列表
        uni.setStorageSync('SITE_LIST', JSON.stringify(siteList));
        
        uni.showToast({
          title: '站点已添加',
          icon: 'success',
          duration: 1500,
          success: () => {
            // 延迟返回，让用户看到成功提示
            setTimeout(() => {
              uni.navigateBack({
                delta: 1
              });
            }, 1500);
          }
        });
      } catch (e) {
        console.error('保存站点失败', e);
        uni.showToast({
          title: '操作失败，请重试',
          icon: 'none'
        });
      }
    },
    selectStreet(street) {
      this.selectedStreet = street;
      this.form.district = street;
      
      // 确保省市区都有值
      if (!this.form.province) this.form.province = '北京';
      if (!this.form.city) this.form.city = '朝阳区';
      
      // 关闭弹窗
      this.showSelectPopup = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.add-page {
  background-color: #F5F5F5;
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
  position: relative;
  
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
  
  .right-btn {
    font-size: 32rpx;
    color: #FF6C00;
  }
}

/* 表单内容 */
.form-content {
  margin-top: 20rpx;
  background-color: #FFFFFF;
  padding: 0 30rpx;
  
  .form-item {
    padding: 30rpx 0;
    border-bottom: 1rpx solid #EEEEEE;
    
    &:last-child {
      border-bottom: none;
    }
    
    .form-label {
      font-size: 28rpx;
      color: #333333;
      margin-bottom: 20rpx;
      
      &.required::before {
        content: '*';
        color: #FF6C00;
        margin-right: 5rpx;
      }
    }
    
    .form-input {
      font-size: 28rpx;
      height: 80rpx;
      width: 100%;
      
      &.location-picker {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      
      .placeholder {
        color: #999999;
      }
      
      .icon-right {
        font-size: 32rpx;
        color: #999999;
      }
    }
    
    .error-tip {
      font-size: 24rpx;
      color: #FF0000;
      margin-top: 10rpx;
    }
    
    &.switch-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      
      .form-label {
        margin-bottom: 0;
      }
    }
  }
}

/* 弹窗样式 */
.delivery-section {
  padding: 0 30rpx 30rpx 30rpx;
  background: #fff;
  border-top-left-radius: 24rpx;
  border-top-right-radius: 24rpx;

  .delivery-title {
    font-size: 32rpx;
    font-weight: bold;
    color: #222;
    text-align: center;
    margin: 32rpx 0 36rpx 0;
  }

  .region-selector {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 36rpx;
    
    .region-item {
      font-size: 28rpx;
      color: #222;
      margin: 0 18rpx;
      font-weight: 500;
      position: relative;
      &.active {
        color: #FE8D00;
      }
      &.highlight {
        color: #FE8D00;
      }
    }
  }

  .street-list {
    max-height: 420rpx;
    overflow-y: auto;
    .street-item {
      font-size: 26rpx;
      color: #B3B3B3;
      padding: 22rpx 0;
      text-align: left;
      transition: color 0.2s;
      &.active {
        color: #FE8D00;
      }
    }
  }
}
</style>
