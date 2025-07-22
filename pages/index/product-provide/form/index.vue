<template>
    <view class="form-page">
        <!-- 使用通用头部导航组件 -->
        <CommonHeader title="基本信息" rightText="取消" @back="goBack" @rightClick="goBack"></CommonHeader>

        <!-- 表单内容 -->
        <scroll-view scroll-y class="form-content">
            <!-- 营业执照 -->
            <view class="form-item">
                <view class="form-label">营业执照照片：</view>
                <view class="upload-container">
                    <view class="upload-box" @tap="chooseImage('business')">
                        <image
                            v-if="formData.businessLicense"
                            :src="formData.businessLicense"
                            class="preview-image"
                            mode="aspectFill"
                        />
                        <template v-else>
                            <text class="upload-plus">+</text>
                            <text class="upload-text">营业执照照片</text>
                        </template>
                    </view>
                </view>
            </view>
            <!-- 法人身份证明 -->
            <view class="form-item">
                <view class="header-nav">
                    <view class="form-label">法人身份证明：</view>
                    <view class="right">
                        <view class="identity-text">居民身份证</view>
                        <ArrowRight />
                    </view>
                </view>
                <view class="identity-hint">
                    <text class="identity-desc">需上传营业执照中的法人身份证明</text>
                </view>
                <view class="upload-row">
                    <view class="upload-box half" @tap="chooseImage('idFront')">
                        <image
                            v-if="formData.idCardFront"
                            :src="formData.idCardFront"
                            class="preview-image half"
                            mode="aspectFill"
                        />
                        <template v-else>
                            <text class="upload-plus">+</text>
                            <text class="upload-text">身份证正面照片</text>
                        </template>
                    </view>
                    <view class="upload-box half" @tap="chooseImage('idBack')">
                        <image
                            v-if="formData.idCardBack"
                            :src="formData.idCardBack"
                            class="preview-image half"
                            mode="aspectFill"
                        />
                        <template v-else>
                            <text class="upload-plus">+</text>
                            <text class="upload-text">身份证背面照片</text>
                        </template>
                    </view>
                </view>
            </view>

            <!-- 产品照片 -->
            <view class="form-item">
                <view class="form-label">产品照片：</view>
                <view class="upload-container">
                    <view class="upload-box" @tap="chooseImage('product')">
                        <image
                            v-if="formData.productImage"
                            :src="formData.productImage"
                            class="preview-image"
                            mode="aspectFill"
                        />
                        <template v-else>
                            <text class="upload-plus">+</text>
                            <text class="upload-text">上传产品照片</text>
                        </template>
                    </view>
                </view>
            </view>

            <!-- 卫生许可证 -->
            <view class="form-item">
                <view class="form-label">卫生许可证：</view>
                <view class="upload-container">
                    <view class="upload-box" @tap="chooseImage('license')">
                        <image
                            v-if="formData.hygieneLicense"
                            :src="formData.hygieneLicense"
                            class="preview-image"
                            mode="aspectFill"
                        />
                        <template v-else>
                            <text class="upload-plus">+</text>
                            <text class="upload-text">上传卫生许可证照片</text>
                        </template>
                    </view>
                </view>
            </view>

            <!-- 产品来源商 -->
            <view class="form-item origin">
                <view class="form-label">产品来源商： </view>
                <input class="form-input" type="text" placeholder="请输入来源商" v-model="formData.productSource" />
            </view>



            <!-- 产品介绍 -->
            <view class="form-item">
                <view class="form-label">产品介绍：</view>
                <textarea class="form-textarea" placeholder="请输入产品的介绍内容" v-model="formData.productDesc"></textarea>
            </view>
        </scroll-view>

        <!-- 提交按钮 -->
        <view
            class="submit-btn"
            :style="{ background: isFormValid ? '#FE8D00' : '#FFC082' }"
            @tap="submitForm"
        >提交</view>

        <!-- 底部安全区占位 -->
        <view class="safe-area"></view>
    </view>
</template>

<script>
import ArrowRight from '@/components/ArrowRight'
import CommonHeader from '@/components/CommonHeader/index.vue';
import { supplierApply } from '@/api/group.js';

