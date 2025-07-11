<template>
    <view :style="colorStyle">
        <!-- 顶部导航栏 -->
        <view class="page-header">
            <view class="header-left" @click="goBack">
                <text class="iconfont icon-fanhui"></text>
                <text class="back-text">{{ $t(`返回`) }}</text>
            </view>
            <view class="header-title">{{ $t(`待评价`) }}</view>
        </view>

        <!-- 搜索框 -->
        <view class="search-box">
            <view class="search-input">
                <text class="iconfont icon-sousuo"></text>
                <input type="text" :placeholder="$t(`搜索评价订单`)" v-model="keyword" @confirm="searchOrder" />
                <text v-if="keyword" class="clear-icon iconfont icon-guanbi" @click="clearSearch"></text>
                <view class="search-btn" @click="searchOrder">{{ $t(`搜索`) }}</view>
            </view>
        </view>

        <!-- 页面内容容器 -->
        <view class="evaluate-container">
            <!-- 初始加载状态 -->
            <view class="loading-initial" v-if="initialLoading">
                <view class="loading-skeleton" v-for="i in 3" :key="i">
                    <view class="skeleton-header"></view>
                    <view class="skeleton-content">
                        <view class="skeleton-image"></view>
                        <view class="skeleton-text">
                            <view class="skeleton-line"></view>
                            <view class="skeleton-line short"></view>
                        </view>
                    </view>
                    <view class="skeleton-footer"></view>
                </view>
            </view>

            <!-- 评价列表内容 -->
            <view class="evaluate-list" v-if="orderList.length && !initialLoading">
                <!-- 店铺和商品列表 -->
                <view class="store-item" v-for="(item, index) in orderList" :key="index">
                    <!-- 店铺名称 -->
                    <view class="store-name">{{ item.store_name }}</view>

                    <!-- 商品信息 -->
                    <view class="goods-info">
                        <image class="goods-img" :src="item.image" mode="aspectFill"></image>
                        <view class="goods-detail">
                            <view class="goods-name">{{ item.goods_name }}</view>
                            <view class="goods-count">{{ $t(`共一件商品`) }}</view>
                        </view>
                    </view>

                    <!-- 评价按钮 -->
                    <view class="evaluate-input-box">
                        <view class="input-placeholder" @click="goEvaluateEdit(item)">{{ $t(`展开说说吧`) }}</view>
                        <view class="evaluate-btn" @click="goEvaluateEdit(item)">{{ $t(`评价`) }}</view>
                    </view>
                </view>
            </view>

            <!-- 空状态显示 -->
            <view v-if="orderList.length === 0 && !loading && !initialLoading" class="empty-state">
                <emptyPage :title="$t(`您没有待评价订单`)" :image="emptyImage"></emptyPage>

                <!-- 猜你喜欢 -->
                <view class="guess-like" v-if="recommendGoods.length > 0">
                    <view class="guess-title">
                        <view class="line"></view>
                        <text>{{ $t(`猜你喜欢`) }}</text>
                        <view class="line"></view>
                    </view>
                    <view class="goods-list">
                        <view class="goods-item" v-for="(goods, index) in recommendGoods" :key="index"
                            @click="goGoodsDetail(goods)">
                            <image class="goods-img" :src="goods.image" mode="aspectFill"></image>
                            <view class="goods-name">{{ goods.store_name }}</view>
                            <view class="goods-desc">{{ goods.desc }}</view>
                            <view class="goods-price">{{ $t(`￥`) }}{{ goods.price }}</view>
                        </view>
                    </view>
                </view>
            </view>

            <!-- 加载更多 -->
            <view class="loading-more" v-if="orderList.length > 0">
                <text class="loading-text" v-if="loading">{{ $t(`加载中...`) }}</text>
                <text class="loading-text" v-else-if="loadend">{{ $t(`我也是有底线的`) }}</text>
                <text class="loading-text" v-else>{{ $t(`加载更多`) }}</text>
            </view>
        </view>

        <!-- 成功提示弹窗 -->
        <view class="success-popup" v-if="showSuccess">
            <view class="success-content">
                <text>{{ $t(`发布成功`) }}</text>
            </view>
        </view>

        <!-- #ifndef MP -->
        <home></home>
        <!-- #endif -->
    </view>
</template>

<script>
import home from '@/components/home'
import emptyPage from '@/components/emptyPage'
import { getEvaluateList, getRecommendGoods } from '@/api/order.js'
import { toLogin } from '@/libs/login.js'
import { mapGetters } from "vuex"
import colors from '@/mixins/color.js'

