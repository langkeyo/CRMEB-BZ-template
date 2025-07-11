<template>
    <view class="category-page">
        <!-- 搜索栏 -->
        <view class="search-bar">
            <view class="search-input flex-center">
                <text class="iconfont icon-sousuo"></text>
                <input type="text" :placeholder="$t('搜索商品名称')" @confirm="searchSubmitValue" confirm-type="search"
                    name="search" placeholder-class="placeholder" />
            </view>
        </view>

        <!-- 主内容区 -->
        <view class="main-content">
            <!-- 左侧分类列表 -->
            <view class="category-list">
                <scroll-view scroll-y="true" scroll-with-animation="true" style="height: 100%;">
                    <view class="category-item" :class="index === activeCategory ? 'active' : ''"
                        v-for="(item, index) in categoryList" :key="index" @click="selectCategory(index, item)">
                        <text>{{ $t(item.cate_name) }}</text>
                    </view>
                </scroll-view>
            </view>

            <!-- 右侧内容区 -->
            <view class="content-area">
                <scroll-view scroll-y="true" style="height: 100%;" scroll-with-animation="true" @scroll="onScroll">
                    <!-- 热门分类 -->
                    <view class="section hot-category">
                        <view class="section-title">
                            <text>热门分类</text>
                        </view>
                        <view class="category-grid">
                            <view class="category-grid-box" v-for="(item, index) in hotCategories" :key="index"
                                @click="navigateToList(item)">
                                <category-grid-item :category="item"></category-grid-item>
                            </view>
                        </view>
                    </view>

                    <!-- 为您推荐 -->
                    <view class="section recommended">
                        <view class="section-title">
                            <text>为您推荐</text>
                        </view>
                        <view class="goods-grid">
                            <view class="goods-item" v-for="(item, index) in recommendedGoods" :key="index">
                                <category-good-item :good="item" @click="navigateToDetail"></category-good-item>
                            </view>
                        </view>
                    </view>

                    <!-- 热门水果/当前分类热门商品 -->
                    <view class="section hot-goods" v-if="currentCategoryGoods.length > 0">
                        <view class="section-title">
                            <text>热门{{ currentCategory.cate_name }}</text>
                        </view>
                        <view class="goods-grid">
                            <view class="goods-item" v-for="(item, index) in currentCategoryGoods" :key="index">
                                <category-good-item :good="item" @click="navigateToDetail"></category-good-item>
                            </view>
                        </view>
                    </view>
                </scroll-view>
            </view>
        </view>

        <!-- 底部导航 -->
        <view class="tab-bar">
            <view class="tab-item" v-for="(item, index) in tabItems" :key="index" @click="switchTab(item)">
                <text class="iconfont" :class="item.icon"></text>
                <text :class="{ 'active-text': item.active }">{{ $t(item.name) }}</text>
            </view>
        </view>
    </view>
</template>

<script>
import { getCategoryList, getProductslist } from '@/api/store.js'
import { mapGetters } from 'vuex'
import CategoryGridItem from '@/components/CategoryGridItem.vue'
import CategoryGoodItem from '@/components/CategoryGoodItem.vue'
import { goShopDetail } from '@/libs/order.js'
import colors from '@/mixins/color'

