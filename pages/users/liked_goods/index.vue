<template>
  <view class="liked-goods-page">
    <!-- 使用通用头部导航组件 -->
    <CommonHeader title="已赞商品" @back="goBack"></CommonHeader>

    <!-- 搜索框 -->
    <view class="search-section">
      <view class="search-box">
        <text class="iconfont icon-search search-icon"></text>
        <input class="search-input" placeholder="搜索点赞商品" v-model="searchKeyword" @input="onSearchInput"
          @confirm="searchGoods" />
        <text class="clear-btn" v-if="searchKeyword" @click="clearSearch">×</text>
      </view>
    </view>

    <!-- 加载中状态 -->
    <view class="loading-state" v-if="loading && page === 1">
      <view class="spinner"></view>
      <view class="loading-text">加载中...</view>
    </view>

    <!-- 商品列表 -->
    <view class="goods-list" v-if="goodsList.length > 0">
      <view class="goods-item" v-for="(item, index) in goodsList" :key="index" @click="goToDetail(item)">
        <image class="goods-image" :src="setDomain(item.image)" mode="aspectFill"></image>
        <view class="goods-info">
          <view class="store-name">{{ item.storeName }}</view>
          <view class="goods-name">{{ item.name }}</view>
          <view class="goods-price" v-if="item.price">¥ {{ item.price }}</view>
          <view class="goods-price-empty" v-else>暂无价格</view>
        </view>
        <view class="like-action" @click.stop="toggleLike(index)">
          <text class="iconfont icon-yidianzan"></text>
        </view>
      </view>

      <!-- 底部加载更多 - 只有当总数大于每页限制数时才显示 -->
      <view class="load-more" v-if="totalCount > limit">
        <view v-if="loading && page > 1" class="loading-more">加载中...</view>
        <view v-else-if="finished" class="no-more">没有更多了</view>
      </view>
    </view>

    <!-- 空状态 -->
    <view class="empty-state" v-else-if="!loading">
      <image class="empty-image" src="/static/images/empty-box.png" mode="aspectFit"></image>
      <view class="empty-text">暂无已赞商品</view>
      <view class="goto-shop-btn" @click="gotoShop">去逛逛</view>
    </view>
  </view>
</template>

<script>
import CommonHeader from '@/components/CommonHeader/index.vue'
import { getMyGoodsLikeList, cancelGoodsLike } from '@/api/group.js'
import { HTTP_REQUEST_URL } from '@/config/app.js'

