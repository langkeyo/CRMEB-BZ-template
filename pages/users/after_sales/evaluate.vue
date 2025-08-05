<template>
    <view :style="colorStyle" class="evaluate-page">
        <!-- 顶部导航栏 -->
        <view class="page-header">
            <view class="header-left" @click="goBack">
                <text class="iconfont icon-fanhui"></text>
                <text class="back-text">{{ $t(`返回`) }}</text>
            </view>
            <view class="header-title">{{ $t(`待评价`) }}</view>
        </view>

        <!-- 搜索框 -->
        <view class="search-box" v-if="orderList.length > 0">
            <view class="search-input">
                <text class="iconfont icon-sousuo"></text>
                <input type="text" :placeholder="$t(`搜索评价订单`)" v-model="keyword" @confirm="searchOrder" />
                <text v-if="keyword" class="clear-icon iconfont icon-guanbi" @click="clearSearch"></text>
                <!-- <view class="search-btn" @click="searchOrder">{{ $t(`搜索`) }}</view> -->
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
                            
                            <!-- 评价输入框和按钮 -->
                            <view class="evaluate-input-box">
                                <view class="input-placeholder-bg">
                                    <view class="input-placeholder" @click="goEvaluateEdit(item)">{{ $t(`展开说说吧`) }}</view>
                                </view>
                                <view class="like-btn" :class="{'active': item.isLiked}" @click="toggleLike(item)">
                                    <image
                                        class="praise-finger"
                                        :src="'/static/icons/praise-finger.svg'"
                                        mode="widthFix"
                                    />
                                </view>
                                <view class="evaluate-btn" @click="goEvaluateEdit(item)">{{ $t(`评价`) }}</view>
                            </view>
                        </view>
                    </view>
                    
                    <!-- 分割线 -->
                    <view class="divider" v-if="index < orderList.length - 1"></view>
                </view>
            </view>

            <!-- 空状态显示 -->
            <view v-if="orderList.length === 0 && !loading && !initialLoading" class="empty-state">
                <!-- Custom empty state that matches the Figma design -->
                <view class="custom-empty">
                    <image class="empty-image" :src="emptyImage" mode="aspectFit"></image>
                    <view class="empty-text">{{ $t(`您没有待评价订单`) }}</view>
                </view>

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
                            <view class="goods-price">
                                <text class="yuan">{{ $t(`￥`) }}</text>{{ goods.price }}
                            </view>
                        </view>
                    </view>
                </view>
            </view>

            <!-- 加载更多 -->
            <view class="loading-more" v-if="orderList.length > 0">
                <text class="loading-text" v-if="loading">{{ $t(`加载中...`) }}</text>
                <text class="loading-text" v-else-if="loadend && page > 2">{{ $t(`我也是有底线的`) }}</text>
                <text class="loading-text" v-else-if="!loadend">{{ $t(`加载更多`) }}</text>
            </view>
        </view>

        <!-- 成功提示弹窗 -->
        <view class="success-popup" v-if="showSuccess">
            <view class="success-content">
                <text>{{ $t(`发布成功`) }}</text>
            </view>
        </view>

        <!-- 移除home组件 -->
    </view>
</template>

<script>
import emptyPage from '@/components/emptyPage'
import { getGroupGoodsList } from '@/api/group.js' // 修改为使用商品列表接口
import { toLogin } from '@/libs/login.js'
import { mapGetters } from "vuex"
import colors from '@/mixins/color.js'
import { HTTP_REQUEST_URL, TOKENNAME } from '@/config/app.js' // 添加这行，引入HTTP配置

