<template>
  <view class="avatar-setting-page">
    <!-- 顶部导航栏 -->
    <view class="header">
      <view class="back-btn" @click="navigateBack">
        <image src="/static/icons/back-arrow.svg" class="back-icon" />
      </view>
      <view class="title">头像设置</view>
      <view class="more-btn" @click="showActionSheet">
        <text class="more-dots">···</text>
      </view>
    </view>
    
    <!-- 头像展示区 -->
    <view class="avatar-box">
      <image class="avatar-img" :src="avatarUrl" mode="aspectFill" @click="toggleActions" />
    </view>
    
    <!-- 背景遮罩层 - 用于弹窗时的模糊效果 -->
    <view class="mask" v-if="showActions || showActionSheetOptions" @click="hideAllOverlays" :class="{'mask-show': showActions || showActionSheetOptions}"></view>
    
    <!-- 底部操作按钮 - 仅在操作时显示 -->
    <view class="action-buttons-fullwidth" v-if="showActions">
      <view class="action-btn-fullwidth" @click="takePhoto">拍照</view>
      <view class="action-btn-fullwidth" @click="chooseFromAlbum">从相册里选择</view>
      <view class="action-btn-fullwidth cancel" @click="hideActions">取消</view>
    </view>
    
    <!-- 更多选项菜单 -->
    <view class="action-sheet" v-if="showActionSheetOptions" :class="{'action-show': showActionSheetOptions}">
      <view class="action-sheet-btn" @click="takePhoto">拍照</view>
      <view class="action-sheet-btn" @click="chooseFromAlbum">从相册里选择</view>
      <view class="action-sheet-btn cancel" @click="hideActionSheet">取消</view>
    </view>
  </view>
</template>

<script>
import { getUserInfo, userEdit } from '@/api/user.js';

export default {
  data() {
    return {
      avatarUrl: '',
      userInfo: {},
      showActions: false,
      showActionSheetOptions: false
    }
  },
  onLoad() {
    this.getUserProfile();
  },
  methods: {
    // 获取用户完整个人信息
    getUserProfile() {
      uni.showLoading({
        title: '加载中...'
      });
      
      getUserInfo().then(res => {
        // 根据实际返回结构调整
        if (res.status === 200 || res.code === 200) {
          this.userInfo = res.data;
          this.avatarUrl = this.userInfo.avatar || '/static/images/avatar.png';
        } else {
          this.$util.Tips({
            title: res.msg || '获取用户信息失败'
          });
        }
        uni.hideLoading();
      }).catch(err => {
        uni.hideLoading();
        this.$util.Tips({
          title: err || '获取用户信息失败'
        });
      });
    },
    
    // 显示底部操作按钮
    toggleActions() {
      this.showActions = !this.showActions;
    },
    
    // 隐藏底部操作按钮
    hideActions() {
      this.showActions = false;
    },
    
    // 显示更多选项菜单
    showActionSheet() {
      this.showActionSheetOptions = true;
    },
    
    // 隐藏更多选项菜单
    hideActionSheet() {
      this.showActionSheetOptions = false;
    },
    
    // 隐藏所有浮层
    hideAllOverlays() {
      this.showActions = false;
      this.showActionSheetOptions = false;
    },
    
    // 拍照
    takePhoto() {
      // #ifdef APP-PLUS || MP
      uni.chooseImage({
        count: 1,
        sourceType: ['camera'],
        success: (res) => {
          this.uploadAvatar(res.tempFilePaths[0]);
        }
      });
      // #endif
      
      // #ifdef H5
      uni.chooseImage({
        count: 1,
        sourceType: ['camera'],
        success: (res) => {
          this.uploadAvatar(res.tempFilePaths[0]);
        },
        fail: () => {
          this.$util.Tips({
            title: '请允许使用摄像头权限'
          });
        }
      });
      // #endif
      
      this.hideActions();
      this.hideActionSheet();
    },
    
    // 从相册选择
    chooseFromAlbum() {
      uni.chooseImage({
        count: 1,
        sourceType: ['album'],
        success: (res) => {
          this.uploadAvatar(res.tempFilePaths[0]);
        }
      });
      
      this.hideActions();
      this.hideActionSheet();
    },
    
    // 上传头像
    uploadAvatar(filePath) {
      uni.showLoading({
        title: '上传中...'
      });
      
      // 使用项目中已有的上传图片方法
      this.$util.uploadImgs('upload/image', filePath, (res) => {
        if (res.data && res.data.url) {
          // 保存用户当前信息的副本
          const userUpdateData = {
            avatar: res.data.url,
            // 确保其他信息不会因为空值导致被覆盖为默认值
            nickname: this.userInfo.nickname || '',
            // 如果性别存在则保留现有值，如果不存在则设为0(保密)
            sex: typeof this.userInfo.sex !== 'undefined' ? this.userInfo.sex : 0,
            // 如果生日存在则保留现有值
            birthday: this.userInfo.birthday || 0
          };
          
          // 更新头像 - 使用POST /api/user/profile/update 接口
          userEdit(userUpdateData).then(res => {
            uni.hideLoading();
            if (res.code === 200 || res.status === 200) {
              // 更新本地头像
              this.avatarUrl = userUpdateData.avatar;
              
              // 静默更新用户信息，不显示提示
              getUserInfo().then(res => {
                if (res.code === 200 || res.status === 200) {
                  this.userInfo = res.data;
                }
                // 不显示任何提示
              }).catch(() => {
                // 出错也不显示提示
              });
              
              // 通知父页面刷新
              uni.$emit('updateUserInfo');
              
              // 延迟返回
              setTimeout(() => {
                this.navigateBack();
              }, 1000);
            } else {
              this.$util.Tips({
                title: res.msg || '头像更新失败'
              });
            }
          }).catch(err => {
            uni.hideLoading();
            this.$util.Tips({
              title: err || '头像更新失败'
            });
          });
        } else {
          uni.hideLoading();
          this.$util.Tips({
            title: '图片上传失败'
          });
        }
      }, (err) => {
        uni.hideLoading();
        this.$util.Tips({
          title: err || '图片上传失败'
        });
      });
    },
    
    // 保存图片
    saveImage() {
      uni.getSetting({
        success: (res) => {
          if (!res.authSetting['scope.writePhotosAlbum']) {
            uni.authorize({
              scope: 'scope.writePhotosAlbum',
              success: () => {
                this.saveImageToAlbum();
              },
              fail: () => {
                uni.showModal({
                  title: '提示',
                  content: '请授权保存图片到相册',
                  confirmText: '去设置',
                  success: (res) => {
                    if (res.confirm) {
                      uni.openSetting();
                    }
                  }
                });
              }
            });
          } else {
            this.saveImageToAlbum();
          }
        }
      });
      
      this.hideActionSheet();
    },
    
    // 保存图片到相册
    saveImageToAlbum() {
      uni.getImageInfo({
        src: this.avatarUrl,
        success: (res) => {
          uni.saveImageToPhotosAlbum({
            filePath: res.path,
            success: () => {
              this.$util.Tips({
                title: '保存成功',
                icon: 'success'
              });
            },
            fail: () => {
              this.$util.Tips({
                title: '保存失败'
              });
            }
          });
        },
        fail: () => {
          this.$util.Tips({
            title: '获取图片信息失败'
          });
        }
      });
    },
    
    // 分享图片
    shareImage() {
      // #ifdef APP-PLUS
      uni.share({
        provider: "weixin",
        scene: "WXSceneSession",
        type: 2,
        imageUrl: this.avatarUrl,
        success: () => {
          this.$util.Tips({
            title: '分享成功',
            icon: 'success'
          });
        },
        fail: () => {
          this.$util.Tips({
            title: '分享失败'
          });
        }
      });
      // #endif
      
      // #ifdef H5 || MP
      uni.showModal({
        title: '提示',
        content: '请长按图片进行分享',
        showCancel: false
      });
      // #endif
      
      this.hideActionSheet();
    },
    
    // 返回上一页
    navigateBack() {
      uni.navigateBack();
    }
  }
}
</script>

