<template>
    <view class="publish-page">
        <!-- 顶部栏 -->
        <view class="header">
            <text class="cancel" @click="goBack">取消</text>
            <text class="title"></text>
            <text class="publish" @click="handlePublish">发布</text>
        </view>

        <!-- 输入框 -->
        <view class="input-section">
            <input class="input" v-model="content" :placeholder="'说点什么或者 图片/视频AI配文 吧'" />
        </view>

        <!-- 图片/视频上传 -->
        <view class="media-section">
            <view class="media-list">
                <view v-for="(img, idx) in mediaList" :key="img" class="media-item">
                    <image :src="img" mode="aspectFill" />
                    <view class="close-btn" @click.stop="removeMedia(idx)">×</view>
                </view>
                <view v-if="mediaList.length < maxMediaCount" class="media-upload" @click="chooseMedia">
                    <view class="plus-icon">+</view>
                </view>
            </view>
        </view>

        <!-- 位置 -->
        <view class="location-section" @click="chooseLocation">
            <image src="/static/icons/evalute-location.svg" class="location-icon" />
            <text class="location-text">{{ location || '添加位置，让更多人看到' }}</text>
        </view>

        <!-- 标签（可选） -->
        <!-- <view class="tags-section">
      <view v-for="tag in tags" :key="tag" class="tag">{{ tag }}</view>
    </view> -->

        <!-- 权限设置（可选） -->
        <!-- <view class="permission-section">
      <text>权限设置</text>
      <picker :range="permissionOptions" v-model="permission">
        <view>{{ permissionOptions[permission] }}</view>
      </picker>
    </view> -->
    </view>
</template>

<script>
import { createGoodsComment } from '@/api/group.js'

export default {
    data() {
        return {
            content: '',
            mediaList: [],
            maxMediaCount: 6,
            location: '',
            orderId: '',
            goodsId: '',
            // tags: [],
            // permission: 0,
            // permissionOptions: ['所有人可见', '仅好友可见', '仅自己可见']
        }
    },
    onLoad(options) {
        // 获取传递的参数
        if (options.orderId) {
            this.orderId = options.orderId;
        }
        if (options.goodsId) {
            this.goodsId = options.goodsId;
        }
    },
    methods: {
        goBack() {
            uni.navigateBack();
        },
        handlePublish() {
            if (!this.content.trim() && this.mediaList.length === 0) {
                uni.showToast({ title: '内容不能为空', icon: 'none' });
                return;
            }
            
            // 如果有订单ID和商品ID，说明是商品评价
            if (this.orderId && this.goodsId) {
                this.publishGoodsComment();
            } else {
                // 普通发布逻辑
                uni.showToast({ title: '发布成功', icon: 'success' });
                this.goBack();
            }
        },
        // 发布商品评价
        publishGoodsComment() {
            // 构造评论数据
            const commentData = {
                comment: this.content,
                star_grade: 5, // 默认5星好评
                files: this.mediaList.join(','), // 图片路径，多个用逗号分隔
                goods_id: this.goodsId,
                order_id: this.orderId
            };
            
            // 调用API提交评论
            createGoodsComment(commentData).then(res => {
                if (res.status === 200) {
                    uni.showToast({ title: '评价成功', icon: 'success' });
                    // 返回上一页并标记评价成功
                    const pages = getCurrentPages();
                    if (pages.length > 1) {
                        const prevPage = pages[pages.length - 2];
                        if (prevPage && prevPage.$vm) {
                            prevPage.$vm.evaluateSuccess = true;
                        }
                    }
                    setTimeout(() => {
                        this.goBack();
                    }, 1000);
                } else {
                    uni.showToast({ title: res.msg || '评价失败', icon: 'none' });
                }
            }).catch(err => {
                console.error('评价提交失败:', err);
                uni.showToast({ title: '评价提交失败', icon: 'none' });
            });
        },
        chooseMedia() {
            uni.chooseImage({
                count: this.maxMediaCount - this.mediaList.length,
                success: (res) => {
                    this.mediaList = this.mediaList.concat(res.tempFilePaths);
                }
            });
        },
        removeMedia(idx) {
            this.mediaList.splice(idx, 1);
        },
        chooseLocation() {
            uni.chooseLocation({
                success: (res) => {
                    this.location = res.name;
                }
            });
        }
    }
}
</script>

<style scoped>
.publish-page {
    background: #fff;
    min-height: 100vh;
    padding: 0 24rpx;
}

.header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 90rpx;
    padding: 0 10rpx;
    border-bottom: 1px solid #f5f5f5;
}

.cancel,
.publish {
    color: #333;
    font-size: 32rpx;
}

.title {
    flex: 1;
    text-align: center;
}

.input-section {
    margin: 32rpx 0 0 0;
}

.input {
    width: 100%;
    font-size: 30rpx;
    color: #333;
    border: none;
    background: none;
    padding: 0;
}

.media-section {
    margin: 32rpx 0 0 0;
}

.media-list {
    display: flex;
    flex-direction: row;
    align-items: center;
}

.media-item {
    position: relative;
    width: 160rpx;
    height: 160rpx;
    margin-right: 16rpx;
    border-radius: 8rpx;
    overflow: hidden;
    background: #f5f5f5;
}

.media-item image {
    width: 100%;
    height: 100%;
    border-radius: 8rpx;
    object-fit: cover;
}

.close-btn {
    position: absolute;
    top: 8rpx;
    right: 8rpx;
    width: 32rpx;
    height: 32rpx;
    background: rgba(0, 0, 0, 0.5);
    color: #fff;
    border-radius: 50%;
    text-align: center;
    line-height: 32rpx;
    font-size: 28rpx;
    z-index: 2;
}

.media-upload {
    width: 160rpx;
    height: 160rpx;
    background: #f5f5f5;
    border-radius: 8rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 80rpx;
    color: #ccc;
}

.plus-icon {
    font-size: 80rpx;
    color: #ccc;
}

.location-section {
    display: flex;
    align-items: center;
    margin: 32rpx 0 0 0;
    width: 200px;
    background: #F4F5F7;
    height: 28px;
    border-radius: 14px;
    padding: 0 10px;
}

.location-icon {
    width: 32rpx;
    height: 32rpx;
    margin-right: 12rpx;
}

.location-text {
    font-family: 'PingFang SC';
    font-style: normal;
    font-weight: 400;
    font-size: 26rpx;
    line-height: 36rpx;

    /* 百分之10 */
    color: #1A1A1A;
}
</style>
