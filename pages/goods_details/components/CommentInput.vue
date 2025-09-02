<template>
  <view class="comment-input-wrapper" :class="{ 'comment-input-show': visible }">
    <view class="comment-input-mask" @tap="close"></view>
    <view class="comment-input-card">
      <view class="comment-input-box">
        <input 
          class="comment-input" 
          v-model="commentText" 
          placeholder="说点什么吧..." 
          focus 
          confirm-type="send"
          @confirm="submitComment"
        />
        <view class="comment-input-actions">
          <view class="upload-btn" @tap="chooseImage">
            <image src="/static/icons/upload.png" class="icon-upload" />
          </view>
          <view class="send-btn" @tap="submitComment">发送</view>
        </view>
      </view>
      
      <!-- 图片预览区域 -->
      <view class="image-preview-area" v-if="imageList.length > 0">
        <view 
          v-for="(image, index) in imageList" 
          :key="index"
          class="image-preview-item"
        >
          <image :src="image.path" class="preview-image" mode="aspectFill" />
          <view class="delete-icon" @tap.stop="deleteImage(index)">×</view>
        </view>
        <view class="add-image-btn" @tap="chooseImage" v-if="imageList.length < 9">
          <text class="add-icon">+</text>
        </view>
      </view>
      
      <view class="safe-area-bottom"></view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'CommentInput',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: '说点什么吧...'
    }
  },
  data() {
    return {
      commentText: '',
      imageList: []
    }
  },
  methods: {
    close() {
      this.$emit('close');
    },
    submitComment() {
      if (!this.commentText.trim()) {
        uni.showToast({
          title: '评论内容不能为空',
          icon: 'none'
        });
        return;
      }
      
      // 如果有图片，先上传图片
      if (this.imageList.length > 0) {
        this.uploadImages();
      } else {
        // 没有图片，直接提交评论
        // 默认5星好评，但不显示评分区域
        this.$emit('submit', this.commentText, 5, '');
        this.resetForm();
      }
    },
    
    // 选择图片
    chooseImage() {
      const that = this;
      uni.chooseImage({
        count: 9 - that.imageList.length,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: function(res) {
          // 合并图片列表
          that.imageList = [...that.imageList, ...res.tempFiles];
          
          // 限制最多9张图片
          if (that.imageList.length > 9) {
            that.imageList = that.imageList.slice(0, 9);
            uni.showToast({
              title: '最多只能上传9张图片',
              icon: 'none'
            });
          }
        }
      });
    },
    
    // 删除图片
    deleteImage(index) {
      this.imageList.splice(index, 1);
    },
    
    // 上传图片
    uploadImages() {
      uni.showLoading({
        title: '上传图片中...'
      });
      
      const that = this;
      const uploadTasks = this.imageList.map(image => {
        return new Promise((resolve, reject) => {
          uni.uploadFile({
            url: `${that.getBaseUrl()}/api/upload/image`, // 图片上传API
            filePath: image.path,
            name: 'file',
            header: that.getHeaders(),
            success: function(res) {
              if (res.statusCode === 200) {
                // 解析返回的JSON字符串
                try {
                  const data = JSON.parse(res.data);
                  if (data.status === 200) {
                    resolve(data.data.url);
                  } else {
                    reject(data.msg || '上传失败');
                  }
                } catch (e) {
                  reject('上传失败，返回数据格式错误');
                }
              } else {
                reject(`上传失败，状态码: ${res.statusCode}`);
              }
            },
            fail: function(err) {
              reject(err.errMsg || '上传失败');
            }
          });
        });
      });
      
      // 等待所有图片上传完成
      Promise.all(uploadTasks)
        .then(urls => {
          uni.hideLoading();
          // 拼接图片URL
          const filesString = urls.join(',');
          // 提交评论，默认5星好评
          this.$emit('submit', this.commentText, 5, filesString);
          this.resetForm();
        })
        .catch(error => {
          uni.hideLoading();
          uni.showToast({
            title: typeof error === 'string' ? error : '图片上传失败',
            icon: 'none'
          });
        });
    },
    
    // 获取基础URL
    getBaseUrl() {
      // 从配置中获取HTTP请求URL
      // #ifdef MP || APP-PLUS
      return 'http://wx.laizhangluo.com';
      // #endif
      
      // #ifdef H5
      return 'http://wx.laizhangluo.com';
      // #endif
    },
    
    // 获取请求头
    getHeaders() {
      const token = uni.getStorageSync('Authori-zation');
      return {
        'Authori-zation': token || '',
        // #ifdef H5
        'Form-type': navigator.userAgent.toLowerCase().indexOf("micromessenger") !== -1 ? 'wechat' : 'h5',
        'X-Requested-With': 'XMLHttpRequest',
        // #endif
        // #ifdef MP
        'Form-type': 'routine',
        // #endif
        // #ifdef APP-VUE
        'Form-type': 'app',
        // #endif
      };
    },
    
    // 重置表单
    resetForm() {
      this.commentText = '';
      this.imageList = [];
      this.close();
    }
  }
}
</script>

<style lang="scss" scoped>
.comment-input-wrapper {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  z-index: 9999;
  visibility: hidden;
}

.comment-input-show {
  visibility: visible;
}

.comment-input-mask {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
}

.comment-input-card {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #fff;
  border-radius: 20rpx 20rpx 0 0;
  transform: translateY(100%);
  transition: transform 0.3s;
  padding: 20rpx;
  .comment-input-wrapper.comment-input-show & {
    transform: translateY(0);
  }
}

.comment-input-box {
  display: flex;
  align-items: center;
  background-color: #f5f5f5;
  border-radius: 36rpx;
  padding: 16rpx 24rpx;
}

.comment-input {
  flex: 1;
  height: 72rpx;
  font-size: 28rpx;
  background-color: transparent;
}

.comment-input-actions {
  display: flex;
  align-items: center;
}

.upload-btn {
  margin-right: 20rpx;
}

.icon-upload {
  width: 48rpx;
  height: 48rpx;
}

.send-btn {
  background-color: #ff6600;
  color: #fff;
  font-size: 26rpx;
  padding: 10rpx 24rpx;
  border-radius: 30rpx;
}

.image-preview-area {
  display: flex;
  flex-wrap: wrap;
  padding: 20rpx 0;
}

.image-preview-item {
  position: relative;
  width: 160rpx;
  height: 160rpx;
  margin: 10rpx;
  border-radius: 8rpx;
  overflow: hidden;
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.delete-icon {
  position: absolute;
  top: 0;
  right: 0;
  width: 40rpx;
  height: 40rpx;
  background-color: rgba(0, 0, 0, 0.5);
  color: #fff;
  font-size: 32rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.add-image-btn {
  width: 160rpx;
  height: 160rpx;
  margin: 10rpx;
  background-color: #f5f5f5;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.add-icon {
  font-size: 60rpx;
  color: #999;
}

.safe-area-bottom {
  height: env(safe-area-inset-bottom);
}
</style>