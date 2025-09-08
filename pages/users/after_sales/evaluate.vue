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
                    <!-- 商品信息 -->
                    <view class="goods-info" @click="goOrderGoodsDetail(item)">
                        <image class="goods-img" :src="item.image" mode="aspectFill"></image>
                        <view class="goods-detail">
                            <view class="goods-name">{{ item.goods_name }}</view>
                            <view class="goods-count">{{ $t(`共${item.goods_num_text}件商品`) }}</view>

                            <!-- 评价输入框和按钮 -->
                            <view class="evaluate-input-box">
                                <view class="input-placeholder-bg">
                                    <view class="input-placeholder" @click.stop="openReviewPopup(item)">{{ $t(`展开说说吧`)
                                        }}
                                    </view>
                                </view>
                                <view class="like-btn" :class="{ 'active': item.isLiked }"
                                    @click.stop="toggleLike(item)">
                                    <image class="praise-finger"
                                        :src="item.isLiked ? '/static/icons/like-filled.svg' : '/static/icons/praise-finger.svg'"
                                        mode="widthFix" />
                                </view>
                                <view class="evaluate-btn" @click.stop="goEvaluateEdit(item)">{{ $t(`评价`) }}</view>
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
                <!-- <text class="loading-text" v-else-if="!loadend">{{ $t(`加载更多`) }}</text> -->
            </view>
        </view>

        <!-- 成功提示弹窗 -->
        <view class="success-popup" v-if="showSuccess">
            <view class="success-content">
                <text>{{ $t(`发布成功`) }}</text>
            </view>
        </view>

        <!-- 添加评价弹窗组件 -->
        <ReviewPopup :visible="showReviewPopup" :qa-content-count="qaList.length" @close="closeReviewPopup"
            @search-change="handleSearchChange" @ask-question="handleAskQuestion" ref="reviewPopup">
            <template #buyer>
                <view v-for="item in commentList" :key="item.id" class="buyer-comment">
                    <view style="display:flex;align-items:center;margin-bottom:8rpx;">
                        <image :src="item.avatar"
                            style="width:48rpx;height:48rpx;border-radius:50%;margin-right:12rpx;" />
                        <view>
                            <text style="font-weight:500;">{{ item.nickname || '匿名买家' }}</text>
                            <text style="display:block;font-size:22rpx;color:#999;">{{ item.add_time }}</text>
                        </view>
                    </view>
                    <view style="font-size:28rpx;color:#333;line-height:1.6;margin-bottom:8rpx;">{{ item.comment }}
                    </view>
                    <image v-if="item.pics && item.pics[0]" :src="item.pics[0]"
                        style="width:100%;border-radius:8rpx;" />
                    <view style="display:flex;justify-content:space-between;margin-top:12rpx;">
                        <view style="display:flex;align-items:center;">
                            <image src="/static/icons/share.svg" style="width:32rpx;height:32rpx;margin-right:8rpx;" />
                            <text style="color:#999;font-size:24rpx;">分享</text>
                        </view>
                        <view style="display:flex;align-items:center;" @tap="openCommentInput(item)">
                            <image src="/static/icons/first-to-comment-icon.svg"
                                style="width:32rpx;height:32rpx;margin-right:8rpx;" />
                            <text style="color:#999;font-size:24rpx;">抢沙发</text>
                        </view>
                        <view style="display:flex;align-items:center;" @tap="toggleCommentLike(item)">
                            <image
                                :src="item.user_like_status === 1 ? '/static/icons/like-filled.svg' : '/static/icons/like.svg'"
                                style="width:32rpx;height:32rpx;margin-right:8rpx;" />
                            <text
                                :style="{ color: item.user_like_status === 1 ? '#FF840B' : '#999', fontSize: '24rpx' }">
                                {{ item.like_count > 0 ? item.like_count : '' }}点赞
                            </text>
                        </view>
                    </view>
                </view>
            </template>
            <template #qa>
                <view v-for="qa in qaList" :key="qa.id" class="qa-item">
                    <!-- 问题内容 -->
                    <view class="qa-question">{{ qa.content }}</view>

                    <!-- 提问者信息 -->
                    <view class="qa-user">
                        <image class="qa-avatar" :src="qa.avatar" />
                        <text class="qa-username">{{ qa.nickname }}</text>
                        <text class="qa-time">{{ qa.add_time }}</text>
                    </view>

                    <!-- 提问者分割线 -->
                    <view class="qa-divider"></view>

                    <!-- 回答列表 -->
                    <view class="qa-answers" v-if="qa.answers && qa.answers.length">
                        <view v-for="(answer, index) in qa.answers" :key="index" class="qa-answer">
                            <image class="answer-avatar" :src="answer.avatar || '/static/images/avatar.png'"></image>
                            <text class="answer-text">{{ answer.content }}</text>
                        </view>
                    </view>

                    <!-- 回答按钮 -->
                    <view class="answer-btn" @tap="openAnswerInput(qa)">
                        <text class="answer-btn-text">我来回答</text>
                        <text class="answer-btn-icon iconfont icon-bianji"></text>
                    </view>
                </view>

            </template>
        </ReviewPopup>

        <CommentInput :visible="showCommentInput" :placeholder="inputType === 'question' ? '请输入您的问题...' :
            inputType === 'answer' ? '请输入您的回答...' : '说点什么吧...'" @close="closeCommentInput"
            @submit="handleCommentSubmit" />

        <!-- 移除home组件 -->
    </view>
