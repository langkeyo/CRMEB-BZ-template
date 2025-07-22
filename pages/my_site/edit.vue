<template>
  <view class="edit-page">
    <!-- 使用通用头部导航组件 -->
    <CommonHeader
      title="编辑站点"
      rightText="保存"
      @back="goBack"
      @rightClick="saveSite">
    </CommonHeader>
    
    <!-- 表单内容 -->
    <view class="form-content">
      <!-- 地区选择 -->
      <view class="form-item">
        <view class="form-label required">所在地区</view>
        <view class="form-input location-picker" @click="selectLocation">
          <text v-if="form.province && form.city && form.district">{{ form.province + form.city + form.district }}</text>
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
      
      <!-- 联系人 -->
      <view class="form-item">
        <view class="form-label required">联系人</view>
        <input 
          class="form-input" 
          type="text" 
          v-model="form.contactName"
          placeholder="请输入联系人姓名"
          @blur="validateField('contactName')"
        />
        <view class="error-tip" v-if="errors.contactName">{{ errors.contactName }}</view>
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
    
    <!-- 删除按钮 -->
    <view class="delete-section" v-if="isEdit">
      <view class="delete-btn" @click="confirmDelete">删除此站点</view>
    </view>
    
    <!-- 确认删除弹窗 -->
    <view class="confirm-modal" v-if="showDeleteModal">
      <view class="modal-content">
        <view class="modal-title">确定要删除此站点吗？</view>
        <view class="modal-buttons">
          <view class="cancel-btn" @click="cancelDelete">取消</view>
          <view class="confirm-btn" @click="deleteSite">确定</view>
        </view>
      </view>
      <view class="modal-mask" @click="cancelDelete"></view>
    </view>
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
      isEdit: false, // 是否是编辑模式
      siteId: null,
      form: {
        province: '',
        city: '',
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
      showDeleteModal: false
    };
  },
  computed: {
    fullAddress() {
      const { province, city, district, address } = this.form;
      return province + city + district + address;
    }
  },
  onLoad(options) {
    // 判断是否是编辑模式
    if (options.id) {
      this.isEdit = true;
      try {
        // 解析传递的站点信息
        const siteInfo = JSON.parse(decodeURIComponent(options.id));
        this.siteId = siteInfo.id;
        
        // 解析地址为省市区
        if (siteInfo.fullAddress) {
          // 这里简单处理，实际应该根据具体格式解析
          const addressParts = this.parseAddress(siteInfo.fullAddress);
          this.form.province = addressParts.province;
          this.form.city = addressParts.city;
          this.form.district = addressParts.district;
          this.form.address = addressParts.address;
        }
        
        this.form.building = siteInfo.building || '';
        this.form.contactName = siteInfo.contactName || '';
        this.form.contactPhone = siteInfo.contactPhone || '';
        this.form.isDefault = siteInfo.isDefault || false;
      } catch (e) {
        console.error('解析站点信息失败', e);
        uni.showToast({
          title: '获取站点信息失败',
          icon: 'none'
        });
      }
    }
  },
  methods: {
    goBack() {
      uni.navigateBack();
    },
    // 解析地址为省市区
    parseAddress(fullAddress) {
      // 实际项目中应该有更精确的解析方法
      // 这里仅作示例
      let province = '';
      let city = '';
      let district = '';
      let address = fullAddress;
      
      if (fullAddress.indexOf('北京市') === 0) {
        province = '北京市';
        address = fullAddress.substring(3);
        
        // 提取市辖区
        const districtMatch = address.match(/^(海淀区|朝阳区|东城区|西城区|丰台区|石景山区|通州区|顺义区|房山区|大兴区|昌平区|怀柔区|平谷区|密云区|延庆区)/);
        if (districtMatch) {
          district = districtMatch[1];
          address = address.substring(district.length);
        }
        
        city = '北京市'; // 直辖市city与province一致
      }
      
      return {
        province,
        city,
        district,
        address
      };
    },
    selectLocation() {
      // 跳转到地址选择页面
      uni.navigateTo({
        url: './select?from=edit'
      });
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
            this.errors.contactName = '请输入联系人姓名';
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
      const fields = ['location', 'address', 'building', 'contactName', 'contactPhone'];
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
        id: this.isEdit ? this.siteId : Date.now(), // 如果是新增，使用时间戳作为ID
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
        
        if (this.isEdit) {
          // 编辑模式：更新现有站点
          const index = siteList.findIndex(item => item.id === this.siteId);
          if (index !== -1) {
            siteList[index] = site;
          }
        } else {
          // 新增模式：添加到列表
          siteList.push(site);
        }
        
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
          title: this.isEdit ? '站点已更新' : '站点已添加',
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
    confirmDelete() {
      this.showDeleteModal = true;
    },
    cancelDelete() {
      this.showDeleteModal = false;
    },
    deleteSite() {
      if (!this.isEdit || !this.siteId) {
        uni.showToast({
          title: '无法删除',
          icon: 'none'
        });
        return;
      }
      
      try {
        // 获取站点列表
        let siteList = uni.getStorageSync('SITE_LIST') || '[]';
        siteList = JSON.parse(siteList);
        
        // 查找站点索引
        const index = siteList.findIndex(item => item.id === this.siteId);
        if (index !== -1) {
          const isDefault = siteList[index].isDefault;
          
          // 删除站点
          siteList.splice(index, 1);
          
          // 如果删除的是默认站点，且还有其他站点，则设置第一个为默认
          if (isDefault && siteList.length > 0) {
            siteList[0].isDefault = true;
            uni.setStorageSync('CURRENT_SITE', JSON.stringify(siteList[0]));
            uni.setStorageSync('CURRENT_SITE_ID', siteList[0].id);
          } else if (siteList.length === 0) {
            // 如果没有站点了，清除当前站点缓存
            uni.removeStorageSync('CURRENT_SITE');
            uni.removeStorageSync('CURRENT_SITE_ID');
          }
          
          // 保存修改后的列表
          uni.setStorageSync('SITE_LIST', JSON.stringify(siteList));
          
          uni.showToast({
            title: '站点已删除',
            icon: 'success',
            duration: 1500,
            success: () => {
              setTimeout(() => {
                uni.navigateBack({
                  delta: 1
                });
              }, 1500);
            }
          });
        } else {
          throw new Error('站点未找到');
        }
      } catch (e) {
        console.error('删除站点失败', e);
        uni.showToast({
          title: '删除失败，请重试',
          icon: 'none'
        });
      } finally {
        this.showDeleteModal = false;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.edit-page {
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

/* 删除按钮 */
.delete-section {
  margin-top: 30rpx;
  padding: 0 30rpx;
  
  .delete-btn {
    height: 90rpx;
    background-color: #FFFFFF;
    color: #FF0000;
    font-size: 32rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8rpx;
  }
}

/* 确认删除弹窗 */
.confirm-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
  
  .modal-mask {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
  }
  
  .modal-content {
    width: 600rpx;
    background-color: #FFFFFF;
    border-radius: 12rpx;
    z-index: 1000;
    overflow: hidden;
    
    .modal-title {
      padding: 60rpx 40rpx;
      font-size: 32rpx;
      color: #333333;
      text-align: center;
      font-weight: 500;
    }
    
    .modal-buttons {
      display: flex;
      border-top: 1rpx solid #EEEEEE;
      
      .cancel-btn, .confirm-btn {
        flex: 1;
        height: 90rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 32rpx;
      }
      
      .cancel-btn {
        color: #666666;
        border-right: 1rpx solid #EEEEEE;
      }
      
      .confirm-btn {
        color: #FF0000;
      }
    }
  }
}
</style>