export default {
  components: {
    CommonHeader
  },
  data() {
    return {
      searchKeyword: '',
      originalGoodsList: [], // 原始商品列表
      goodsList: [],
      page: 1,
      limit: 10,
      loading: false,
      finished: false,
      refreshing: false,
      totalCount: 0
    }
  },
  onLoad() {
    // 页面加载时的逻辑
    this.getLikedGoods()
  },
  onPullDownRefresh() {
    // 下拉刷新
    this.page = 1
    this.getLikedGoods()
    setTimeout(() => {
      uni.stopPullDownRefresh()
    }, 1000)
  },
  onReachBottom() {
    // 上拉加载更多
    if (!this.finished && !this.loading) {
      this.page++
      this.getLikedGoods(true)
    }
  },
  methods: {
    // 处理图片URL，拼接域名
    setDomain(url) {
      if (!url) return ''
      url = url.toString()

      // 如果是相对路径，拼接域名
      if (url.indexOf('/') === 0) {
        return HTTP_REQUEST_URL + url
      }

      // 如果已经是完整URL，直接返回
      if (url.indexOf("http") === 0) {
        return url
      }

      // 其他情况拼接域名
      return HTTP_REQUEST_URL + '/' + url
    },
    goBack() {
      uni.navigateBack()
    },
    async getLikedGoods(isLoadMore = false) {
      if (this.loading) return

      this.loading = true

      try {
        const params = {
          type: 1, // 点赞类型：1点赞
          page: this.page,
          limit: this.limit
        }

        const res = await getMyGoodsLikeList(params)

        if (res.data && res.status === 200) {
          const { list, count } = res.data

          // 处理商品数据
          const formattedList = list.map(item => {
            // 处理价格，如果为null则设为空字符串
            let price = item.goods_price
            if (price === null || price === 'null' || price === undefined) {
              price = ''
            }

            return {
              id: item.goods_id,
              storeName: '店铺', // API中没有返回店铺名称
              name: item.goods_title || '未知商品',
              price: price,
              image: item.goods_image || '/static/images/no-goods.png',
              liked: true,
              likeCount: 0,
              likeId: item.id // 保存点赞记录ID
            }
          })

          if (isLoadMore) {
            this.goodsList = [...this.goodsList, ...formattedList]
          } else {
            this.goodsList = formattedList
          }

          this.originalGoodsList = [...this.goodsList]
          this.totalCount = count
          this.finished = this.goodsList.length >= count
        } else {
          // 处理错误情况
          if (res.status === 110002) {
            uni.showToast({
              title: '请先登录',
              icon: 'none'
            })

            // 跳转到登录页
            setTimeout(() => {
              uni.navigateTo({
                url: '/pages/users/login/index'
              })
            }, 1500)
          } else {
            uni.showToast({
              title: res.msg || '获取数据失败',
              icon: 'none'
            })
          }
        }
      } catch (error) {
        uni.showToast({
          title: '获取点赞商品失败',
          icon: 'none'
        })
        console.error('获取点赞商品失败', error)
      } finally {
        this.loading = false
        if (this.refreshing) this.refreshing = false
      }
    },
    async toggleLike(index) {
      // 切换点赞状态
      const item = this.goodsList[index]

      // 显示确认对话框
      uni.showModal({
        title: '确认取消点赞',
        content: '确定要取消对该商品的点赞吗？',
        confirmColor: '#FF8C1B',
        success: async (res) => {
          if (res.confirm) {
            // 用户点击确定
            try {
              // 取消点赞
              await cancelGoodsLike({
                goods_id: item.id
              })

              // 如果取消点赞成功，移除该商品
              uni.showToast({
                title: '已取消点赞',
                icon: 'none'
              })

              setTimeout(() => {
                this.goodsList.splice(index, 1)
                this.originalGoodsList = [...this.goodsList]
              }, 300)

            } catch (error) {
              uni.showToast({
                title: '操作失败，请稍后重试',
                icon: 'none'
              })
              console.error('取消点赞失败', error)
            }
          }
        }
      })
    },
    goToDetail(item) {
      // 跳转到商品详情页，添加必要参数
      uni.navigateTo({
        url: `/pages/goods_details/index?id=${item.id}&type=combination`
      })
    },
    gotoShop() {
      // 跳转到商城首页
      uni.switchTab({
        url: '/pages/index/index'
      })
    },
    onSearchInput() {
      // 实时搜索
      this.searchGoods()
    },
    searchGoods() {
      if (!this.searchKeyword.trim()) {
        // 如果搜索关键词为空，显示所有商品
        this.goodsList = [...this.originalGoodsList]
        return
      }

      // 根据商品名称搜索
      this.goodsList = this.originalGoodsList.filter(item =>
        item.name.toLowerCase().includes(this.searchKeyword.toLowerCase())
      )
    },
    clearSearch() {
      this.searchKeyword = ''
      this.goodsList = [...this.originalGoodsList]
    }
  }
}
</script>