<style lang="scss" scoped>
.avatar-setting-page {
  min-height: 100vh;
  background: #181818;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  position: relative;
}

.header {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100rpx;
  position: relative;
  background: transparent;
  padding: 0 30rpx;
}

.back-btn {
  position: absolute;
  left: 20rpx;
  top: 0;
  height: 100%;
  display: flex;
  align-items: center;
  z-index: 10;
}

.back-icon {
  width: 32rpx;
  height: 32rpx;
  filter: brightness(5);
}

.title {
  font-size: 36rpx;
  color: #fff;
  font-weight: 500;
  text-align: center;
}

.more-btn {
  position: absolute;
  right: 30rpx;
  top: 0;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.more-dots {
  font-size: 40rpx;
  color: #ffffff;
  font-weight: bold;
  letter-spacing: 5rpx; /* 增加字符间距，使点点更明显横向排列 */
}

.avatar-box {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 60rpx 0;
}

.avatar-img {
  width: 80vw;
  max-width: 600rpx;
  aspect-ratio: 1/1;
  border-radius: 16rpx;
  background: #222;
  object-fit: cover;
}

/* 遮罩层 */
.mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(5px);
  z-index: 90;
  opacity: 0;
  transition: opacity 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.mask-show {
  opacity: 1;
}

/* 新的底部操作按钮 */
.action-buttons-new {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ffffff;
  z-index: 999;
  padding: 0 0 env(safe-area-inset-bottom) 0;
  border-top-left-radius: 20rpx;
  border-top-right-radius: 20rpx;
  overflow: hidden;
}

.action-btn-new {
  height: 110rpx;
  line-height: 110rpx;
  text-align: center;
  color: #333;
  font-size: 32rpx;
  border-top: 1rpx solid rgba(0, 0, 0, 0.05);
  
  &:active {
    background-color: rgba(0, 0, 0, 0.05);
  }
  
  &.cancel {
    margin-top: 10rpx;
    border-top: none;
    color: #007aff;
    font-weight: 500;
  }
}

/* 更多选项菜单 */
.action-sheet {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ffffff;
  z-index: 100;
  padding-bottom: env(safe-area-inset-bottom);
  overflow: hidden;
}

.action-show {
  display: block;
}

.action-sheet-btn {
  height: 110rpx;
  line-height: 110rpx;
  text-align: center;
  color: #333;
  font-size: 32rpx;
  border-bottom: 1rpx solid rgba(0, 0, 0, 0.05);
  
  &:active {
    background-color: rgba(0, 0, 0, 0.05);
  }
  
  &.cancel {
    border-bottom: none;
  }
}

/* 底部操作按钮 - 宽度拉满 */
.action-buttons-fullwidth {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ffffff;
  z-index: 999;
  display: flex;
  flex-direction: column;
  width: 100%;
}

.action-btn-fullwidth {
  height: 110rpx;
  line-height: 110rpx;
  text-align: center;
  color: #333;
  font-size: 32rpx;
  border-bottom: 1rpx solid #eee;
  
  &.cancel {
    border-bottom: none;
  }
}
</style> 