export default {
    components: {
        home,
        emptyPage
    },
    mixins: [colors],
    data () {
        return {
            keyword: '', // 搜索关键词
            loading: false, // 是否加载中
            initialLoading: true, // 初始加载状态
            loadend: false, // 是否加载完成
            page: 1, // 当前页码
            limit: 10, // 每页数量
            orderList: [], // 评价订单列表
            recommendGoods: [], // 推荐商品列表
            emptyImage: require('@/static/images/empty_evaluate.png'), // 空状态图片
            showSuccess: false, // 是否显示成功提示
        }
    },
    computed: mapGetters(['isLogin']),
    watch: {
        isLogin: {
            handler: function (newV) {
                if (newV) {
                    this.getOrderList()
                }
            },
            deep: true
        }
    },
    onLoad () {
        if (this.isLogin) {
            this.getOrderList()
            this.getRecommendList()
        } else {
            toLogin()
        }
    },
    onShow () {
        // 检查是否从评价页面返回，并且评价成功
        const pages = getCurrentPages()
        const currentPage = pages[pages.length - 1]

        // 如果有评价成功的标记，显示成功提示
        if (currentPage.$vm.evaluateSuccess) {
            this.showSuccessToast()
            currentPage.$vm.evaluateSuccess = false

            // 刷新待评价列表
            this.page = 1
            this.orderList = []
            this.loadend = false
            this.getOrderList()
        }
    },
    // 添加下拉刷新支持
    onPullDownRefresh () {
        this.page = 1
        this.orderList = []
        this.loadend = false

        // 同时刷新列表和推荐商品
        Promise.all([
            this.getOrderList(true),
            this.getRecommendList()
        ]).then(() => {
            uni.stopPullDownRefresh()
        }).catch(() => {
            uni.stopPullDownRefresh()
        })
    },
    onReachBottom () {
        this.getOrderList()
    },
    methods: {
        // 返回上一页
        goBack () {
            uni.navigateBack()
        },

        // 搜索订单
        searchOrder () {
            if (!this.keyword.trim()) return

            this.page = 1
            this.orderList = []
            this.loadend = false
            this.initialLoading = true
            this.getOrderList()
        },

        // 清空搜索
        clearSearch () {
            if (this.keyword) {
                this.keyword = ''
                this.page = 1
                this.orderList = []
                this.loadend = false
                this.initialLoading = true
                this.getOrderList()
            }
        },

        // 跳转到评价编辑页
        goEvaluateEdit (item) {
            uni.navigateTo({
                url: `/pages/goods/goods_comment_con/index?unique=${item.unique}&uni=${item.order_id}&from=evaluate`
            })
        },

        // 跳转到商品详情
        goGoodsDetail (goods) {
            uni.navigateTo({
                url: `/pages/goods_details/index?id=${goods.id}`
            })
        },

        // 获取待评价订单列表
        getOrderList (isPullDown = false) {
            if (this.loading || this.loadend) return

            this.loading = true

            // 只有非下拉刷新时才显示loading
            if (!isPullDown) {
                uni.showLoading({
                    title: this.$t(`加载中`)
                })
            }

            // 使用真实API调用，替换模拟数据
            return new Promise((resolve, reject) => {
                getEvaluateList({
                    page: this.page,
                    limit: this.limit,
                    keyword: this.keyword
                }).then(res => {
                    const list = res.data.list || []
                    this.orderList = this.orderList.concat(list)
                    this.loadend = list.length < this.limit
                    this.loading = false
                    this.initialLoading = false
                    this.page++

                    uni.hideLoading()
                    resolve(list)
                }).catch(err => {
                    this.loading = false
                    this.initialLoading = false
                    uni.hideLoading()
                    this.$util.Tips({
                        title: err || this.$t(`加载失败`)
                    })
                    reject(err)
                })
            })
        },

        // 获取推荐商品列表
        getRecommendList () {
            // 使用真实API调用，替换模拟数据
            return new Promise((resolve, reject) => {
                getRecommendGoods().then(res => {
                    this.recommendGoods = res.data || []
                    resolve(res.data)
                }).catch(err => {
                    this.recommendGoods = []
                    reject(err)
                })
            })
        },

        // 显示成功提示
        showSuccessToast () {
            this.showSuccess = true
            setTimeout(() => {
                // 添加fadeOut类名实现渐变消失
                const popup = document.querySelector('.success-popup')
                if (popup) {
                    popup.classList.add('fadeOut')
                }

                // 延迟后隐藏元素
                setTimeout(() => {
                    this.showSuccess = false
                }, 300)
            }, 1200)
        }
    }
}
</script>

<style lang="scss" scoped>
.page-header {
    height: 90rpx;
    display: flex;
    align-items: center;
    position: relative;
    background-color: #fff;
    padding: 0 30rpx;

    .header-left {
        display: flex;
        align-items: center;
        position: absolute;
        left: 30rpx;
        z-index: 1;

        .iconfont {
            font-size: 36rpx;
            color: #333;
        }

        .back-text {
            font-size: 32rpx;
            color: #333;
            margin-left: 10rpx;
        }
    }

    .header-title {
        flex: 1;
        text-align: center;
        font-size: 36rpx;
        font-weight: 500;
        color: #1A1A1A;
    }
}