</template>

<script>
import emptyPage from '@/components/emptyPage'
import { getGroupGoodsList, getGroupOrderList, getGoodsList, addGoodsLike, cancelGoodsLike, getMyGoodsLikeList, createGoodsComment, createGoodsQA, getGoodsQuestionList, getGoodsAnswerList } from '@/api/group.js' // Import correct API functions
import { toLogin } from '@/libs/login.js'
import { mapGetters } from "vuex"
import colors from '@/mixins/color.js'
import { HTTP_REQUEST_URL, TOKENNAME } from '@/config/app.js'
// 引入评价组件
import ReviewPopup from '@/pages/goods_details/components/ReviewPopup.vue'
import CommentInput from '@/pages/goods_details/components/CommentInput.vue'

export default {
    components: {
        emptyPage,
        ReviewPopup,
        CommentInput
    },
    mixins: [colors],
    data() {
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
            showReviewPopup: false, // 评价弹窗显示状态
            showCommentInput: false, // 评论输入框显示状态
            commentList: [
                {
                    id: 1,
                    nickname: '快乐顾客',
                    avatar: '/static/images/avatar.png',
                    add_time: '2023-11-20',
                    comment: '商品质量非常好，包装也很精美，值得购买！',
                    pics: ['/static/images/goods/snack6.png'],
                    like_count: 15,
                    user_like_status: null
                },
                {
                    id: 2,
                    nickname: '购物达人',
                    avatar: '/static/images/avatar.png',
                    add_time: '2023-11-18',
                    comment: '味道不错，物流也很快，下次还会再来光顾！',
                    pics: ['/static/images/goods/snack6.png'],
                    like_count: 8,
                    user_like_status: null
                }
            ], // 评论列表
            qaList: [
                {
                    id: 1,
                    avatar: '/static/images/avatar.png',
                    nickname: '好奇宝宝',
                    add_time: '3分钟前',
                    content: '商品保质期是多久?',
                    answers: [
                        { id: 1, content: '这款产品的保质期是12个月，请查看包装上的生产日期。' }
                    ]
                },
                {
                    id: 2,
                    avatar: '/static/images/avatar.png',
                    nickname: '匿名用户',
                    add_time: '1小时前',
                    content: '这个是纯天然的吗?',
                    answers: []
                }
            ], // 问答列表
            currentItem: null, // 当前正在评价的订单项
            currentQaItem: null, // 当前正在回答的问题项
            inputType: 'comment' // 输入类型：'comment' 评论 或 'question' 提问 或 'answer' 回答
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
    onLoad() {
        if (this.isLogin) {
            this.getOrderList()
            this.getRecommendList()
        } else {
            toLogin()
        }
    },
    onShow() {
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
    onPullDownRefresh() {
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
    onReachBottom() {
        this.getOrderList()
    },
    methods: {
        // 数字转中文大写
        convertNumberToChinese(num) {
            const chineseNums = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九']
            const units = ['', '十', '百', '千']
            const bigUnits = ['', '万', '亿']

            if (num === 0) return chineseNums[0]

            let result = ''
            let numStr = num.toString()
            let zeroFlag = false // 标记是否需要加零

            for (let i = 0; i < numStr.length; i++) {
                let digit = parseInt(numStr[i])
                let pos = numStr.length - i - 1 // 位置（个位为0，十位为1...）

                if (digit === 0) {
                    zeroFlag = true
                    // 在适当的位置添加单位（万、亿）
                    if (pos % 4 === 0 && pos > 0) {
                        result += bigUnits[Math.floor(pos / 4)]
                    }
                } else {
                    // 如果之前有零，且不是单位位，则添加零
                    if (zeroFlag) {
                        result += chineseNums[0]
                        zeroFlag = false
                    }

                    result += chineseNums[digit]

                    // 添加单位（个、十、百、千）
                    if (pos % 4 !== 0) {
                        result += units[pos % 4]
                    }

                    // 添加大单位（万、亿）
                    if (pos % 4 === 0 && pos > 0) {
                        result += bigUnits[Math.floor(pos / 4)]
                    }
                }
            }

            // 特殊处理"一十"的情况，应为"十"
            if (result.startsWith('一十') && num < 20) {
                result = result.substring(1)
            }

            return result
        },

        // 格式化时间
        formatTime(timestamp) {
            if (!timestamp) return ''

            const date = new Date(timestamp * 1000)
            const now = new Date()
            const diff = now.getTime() - date.getTime()
            const minutes = Math.floor(diff / (1000 * 60))
            const hours = Math.floor(diff / (1000 * 60 * 60))
            const days = Math.floor(diff / (1000 * 60 * 60 * 24))

            if (minutes < 1) {
                return '刚刚'
            } else if (minutes < 60) {
                return `${minutes}分钟前`
            } else if (hours < 24) {
                return `${hours}小时前`
            } else if (days < 30) {
                return `${days}天前`
            } else {
                const year = date.getFullYear()
                const month = date.getMonth() + 1
                const day = date.getDate()
                return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`
            }
        },

        // 从日期字符串格式化时间
        formatTimeFromDateString(dateString) {
            if (!dateString) return ''

            const date = new Date(dateString)
            const now = new Date()
            const diff = now.getTime() - date.getTime()
            const minutes = Math.floor(diff / (1000 * 60))
            const hours = Math.floor(diff / (1000 * 60 * 60))
            const days = Math.floor(diff / (1000 * 60 * 60 * 24))

            if (minutes < 1) {
                return '刚刚'
            } else if (minutes < 60) {
                return `${minutes}分钟前`
            } else if (hours < 24) {
                return `${hours}小时前`
            } else if (days < 30) {
                return `${days}天前`
            } else {
                const year = date.getFullYear()
                const month = date.getMonth() + 1
                const day = date.getDate()
                return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`
            }
        },

        // 返回上一页
        goBack() {
            uni.navigateBack()
        },

        // 搜索订单
        searchOrder() {
            if (!this.keyword.trim()) return

            this.page = 1
            this.orderList = []
            this.loadend = false
            this.initialLoading = true
            this.getOrderList()
        },

        // 清空搜索
        clearSearch() {
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
            console.log('切换点赞状态:', item)

            const isLiked = !item.isLiked

            // 使用正确的商品点赞API函数
            const apiFunction = isLiked ? addGoodsLike : cancelGoodsLike

            // 准备API参数
            const apiParams = isLiked ? {
                goods_id: item.goods_id, // 修复：使用正确的goods_id而不是order_id
                community_id: item.community_id || 1, // 如果没有社区ID，默认使用1
                type: 1 // 1表示点赞
            } : {
                goods_id: item.goods_id // 修复：使用正确的goods_id而不是order_id
            }

            apiFunction(apiParams).then(res => {
                // 检查响应结构
                console.log(res)

                if (res.status === 200) {
                    // 成功更新状态
                    item.isLiked = isLiked
                    uni.showToast({
                        title: isLiked ? this.$t('点赞成功') : this.$t('取消点赞成功'),
                        icon: 'none',
                        duration: 1500
                    })
                    
                    // 刷新数据
                    this.page = 1
                    this.orderList = []
                    this.loadend = false
                    this.getOrderList()
                } else {
                    uni.showToast({
                        title: res.msg || this.$t('操作失败'),
                        icon: 'none',
                        duration: 1500
                    })
                }
            }).catch(err => {
                console.error('点赞操作错误:', err)
                // 检查错误响应结构
                const errResponse = err && err.data ? err.data : err

                uni.showToast({
                    title: errResponse.msg || this.$t('网络错误，请重试'),
                    icon: 'none',
                    duration: 1500
                })
            })
        },
        // 展开说说吧：显示弹窗
        openReviewPopup(item) {
            this.currentItem = item // 保存当前商品信息
            this.showReviewPopup = true // 显示评论弹窗

            // 获取商品问答列表
            this.getGoodsQuestions(item.goods_id)
        },

        // 获取商品问答列表
        getGoodsQuestions(goodsId) {
            getGoodsQuestionList(goodsId, {
                page: 1,
                limit: 10
            }).then(res => {
                console.log('问答列表返回数据:', res)
                // 处理标准格式: res.data.list
                if (res.status === 200 && res.data && res.data.list) {
                    // 处理数据以适配模板，并为每个问题获取回答列表
                    const qaPromises = res.data.list.map(qa => {
                        // 为每个问题获取回答列表
                        return getGoodsAnswerList(qa.id, {
                            page: 1,
                            limit: 5
                        }).then(answerRes => {
                            let answers = []
                            if (answerRes.status === 200 && answerRes.data && answerRes.data.list) {
                                answers = answerRes.data.list
                            }
                            return {
                                ...qa,
                                add_time: this.formatTimeFromDateString(qa.create_time) + '提问',
                                answers: answers
                            }
                        }).catch(err => {
                            console.error('获取问题回答列表错误:', err)
                            return {
                                ...qa,
                                add_time: this.formatTimeFromDateString(qa.create_time) + '提问',
                                answers: []
                            }
                        })
                    })

                    // 等待所有问题的回答列表获取完成
                    Promise.all(qaPromises).then(processedQaList => {
                        this.qaList = processedQaList
                        console.log('处理后的qaList:', this.qaList)
                    })
                } else {
                    this.qaList = []
                }
            }).catch(err => {
                console.error('获取商品问答列表错误:', err)
                this.qaList = []
            })
        },

        // 跳转到评价编辑页
        goEvaluateEdit(item) {
            // 跳转到评价编辑页（替换为你的实际页面路径）
            uni.navigateTo({
                url: `/pages/publish/index?orderId=${item.order_id}&goodsId=${item.goods_id}`,
                fail: (err) => {
                    console.error('跳转评价编辑页失败:', err)
                }
            })
        },

        // 关闭评价弹窗
        closeReviewPopup() {
            this.showReviewPopup = false
        },

        // 处理提问按钮点击
        handleAskQuestion() {
            this.openCommentInput(this.currentItem, 'question')
        },

        // 切换到问大家标签
        switchToQaTab() {
            this.$nextTick(() => {
                if (this.$refs.reviewPopup && this.$refs.reviewPopup.switchTab) {
                    this.$refs.reviewPopup.switchTab('qa')
                }
            })
        },

        // 打开评论输入框
        openCommentInput(item, type = 'comment') {
            if (item) {
                this.currentItem = item
            }
            this.inputType = type // 记录输入类型：'comment' 评论 或 'question' 提问
            this.showCommentInput = true
        },

        // 打开回答输入框
        openAnswerInput(qaItem) {
            this.currentQaItem = qaItem
            this.inputType = 'answer' // 设置输入类型为回答
            this.showCommentInput = true
        },

        // 关闭评论输入框
        closeCommentInput() {
            this.showCommentInput = false
        },

        // 处理搜索变化
        handleSearchChange(search) {
            this.keyword = search
            this.searchOrder()
        },

        // 处理评论提交
        handleCommentSubmit(text, rating, files) {
            console.log('评论提交:', text, rating, files)

            if (!text.trim()) {
                uni.showToast({
                    title: this.inputType === 'question' ? '提问内容不能为空' :
                        this.inputType === 'answer' ? '回答内容不能为空' : '评论内容不能为空',
                    icon: 'none'
                })
                return
            }

            // 如果是提问
            if (this.inputType === 'question') {
                // 构造提问数据
                const questionData = {
                    goods_id: this.currentItem.goods_id,
                    qid: 0, // 提问时qid为0
                    content: text
                }

                // 调用API提交提问
                createGoodsQA(questionData).then(res => {
                    if (res.status === 200) {
                        // 关闭评论输入框
                        this.closeCommentInput()

                        // 显示发布成功提示
                        this.showSuccessToast()

                        // 刷新问答列表
                        if (this.currentItem && this.currentItem.goods_id) {
                            this.getGoodsQuestions(this.currentItem.goods_id)
                        }
                    } else {
                        uni.showToast({
                            title: res.msg || '提问失败',
                            icon: 'none'
                        })
                    }
                }).catch(err => {
                    console.error('提问提交失败:', err)
                    uni.showToast({
                        title: '提问提交失败',
                        icon: 'none'
                    })
                })
            }
            // 如果是回答
            else if (this.inputType === 'answer') {
                // 构造回答数据
                const answerData = {
                    goods_id: this.currentItem.goods_id,
                    qid: this.currentQaItem.id, // 回答时qid为问题的id
                    content: text
                }

                // 调用API提交回答
                createGoodsQA(answerData).then(res => {
                    if (res.status === 200) {
                        // 关闭评论输入框
                        this.closeCommentInput()

                        // 显示发布成功提示
                        this.showSuccessToast()

                        // 刷新问答列表
                        if (this.currentItem && this.currentItem.goods_id) {
                            this.getGoodsQuestions(this.currentItem.goods_id)
                        }
                    } else {
                        uni.showToast({
                            title: res.msg || '回答失败',
                            icon: 'none'
                        })
                    }
                }).catch(err => {
                    console.error('回答提交失败:', err)
                    uni.showToast({
                        title: '回答提交失败',
                        icon: 'none'
                    })
                })
            }
            // 如果是评论
            else {
                // 构造评论数据
                const commentData = {
                    comment: text,
                    star_grade: rating,
                    files: files || '',
                    goods_id: this.currentItem.goods_id,
                    order_id: this.currentItem.order_id
                }

                // 调用API提交评论
                createGoodsComment(commentData).then(res => {
                    if (res.status === 200) {
                        // 关闭评论输入框
                        this.closeCommentInput()

                        // 显示发布成功提示
                        this.showSuccessToast()

                        // 刷新问答列表
                        if (this.currentItem && this.currentItem.goods_id) {
                            this.getGoodsQuestions(this.currentItem.goods_id)
                        }

                        // 从待评价列表中移除已评价的商品
                        const index = this.orderList.findIndex(item => item.order_id === this.currentItem.order_id)
                        if (index !== -1) {
                            this.orderList.splice(index, 1)
                        }

                        // 如果列表为空，刷新页面显示空状态
                        if (this.orderList.length === 0) {
                            this.page = 1
                            this.loadend = false
                            this.getOrderList()
                        }
                    } else {
                        uni.showToast({
                            title: res.msg || '评论失败',
                            icon: 'none'
                        })
                    }
                }).catch(err => {
                    console.error('评论提交失败:', err)
                    uni.showToast({
                        title: '评论提交失败',
                        icon: 'none'
                    })
                })
            }
        },

        // 评论点赞切换
        toggleCommentLike(comment) {
            if (!comment.user_like_status) {
                comment.user_like_status = 1
                comment.like_count = (comment.like_count || 0) + 1
                uni.showToast({
                    title: '点赞成功',
                    icon: 'none'
                })
            } else {
                comment.user_like_status = null
                comment.like_count = Math.max(0, (comment.like_count || 1) - 1)
                uni.showToast({
                    title: '取消点赞',
                    icon: 'none'
                })
            }
        },

        // 跳转到商品详情
        goGoodsDetail(goods) {
            uni.navigateTo({
                url: `/pages/goods_details/index?id=${goods.product_id}&type=group&canBuy=true`
            })
        },

        // 跳转到订单商品详情
        goOrderGoodsDetail(item) {
            console.log('跳转到订单商品详情:', item)

            // 使用商品ID跳转到商品详情页
            if (item.goods_id) {
                uni.navigateTo({
                    url: `/pages/goods_details/index?id=${item.goods[0].product_id}&type=group&canBuy=true`
                })
            }
        },

        // 获取待评价订单列表
        getOrderList(isPullDown = false) {
            if (this.loading || this.loadend) return

            this.loading = true

            // 只有非下拉刷新时才显示loading
            if (!isPullDown) {
                uni.showLoading({
                    title: this.$t(`加载中`)
                })
            }

            // 使用导入的API函数获取待评价订单
            return new Promise((resolve, reject) => {
                getGroupOrderList({
                    page: this.page,
                    limit: this.limit,
                    status: 2, // 已完成状态的订单可以评价
                    search: this.keyword
                }).then(res => {
                    if (res.status === 200) {
                        const list = res.data.list || []

                        // 处理订单数据，添加点赞状态字段
                        const formattedList = list.map(item => {
                            // 获取商品信息
                            const goodsItem = item.goods && item.goods.length > 0 ? item.goods[0] : null
                            // 计算商品总数量
                            const goodsNum = item.goods && item.goods.length > 0 ?
                                item.goods.reduce((total, goods) => total + (goods.quantity || 0), 0) : 0
                            return {
                                ...item,
                                // store_name: '社区团购', // 移除店铺名称
                                image: goodsItem ? (goodsItem.image.startsWith('http') ? goodsItem.image : HTTP_REQUEST_URL + goodsItem.image) : '/static/images/goods/default.png',
                                goods_name: goodsItem ? goodsItem.title : '商品名称',
                                goods_id: goodsItem ? goodsItem.goods_id : null, // 添加goods_id字段
                                goods_num: goodsNum || 1, // 添加商品数量字段，默认为1
                                goods_num_text: this.convertNumberToChinese(goodsNum || 1), // 添加商品数量中文文本
                                unique: item.order_number,
                                order_id: item.id,
                                community_id: item.community_id || 1, // 确保有社区ID
                                isLiked: false // 默认未点赞
                            }
                        })

                        this.orderList = this.page === 1 ? formattedList : this.orderList.concat(formattedList)
                        this.loadend = formattedList.length < this.limit
                        this.loading = false
                        this.initialLoading = false
                        this.page++

                        // 检查收藏状态
                        this.checkCollectionStatus()

                        uni.hideLoading()
                        resolve(formattedList)
                    } else {
                        this.loading = false
                        this.initialLoading = false
                        uni.hideLoading()
                        this.$util.Tips({
                            title: res.msg || this.$t(`加载失败`)
                        })
                        resolve([]) // Use resolve instead of reject to avoid unhandled promise rejection
                    }
                }).catch(err => {
                    this.loading = false
                    this.initialLoading = false
                    uni.hideLoading()
                    this.$util.Tips({
                        title: this.$t(`网络错误，请稍后重试`)
                    })
                    resolve([]) // Use resolve instead of reject to avoid unhandled promise rejection
                })
            })
        },

        // 检查点赞状态
        checkCollectionStatus() {
            if (!this.orderList.length) return

            // 使用正确的API获取我的点赞列表
            getMyGoodsLikeList({
                type: 1, // 1表示点赞
                page: 1,
                limit: 50 // 获取足够多的点赞记录
            }).then(res => {
                if ((res.code === 200 || res.status === 200) && res.data && res.data.list) {
                    // 获取已点赞的商品ID列表
                    const likedGoodsIds = res.data.list.map(item => parseInt(item.goods_id))

                    // 更新订单列表中的点赞状态
                    this.orderList.forEach(item => {
                        item.isLiked = likedGoodsIds.includes(item.goods_id)
                    })
                }
            }).catch(err => {
                console.error('获取点赞列表失败:', err)
            })
        },

        // 获取推荐商品列表 - 使用商品列表接口
        getRecommendList() {
            return new Promise((resolve, reject) => {
                // 使用API函数获取推荐商品
                getGoodsList({
                    page: 1,
                    limit: 6,
                    is_recommend: 1 // 获取推荐商品
                }).then(res => {
                    if (res.status === 200 && res.data && res.data.goodsList) {
                        // 处理商品数据，根据实际接口返回的数据结构调整
                        this.recommendGoods = res.data.goodsList.map(item => {
                            return {
                                id: item.id,
                                store_name: item.title,
                                desc: `销量 ${item.total_sales || 0}`,
                                price: item.min_price,
                                image: item.image.startsWith('http') ? item.image : HTTP_REQUEST_URL + item.image
                            }
                        })
                    } else {
                        // 如果API没有返回数据，使用模拟数据
                        this.setMockRecommendGoods()
                    }
                    resolve(this.recommendGoods)
                }).catch(err => {
                    // 发生错误时使用模拟数据
                    this.setMockRecommendGoods()
                    console.error('获取推荐商品失败:', err)
                    resolve(this.recommendGoods)
                })
            })
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
            ]
        },

        // 显示成功提示
        showSuccessToast() {
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
    background-color: #fff;

    .store-item {
        padding: 30rpx 0;
        position: relative;

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
                position: relative;

                .praise-finger {
                    width: 48rpx;
                    height: 48rpx;
                    display: block;
                    transition: all 0.3s;
                }

                &.active .praise-finger {
                    transform: scale(1.1);
                }

                // 添加点击动画效果
                &:active {
                    .praise-finger {
                        transform: scale(0.9);
                    }
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
                font-weight: 500;
                margin-left: 0;
                box-shadow: 0 4rpx 8rpx rgba(255, 140, 27, 0.3);
                transition: all 0.3s ease;
            }

            .evaluate-btn:active {
                transform: scale(0.95);
                background-color: #e07a17;
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
            box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.04);

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

/* 问答样式 */
.qa-item {
    padding: 24rpx 0;
    border-bottom: 1px solid #f5f5f5;
}

.qa-user {
    display: flex;
    align-items: center;
    margin-bottom: 16rpx;
}

.qa-avatar {
    width: 40rpx;
    height: 40rpx;
    border-radius: 50%;
    margin-right: 16rpx;
}

.qa-username {
    font-size: 28rpx;
    color: #333;
    font-weight: 500;
}

.qa-time {
    font-size: 24rpx;
    color: #999;
    margin-left: 16rpx;
}

.qa-question {
    font-size: 28rpx;
    color: #000;
    line-height: 1.5;
    margin-bottom: 16rpx;
    font-family: 'PingFang SC';
}

.qa-answers {
    margin-top: 16rpx;
    background: transparent;
    padding: 0;
}

.qa-divider {
    height: 1rpx;
    background-color: #f5f5f5;
    margin: 16rpx 0;
}

.qa-answer {
    font-size: 26rpx;
    color: #666;
    background: transparent;
    padding: 0;
    border-radius: 0;
    margin-bottom: 12rpx;
    display: flex;
    align-items: center;
}


.answer-avatar {
    width: 40rpx;
    height: 40rpx;
    border-radius: 50%;
    margin-right: 16rpx;
    flex-shrink: 0;
}

.answer-text {
    flex: 1;
    display: flex;
    align-items: center;
}

.qa-ask-button {
    margin-top: 40rpx;
    height: 80rpx;
    background-color: #FF8C1B;
    border-radius: 40rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 20rpx;
}

.qa-ask-text {
    color: white;
    font-size: 28rpx;
}

/* 买家评论样式 */
.buyer-comment {
    padding: 24rpx 0;
    border-bottom: 1px solid #f5f5f5;
}

/* 回答按钮样式 */
.answer-btn {
    height: 60rpx;
    padding: 0 20rpx;
    background-color: #FFA54E;
    /* 降低饱和度的橙色 */
    color: #FFFFFF;
    border-radius: 30rpx;
    /* 圆角矩形 */
    font-size: 24rpx;
    font-family: 'PingFang SC';
    font-weight: 400;
    margin: 20rpx 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
}

.answer-btn:active {
    transform: scale(0.95);
    background-color: #e07a17;
}

.answer-btn-text {
    margin-right: 8rpx;
}

.answer-btn-icon {
    font-size: 24rpx;
}
</style>