export default {
    components: {
        ArrowRight,
        CommonHeader
    },
    data() {
        return {
            statusBarHeight: 20,
            formData: {
                businessLicense: '',
                productImage: '',
                hygieneLicense: '',
                productSource: '',
                idCardFront: '',
                idCardBack: '',
                productDesc: ''
            }
        }
    },
    computed: {
        isFormValid() {
            const f = this.formData
            return f.businessLicense && f.productImage && f.hygieneLicense && f.productSource && f.idCardFront && f.idCardBack && f.productDesc
        }
    },
    onLoad() {
        // 获取状态栏高度
        this.statusBarHeight = uni.getSystemInfoSync().statusBarHeight
    },
    methods: {
        goBack() {
            uni.navigateBack()
        },
        // 选择图片
        chooseImage(type) {
            uni.chooseImage({
                count: 1,
                sizeType: ['compressed'],
                sourceType: ['album', 'camera'],
                success: (res) => {
                    // 根据类型设置不同的图片
                    const tempFilePath = res.tempFilePaths[0]
                    switch (type) {
                        case 'business':
                            this.formData.businessLicense = tempFilePath
                            break
                        case 'product':
                            this.formData.productImage = tempFilePath
                            break
                        case 'license':
                            this.formData.hygieneLicense = tempFilePath
                            break
                        case 'idFront':
                            this.formData.idCardFront = tempFilePath
                            break
                        case 'idBack':
                            this.formData.idCardBack = tempFilePath
                            break
                    }
                }
            })
        },
        // 提交表单
        submitForm() {
            // 简单的表单验证
            if (!this.formData.businessLicense) {
                uni.showToast({
                    title: '请上传营业执照照片',
                    icon: 'none'
                })
                return
            }

            if (!this.formData.productImage) {
                uni.showToast({
                    title: '请上传产品照片',
                    icon: 'none'
                })
                return
            }

            if (!this.formData.hygieneLicense) {
                uni.showToast({
                    title: '请上传卫生许可证',
                    icon: 'none'
                })
                return
            }

            if (!this.formData.productSource) {
                uni.showToast({
                    title: '请输入产品来源商',
                    icon: 'none'
                })
                return
            }

            if (!this.formData.idCardFront || !this.formData.idCardBack) {
                uni.showToast({
                    title: '请上传法人身份证明',
                    icon: 'none'
                })
                return
            }

            if (!this.formData.productDesc) {
                uni.showToast({
                    title: '请输入产品介绍',
                    icon: 'none'
                })
                return
            }

            // 提交供应商申请
            uni.showLoading({
                title: '提交中...'
            })

            // 准备提交数据，根据API文档要求的字段格式
            const submitData = {
                business_license: this.formData.businessLicense,
                goods_images: this.formData.productImage,
                hygienic_license: this.formData.hygieneLicense,
                identity_card_r: this.formData.idCardFront,
                identity_card_g: this.formData.idCardBack,
                source: this.formData.productSource,
                intro: this.formData.productDesc
            }

            supplierApply(submitData).then(res => {
                uni.hideLoading()
                uni.showToast({
                    title: '申请提交成功',
                    icon: 'success'
                })

                // 跳转到审核状态页面
                setTimeout(() => {
                    uni.navigateTo({
                        url: '/pages/index/product-provide/review/index'
                    })
                }, 1500)

            }).catch(err => {
                uni.hideLoading()
                uni.showToast({
                    title: err.msg || '提交失败，请重试',
                    icon: 'none'
                })
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.form-page {
    min-height: 100vh;
    background-color: #FFFFFF;
    position: relative;
    display: flex;
    flex-direction: column;
}

.status-bar {
    background-color: #FFFFFF;
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 88rpx;
    padding: 0 32rpx;
    background-color: #FFFFFF;

    .left-area {
        display: flex;
        align-items: center;

        .cancel-text {
            font-size: 36rpx;
            color: #7E7E7E;
        }
    }

    .page-title {
        font-size: 36rpx;
        font-weight: 400;
        color: #1A1A1A;
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
    }

    .right-placeholder {
        width: 56rpx;
    }
}

.divider {
    height: 1rpx;
    background-color: #F2F2F2;
    width: 100%;
}

.form-content {
    flex: 1;
    padding: 0 32rpx 160rpx;

    .origin {
        display: flex;
        align-items: center;

        .form-label {
            width: 300rpx;
            font-size: 32rpx;
            color: #1A1A1A;
            font-weight: 550;
            margin-bottom: 0;
        }
        .form-input {
            flex: 1;
            height: 80rpx;
            font-size: 28rpx;
            color: #333333;
            padding: 0 20rpx;
            margin-bottom: 15rpx;
            margin-left: 180rpx;
        }
    }

    .form-item {
        padding: 32rpx 0;
        border-bottom: 1rpx solid #F2F2F2;

        .header-nav {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .right {
            display: flex;
            .identity-text {
                margin-bottom: 10rpx;
                transform: translateY(-8rpx);
                color: #1A1A1A;
                font-size: 28rpx!important;
            }
        }

        .form-label {
            font-size: 32rpx;
            color: #1A1A1A;
            margin-bottom: 24rpx;
            font-weight: 550;
        }

        .upload-container {
            display: flex;
            flex-wrap: wrap;
            margin-bottom: 20rpx;
        }

        .upload-box {
            width: 200rpx;
            height: 200rpx;
            border: 2rpx dashed #B3B3B3;
            border-radius: 8rpx;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            margin-right: 20rpx;
            margin-bottom: 20rpx;

            &.half {
                width: 200rpx;
                height: 200rpx;
                margin-right: 20rpx;

                &:last-child {
                    margin-right: 0;
                }
            }

            .upload-plus {
                font-size: 80rpx;
                line-height: 1;
                color: #B3B3B3;
                margin-bottom: 10rpx;
            }

            .upload-text {
                font-size: 24rpx;
                color: #999999;
                text-align: center;
                padding: 0 10rpx;
            }
        }

        .preview-image {
            width: 200rpx;
            height: 200rpx;
            border-radius: 8rpx;

            &.half {
                width: 200rpx;
                height: 200rpx;
                border-radius: 8rpx;
            }
        }

        .upload-row,
        .preview-row {
            display: flex;
            width: 100%;
            margin-bottom: 20rpx;
        }

        .form-input {
            width: 100%;
            height: 80rpx;
            font-size: 28rpx;
            color: #333333;
            padding: 0 20rpx;
        }

        .form-textarea {
            width: 100%;
            height: 240rpx;
            background-color: #F7F7F7;
            border-radius: 8rpx;
            padding: 20rpx;
            font-size: 24rpx;
            color: #333333;
        }

        .identity-hint {
            margin-bottom: 30rpx;

            .identity-text {
                font-size: 28rpx;
                color: #1A1A1A;
                margin-right: 20rpx;
            }

            .identity-desc {
                font-size: 28rpx;
                color: #999999;
            }
        }
    }
}

.submit-btn {
    width: 662rpx;
    height: 92rpx;
    line-height: 100rpx;
    color: #FFFFFF;
    font-size: 32rpx;
    text-align: center;
    position: fixed;
    bottom: 40rpx;
    left: 48rpx;
    border-radius: 71px;
    /* background-color 可省略，已用:style控制 */
}

.safe-area {
    height: 68rpx;
}
</style>