<style lang="scss">
.liked-goods-page {
  min-height: 100vh;
  background-color: #f8f8f8;

  .header {
    height: 88rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    background-color: #fff;
    border-bottom: 1rpx solid #f0f0f0;

    .back-btn {
      position: absolute;
      left: 30rpx;
      display: flex;
      align-items: center;
      z-index: 1;

      .iconfont {
        font-size: 36rpx;
        color: #333;
        margin-right: 16rpx;
      }

      .back-text {
        font-size: 32rpx;
        color: #333;
      }
    }

    .page-title {
      font-size: 36rpx;
      font-weight: 500;
      color: #333;
    }
  }

  .search-section {
    padding: 20rpx;
    background-color: #fff;

    .search-box {
      position: relative;
      display: flex;
      align-items: center;
      background-color: #f7f7f7;
      border-radius: 50rpx;
      padding: 0 30rpx;
      height: 80rpx;

      .search-icon {
        font-size: 32rpx;
        color: #999;
        margin-right: 20rpx;
      }

      .search-input {
        flex: 1;
        font-size: 28rpx;
        color: #333;
        background: transparent;
        border: none;
        outline: none;

        &::placeholder {
          color: #999;
        }
      }

      .clear-btn {
        font-size: 36rpx;
        color: #999;
        margin-left: 20rpx;
        width: 40rpx;
        height: 40rpx;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }

  .loading-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding-top: 200rpx;
    padding-bottom: 200rpx;

    .spinner {
      width: 60rpx;
      height: 60rpx;
      border: 4rpx solid #f3f3f3;
      border-top: 4rpx solid #3498db;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: 20rpx;
    }

    .loading-text {
      font-size: 30rpx;
      color: #999;
    }
  }

  .goods-list {
    padding: 20rpx;

    .goods-item {
      display: flex;
      align-items: flex-start;
      margin-bottom: 20rpx;
      background-color: #fff;
      border-radius: 16rpx;
      overflow: hidden;
      padding: 30rpx 20rpx;
      position: relative;

      .goods-image {
        width: 160rpx;
        height: 160rpx;
        border-radius: 12rpx;
        margin-right: 24rpx;
        flex-shrink: 0;
      }

      .goods-info {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        padding-right: 60rpx; // 为点赞按钮留出空间

        .store-name {
          font-size: 28rpx;
          font-weight: 500;
          color: #333;
          margin-bottom: 8rpx;
        }

        .goods-name {
          font-size: 32rpx;
          font-weight: 600;
          color: #333;
          margin-bottom: 8rpx;
        }

        .goods-desc {
          font-size: 26rpx;
          color: #999;
          margin-bottom: 16rpx;
          line-height: 1.4;
        }

        .goods-price {
          font-size: 36rpx;
          font-weight: 600;
          color: #333;
        }

        .goods-price-empty {
          font-size: 28rpx;
          color: #999;
          font-style: italic;
          margin-top: 4rpx;
        }
      }

      .like-action {
        position: absolute;
        right: 20rpx;
        top: 50%;
        transform: translateY(-50%);
        width: 60rpx;
        height: 60rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, #ffcb8b, #ff8d00);
        border-radius: 50%;
        box-shadow: 0 4rpx 12rpx rgba(255, 141, 0, 0.3);
        transition: all 0.3s ease;

        &:active {
          transform: translateY(-50%) scale(0.9);
        }

        .iconfont {
          font-size: 36rpx;
          color: #fff;
        }
      }
    }

    .load-more {
      display: flex;
      justify-content: center;
      padding-top: 20rpx;
      padding-bottom: 20rpx;

      .loading-more {
        font-size: 28rpx;
        color: #999;
      }

      .no-more {
        font-size: 28rpx;
        color: #999;
      }
    }
  }

  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding-top: 200rpx;

    .empty-image {
      width: 200rpx;
      height: 200rpx;
      margin-bottom: 40rpx;
    }

    .empty-text {
      font-size: 30rpx;
      color: #999;
      margin-bottom: 40rpx;
    }

    .goto-shop-btn {
      width: 200rpx;
      height: 80rpx;
      background: linear-gradient(to right, #ff9000, #ff5000);
      color: #fff;
      border-radius: 40rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 30rpx;
    }
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>