export default {
    components: {
        CategoryGridItem,
        CategoryGoodItem
    },
    mixins: [colors],
    computed: {
        ...mapGetters(['isLogin', 'uid'])
    },
    data () {
        return {
            categoryList: [], // 分类列表
            activeCategory: 0, // 当前选中的分类索引
            currentCategory: {}, // 当前选中的分类
            hotCategories: [], // 热门分类
            recommendedGoods: [], // 推荐商品
            currentCategoryGoods: [], // 当前分类的热门商品
            isLoading: false,
            pageHeight: '100%',
            tabItems: [
                { name: '首页', icon: 'icon-shouye', path: '/pages/index/index', active: false },
                { name: '分类', icon: 'icon-fenlei', path: '/pages/goods_cate/goods_cate4', active: true },
                { name: '购物车', icon: 'icon-gouwuche', path: '/pages/order_addcart/order_addcart', active: false },
                { name: '我的', icon: 'icon-wode', path: '/pages/user/index', active: false }
            ]
        }
    },
    onLoad () {
        // 获取设备信息适配页面高度
        uni.getSystemInfo({
            success: (res) => {
                this.pageHeight = res.windowHeight + 'px'
            }
        })

        // 初始化数据
        this.initData()
    },
    onShow () {
        // 若需要刷新数据
        if (this.categoryList.length === 0) {
            this.initData()
        }
    },
    onPullDownRefresh () {
        this.initData()
        setTimeout(() => {
            uni.stopPullDownRefresh()
        }, 1000)
    },
    onReachBottom () {
        // 如果需要加载更多商品，可以在这里实现
    },
    mounted () {
        // 监听分类数据更新
        uni.$on('uploadCatData', () => {
            this.initData()
        })
    },
    methods: {
        // 初始化数据
        initData () {
            this.getCategoryList()
            this.getHotCategories()
            this.getRecommendedGoods()
        },

        // 获取分类列表
        getCategoryList () {
            getCategoryList().then(res => {
                this.categoryList = res.data
                if (this.categoryList.length > 0) {
                    this.currentCategory = this.categoryList[0]
                    this.getCategoryGoods(this.currentCategory.id)
                }
            }).catch(err => {
                console.error('获取分类列表失败', err)
            })
        },

        // 获取热门分类
        getHotCategories () {
            // 这里应该调用获取热门分类的接口
            // 暂时使用分类列表前几个作为热门分类
            getCategoryList().then(res => {
                this.hotCategories = res.data.slice(0, 8)
            }).catch(err => {
                console.error('获取热门分类失败', err)
            })
        },

        // 获取推荐商品
        getRecommendedGoods () {
            // 调用获取推荐商品的接口
            getProductslist({
                page: 1,
                limit: 10,
                is_best: 1 // 假设推荐商品使用is_best字段
            }).then(res => {
                this.recommendedGoods = res.data
            }).catch(err => {
                console.error('获取推荐商品失败', err)
            })
        },

        // 获取当前分类的热门商品
        getCategoryGoods (cid) {
            if (!cid) return

            this.isLoading = true
            getProductslist({
                page: 1,
                limit: 10,
                cid: cid,
                is_hot: 1 // 假设热门商品使用is_hot字段
            }).then(res => {
                this.currentCategoryGoods = res.data
                this.isLoading = false
            }).catch(err => {
                console.error('获取分类商品失败', err)
                this.isLoading = false
            })
        },

        // 选择分类
        selectCategory (index, item) {
            this.activeCategory = index
            this.currentCategory = item
            this.getCategoryGoods(item.id)
        },

        // 搜索提交
        searchSubmitValue (e) {
            if (this.$util.trim(e.detail.value).length > 0) {
                uni.navigateTo({
                    url: '/pages/goods/goods_list/index?searchValue=' + e.detail.value
                })
            } else {
                return this.$util.Tips({
                    title: this.$t(`搜索商品名称`)
                })
            }
        },

        // 导航到商品列表页
        navigateToList (item) {
            uni.navigateTo({
                url: `/pages/goods/goods_list/index?cid=${item.id}&title=${item.cate_name}`
            })
        },

        // 导航到商品详情页
        navigateToDetail (item) {
            goShopDetail(item, this.uid).then(() => { }).catch(() => { })
        },

        // 滚动事件
        onScroll (e) {
            // 可以在这里处理滚动事件，例如吸顶效果等
        },

        // 切换底部导航
        switchTab (item) {
            if (item.active) return

            uni.switchTab({
                url: item.path,
                fail () {
                    uni.navigateTo({
                        url: item.path
                    })
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.category-page {
    display: flex;
    flex-direction: column;
    height: 100vh;
    background-color: #f5f5f5;
}

.search-bar {
    padding: 20rpx 30rpx;
    background-color: #fff;
}

.search-input {
    height: 70rpx;
    background-color: #f5f5f5;
    border-radius: 35rpx;
    padding: 0 30rpx;
    display: flex;
    align-items: center;

    .iconfont {
        font-size: 36rpx;
        color: #999;
        margin-right: 10rpx;
    }

    input {
        flex: 1;
        height: 100%;
        font-size: 28rpx;
    }

    .placeholder {
        color: #999;
    }
}

.flex-center {
    display: flex;
    align-items: center;
}

.main-content {
    flex: 1;
    display: flex;
    overflow: hidden;
}

.category-list {
    width: 180rpx;
    height: 100%;
    background-color: #f7f7f7;

    .category-item {
        height: 100rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 28rpx;
        color: #333;
        position: relative;

        &.active {
            background-color: #fff;
            color: var(--view-theme);
            font-weight: bold;

            &::before {
                content: '';
                position: absolute;
                left: 0;
                top: 50%;
                transform: translateY(-50%);
                width: 4rpx;
                height: 40rpx;
                background-color: var(--view-theme);
            }
        }

        text {
            text-align: center;
            padding: 0 20rpx;
        }
    }
}

.content-area {
    flex: 1;
    background-color: #fff;
    padding: 20rpx;
}

.section {
    margin-bottom: 30rpx;
}

.section-title {
    font-size: 32rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 20rpx;
    display: flex;
    align-items: center;

    &::before {
        content: '';
        width: 8rpx;
        height: 30rpx;
        background-color: var(--view-theme);
        margin-right: 10rpx;
        border-radius: 4rpx;
    }
}

.category-grid {
    display: flex;
    flex-wrap: wrap;

    .category-grid-box {
        width: 25%;
    }
}

.goods-grid {
    display: flex;
    flex-wrap: wrap;
    margin: 0 -10rpx;

    .goods-item {
        width: calc(50% - 20rpx);
        margin: 0 10rpx 20rpx;
    }
}

.tab-bar {
    height: 100rpx;
    background-color: #fff;
    border-top: 1rpx solid #eee;
    display: flex;

    .tab-item {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        .iconfont {
            font-size: 40rpx;
            color: #999;
            margin-bottom: 4rpx;
        }

        text {
            font-size: 24rpx;
            color: #999;

            &.active-text {
                color: var(--view-theme);
            }
        }
    }
}
</style>