export default {
    components: {
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
            orderList: [], // 评价订单列表 - 实际项目中应该从后端获取
            recommendGoods: [], // 推荐商品列表
            emptyImage: '/static/images/user/no-orders.png', // 空状态图片，使用本地图片
            showSuccess: false, // 是否显示成功提示
            likeLoading: false, // 点赞/取消点赞时的加载状态
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

        // 切换点赞状态
        toggleLike(item) {
            // 防止重复点击
            if (this.likeLoading) return;
            this.likeLoading = true;
            
            const isLiked = !item.isLiked;
            
            // 使用正确的收藏接口
            const url = isLiked 
                ? HTTP_REQUEST_URL + '/api/group/collect/add'
                : HTTP_REQUEST_URL + '/api/group/collect/del';
            
            uni.request({
                url: url,
                method: 'POST',
                header: {
                    'content-type': 'application/json',
                    [TOKENNAME]: 'Bearer ' + this.$store.state.app.token
                },
                data: {
                    fav_id: item.order_id,
                    type: '0' // 0表示商品
                },
                success: (res) => {
                    if (res.data.status === 200) {
                        // 成功后更新状态
                        item.isLiked = isLiked;
                        uni.showToast({
                            title: isLiked ? this.$t('收藏成功') : this.$t('取消收藏成功'),
                            icon: 'none',
                            duration: 1500
                        });
                    } else {
                        uni.showToast({
                            title: res.data.msg || this.$t('操作失败'),
                            icon: 'none',
                            duration: 1500
                        });
                    }
                },
                fail: () => {
                    uni.showToast({
                        title: this.$t('网络错误，请重试'),
                        icon: 'none',
                        duration: 1500
                    });
                },
                complete: () => {
                    this.likeLoading = false;
                }
            });
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

            // 使用订单列表API获取待评价订单
            return new Promise((resolve, reject) => {
                uni.request({
                    url: HTTP_REQUEST_URL + '/api/group/order/order_list',
                    method: 'GET',
                    header: {
                        'content-type': 'application/json',
                        [TOKENNAME]: 'Bearer ' + this.$store.state.app.token
                    },
                    data: {
                        page: this.page,
                        limit: this.limit,
                        status: 2, // 已完成状态的订单可以评价
                        keyword: this.keyword
                    },
                    success: (res) => {
                        if (res.data.status === 200) {
                            const list = res.data.data.list || []
                            
                            // 处理订单数据，添加点赞状态字段
                            const formattedList = list.map(item => {
                                return {
                                    ...item,
                                    store_name: item.store_name || '社区团购',
                                    image: item.goods && item.goods.length > 0 ? item.goods[0].image : '/static/images/goods/default.png',
                                    goods_name: item.goods && item.goods.length > 0 ? item.goods[0].goods_name : '商品名称',
                                    unique: item.order_number,
                                    order_id: item.id,
                                    isLiked: false // 默认未点赞
                                }
                            })
                            
                            this.orderList = this.page === 1 ? formattedList : this.orderList.concat(formattedList)
                            this.loadend = formattedList.length < this.limit
                            this.loading = false
                            this.initialLoading = false
                            this.page++
                            
                            uni.hideLoading()
                            resolve(formattedList)
                        } else {
                            this.loading = false
                            this.initialLoading = false
                            uni.hideLoading()
                            this.$util.Tips({
                                title: res.data.msg || this.$t(`加载失败`)
                            })
                            reject(res.data.msg)
                        }
                    },
                    fail: (err) => {
                        this.loading = false
                        this.initialLoading = false
                        uni.hideLoading()
                        this.$util.Tips({
                            title: this.$t(`网络错误，请稍后重试`)
                        })
                        reject(err)
                    }
                })
            })
        },

        // 获取推荐商品列表 - 使用商品列表接口
        getRecommendList () {
            return new Promise((resolve, reject) => {
                // 使用商品列表接口，传入is_recommend=1参数获取推荐商品
                uni.request({
                    url: HTTP_REQUEST_URL + '/api/group/goods/list',
                    method: 'GET',
                    header: {
                        'content-type': 'application/json',
                        [TOKENNAME]: 'Bearer ' + this.$store.state.app.token
                    },
                    data: {
                        page: 1,
                        limit: 6,
                        is_recommend: 1 // 获取推荐商品
                    },
                    success: (res) => {
                        if (res.data.status === 200 && res.data.data && res.data.data.goodsList) {
                            // 处理商品数据，根据实际接口返回的数据结构调整
                            this.recommendGoods = res.data.data.goodsList.map(item => {
                                return {
                                    id: item.id,
                                    store_name: item.title,
                                    desc: item.store_info || '精选好物',
                                    price: item.min_price,
                                    image: HTTP_REQUEST_URL + item.image
                                };
                            });
                        } else {
                            // 如果API没有返回数据，使用模拟数据
                            this.setMockRecommendGoods();
                        }
                        resolve(this.recommendGoods);
                    },
                    fail: (err) => {
                        // 发生错误时使用模拟数据
                        this.setMockRecommendGoods();
                        console.error('获取推荐商品失败:', err);
                        resolve(this.recommendGoods);
                    }
                });
            });
        },

        // 设置模拟推荐商品数据
        setMockRecommendGoods() {
            this.recommendGoods = [
                {
                    id: 1,
                    store_name: '乐事薯片',
                    desc: '会员活动大礼包',
                    price: '15.8',
                    image: '/static/images/goods/snack6.png'
                },
                {
                    id: 2,
                    store_name: '百草味坚果',
                    desc: '一盒15包随机口味',
                    price: '35',
                    image: '/static/images/goods/snack6.png'
                },
                {
                    id: 3,
                    store_name: '格力高饼干',
                    desc: '一箱10袋口味随机',
                    price: '65',
                    image: '/static/images/goods/snack6.png'
                }
            ];
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
.evaluate-page {
    background-color: #F0F0F0;
    min-height: 100vh;
}

.page-header {
    height: 90rpx;
    display: flex;
    align-items: center;
    position: relative;
    background-color: #fff;
    margin-bottom: 20rpx;

    .header-left {
        display: flex;
        align-items: center;
        position: absolute;
        left: 30rpx;
        z-index: 1;

        .iconfont {
            font-size: 36rpx;
            color: #333333;
        }

        .back-text {
            font-size: 36rpx;
            color: #333333;
            margin-left: 10rpx;
            font-family: 'PingFang SC';
            font-weight: 400;
        }
    }

    .header-title {
        flex: 1;
        text-align: center;
        font-size: 36rpx;
        font-weight: 400;
        color: #1A1A1A;
        font-family: 'PingFang SC';
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
    min-height: calc(100vh - 240rpx);
    // background-color: #fff;
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
    padding: 0 24rpx;
    
    .store-item {
        padding: 30rpx 0;
        position: relative;

        .store-name {
            font-size: 32rpx;
            font-weight: 400;
            color: #000000;
            margin-bottom: 20rpx;
            font-family: 'PingFang SC';
        }

        .goods-info {
            display: flex;
            flex-direction: row;

            .goods-img {
                width: 198rpx;
                height: 190rpx;
                border-radius: 8rpx;
                margin-right: 20rpx;
            }

            .goods-detail {
                flex: 1;
                display: flex;
                flex-direction: column;

                .goods-name {
                    font-size: 28rpx;
                    color: #000000;
                    margin-bottom: 10rpx;
                    font-family: 'PingFang SC';
                    font-weight: 400;
                }

                .goods-count {
                    font-size: 28rpx;
                    color: #999999;
                    margin-bottom: 20rpx;
                    font-family: 'PingFang SC';
                    font-weight: 400;
                }
            }
        }

        .evaluate-input-box {
            display: flex;
            align-items: center;
            height: 60rpx;
            // 不要背景色

            .input-placeholder-bg {
                background: #f9f9f9;
                border-radius: 8rpx;
                height: 60rpx;
                display: flex;
                align-items: center;
                flex: 1;
                margin-right: 16rpx;
                .input-placeholder {
                    font-size: 28rpx;
                    color: #999999;
                    padding: 0 20rpx;
                    width: 100%;
                    font-family: 'PingFang SC';
                    font-weight: 400;
                    line-height: 60rpx;
                }
            }
            .like-btn {
                width: 60rpx;
                height: 60rpx;
                margin-left: 0;
                margin-right: 16rpx;
                display: flex;
                align-items: center;
                justify-content: center;
                background: none;
                border: none;
                .praise-finger {
                    width: 48rpx;
                    height: 48rpx;
                    display: block;
                    transition: all 0.2s;
                }
                &.active .praise-finger {
                    // 使用SVG滤镜改变填充颜色为#FF8C1B
                    filter: invert(58%) sepia(75%) saturate(1966%) hue-rotate(359deg) brightness(103%) contrast(106%);
                }
            }
            .evaluate-btn {
                width: 120rpx;
                height: 60rpx;
                line-height: 60rpx;
                text-align: center;
                background-color: #FF8C1B;
                color: #FFFFFF;
                border-radius: 8rpx;
                font-size: 28rpx;
                font-family: 'PingFang SC';
                font-weight: 400;
                margin-left: 0;
            }
        }
        
        .divider {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 1rpx;
            background-color: #F2F2F2;
        }
    }
}

.empty-state {
    padding: 20rpx 30rpx;
    background-color: #F0F0F0;

    .custom-empty {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding-top: 100rpx;
        
        .empty-image {
            width: 296rpx;
            height: 206rpx;
            margin-bottom: 20rpx;
            object-fit: contain;
        }
        
        .empty-text {
            font-size: 26rpx;
            color: #777777;
            font-family: 'PingFang SC';
            font-weight: 400;
        }
    }

    .guess-title {
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 60rpx 0 30rpx;

        text {
            font-size: 40rpx;
            color: #333333;
            padding: 0 20rpx;
            font-weight: 400;
            font-family: 'PingFang SC';
        }

        .line {
            width: 37rpx;
            height: 3rpx;
            background-color: #333333;
        }
    }

    .goods-list {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;

        .goods-item {
            width: 220rpx;
            background-color: #fff;
            border-radius: 16rpx;
            overflow: hidden;
            margin-bottom: 24rpx;
            box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.04);

            .goods-img {
                width: 100%;
                height: 180rpx;
                object-fit: cover;
                border-top-left-radius: 16rpx;
                border-top-right-radius: 16rpx;
            }

            .goods-name {
                font-size: 28rpx;
                color: #222;
                font-weight: 500;
                padding: 12rpx 12rpx 0 12rpx;
                line-height: 36rpx;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }

            .goods-desc {
                font-size: 22rpx;
                color: #999;
                padding: 0 12rpx 0 12rpx;
                line-height: 30rpx;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }

            .goods-price {
                font-size: 28rpx;
                color: #FE8D00;
                font-weight: bold;
                padding: 8rpx 12rpx 12rpx 12rpx;
                display: flex;
                align-items: baseline;
                .yuan {
                    font-size: 26rpx;
                    margin-right: 2rpx;
                }
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