.search-box {
    padding: 20rpx 30rpx;
    background-color: #fff;

    .search-input {
        height: 72rpx;
        background-color: #F0F4F7;
        border-radius: 8rpx;
        display: flex;
        align-items: center;
        padding: 0 20rpx;

        .iconfont {
            font-size: 30rpx;
            color: #ccc;
            margin-right: 10rpx;
        }

        input {
            flex: 1;
            height: 100%;
            font-size: 28rpx;
            color: #333;
        }

        .clear-icon {
            font-size: 28rpx;
            color: #999;
            padding: 0 10rpx;
        }

        .search-btn {
            height: 56rpx;
            line-height: 56rpx;
            padding: 0 20rpx;
            background-color: #FF8C1B;
            color: #fff;
            font-size: 26rpx;
            border-radius: 8rpx;
            margin-left: 10rpx;
        }
    }
}

.evaluate-container {
    background-color: #F0F0F0;
    min-height: calc(100vh - 162rpx);
    padding-bottom: 100rpx;
}

// 初始加载状态骨架屏
.loading-initial {
    padding: 20rpx 30rpx;

    .loading-skeleton {
        background-color: #fff;
        border-radius: 8rpx;
        margin-bottom: 20rpx;
        padding: 20rpx;

        .skeleton-header {
            height: 32rpx;
            background-color: #EFEFEF;
            width: 40%;
            border-radius: 4rpx;
            margin-bottom: 20rpx;
        }

        .skeleton-content {
            display: flex;
            margin-bottom: 20rpx;

            .skeleton-image {
                width: 160rpx;
                height: 160rpx;
                background-color: #EFEFEF;
                border-radius: 8rpx;
                margin-right: 20rpx;
            }

            .skeleton-text {
                flex: 1;

                .skeleton-line {
                    height: 28rpx;
                    background-color: #EFEFEF;
                    width: 100%;
                    border-radius: 4rpx;
                    margin-bottom: 16rpx;

                    &.short {
                        width: 60%;
                    }
                }
            }
        }

        .skeleton-footer {
            height: 60rpx;
            background-color: #EFEFEF;
            border-radius: 8rpx;
        }
    }
}

.evaluate-list {
    .store-item {
        margin-top: 20rpx;
        background-color: #fff;
        padding: 30rpx;

        .store-name {
            font-size: 32rpx;
            font-weight: 500;
            color: #000;
            margin-bottom: 20rpx;
        }

        .goods-info {
            display: flex;
            flex-direction: row;
            margin-bottom: 30rpx;

            .goods-img {
                width: 160rpx;
                height: 160rpx;
                border-radius: 8rpx;
                margin-right: 20rpx;
            }

            .goods-detail {
                flex: 1;
                display: flex;
                flex-direction: column;
                justify-content: space-between;

                .goods-name {
                    font-size: 28rpx;
                    color: #000;
                    margin-bottom: 10rpx;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                .goods-count {
                    font-size: 24rpx;
                    color: #999;
                }
            }
        }

        .evaluate-input-box {
            display: flex;
            justify-content: space-between;
            align-items: center;
            background-color: #F9F9F9;
            height: 80rpx;
            border-radius: 8rpx;
            padding: 0 20rpx;

            .input-placeholder {
                font-size: 28rpx;
                color: #999;
                flex: 1;
            }

            .evaluate-btn {
                width: 120rpx;
                height: 60rpx;
                line-height: 60rpx;
                text-align: center;
                background-color: #FF8C1B;
                color: #fff;
                border-radius: 8rpx;
                font-size: 28rpx;
            }
        }
    }
}

.empty-state {
    padding: 60rpx 30rpx;

    .guess-title {
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 60rpx 0 30rpx;

        text {
            font-size: 32rpx;
            color: #333;
            padding: 0 20rpx;
        }

        .line {
            width: 100rpx;
            height: 1px;
            background-color: #333;
        }
    }

    .goods-list {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;

        .goods-item {
            width: 31%;
            background-color: #fff;
            border-radius: 8rpx;
            overflow: hidden;
            margin-bottom: 20rpx;
            padding-bottom: 20rpx;

            .goods-img {
                width: 100%;
                height: 200rpx;
            }

            .goods-name {
                font-size: 28rpx;
                color: #000;
                padding: 10rpx;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }

            .goods-desc {
                font-size: 24rpx;
                color: #666;
                padding: 0 10rpx;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }

            .goods-price {
                font-size: 28rpx;
                color: #FF8C1B;
                padding: 10rpx;
                font-weight: bold;
            }
        }
    }
}

.loading-more {
    text-align: center;
    padding: 30rpx 0;

    .loading-text {
        font-size: 28rpx;
        color: #999;
    }
}

.success-popup {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 999;
    animation: fadeIn 0.3s ease;

    &.fadeOut {
        animation: fadeOut 0.3s ease forwards;
    }

    .success-content {
        background-color: rgba(0, 0, 0, 0.7);
        color: #fff;
        font-size: 32rpx;
        padding: 20rpx 40rpx;
        border-radius: 10rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        animation: scaleIn 0.3s ease;

        text {
            margin-left: 10rpx;
        }

        &::before {
            content: '\e6b1';
            font-family: 'iconfont';
            color: #fff;
            font-size: 36rpx;
        }
    }
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}

@keyframes fadeOut {
    from {
        opacity: 1;
    }

    to {
        opacity: 0;
    }
}

@keyframes scaleIn {
    from {
        transform: scale(0.5);
    }

    to {
        transform: scale(1);
    }
}
</style>