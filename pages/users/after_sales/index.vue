<template>
  <view class="after-sales-page">
    <view class="header">
      <view class="back" @click="goBack">
        <text class="iconfont icon-fanhui"></text>
        <text>返回</text>
      </view>
      <view class="title">售后</view>
    </view>
    <view class="after-sales-list" v-if="orderList.length">
      <view class="card" v-for="(item, index) in orderList" :key="index">
        <view class="card-header">
          <view class="shop-name">{{ item.community_name || '未知社区' }}</view>
          <view class="status">售后</view>
        </view>
        <view class="product-info">
          <image class="product-img" :src="getProductImage(item)" />
          <view class="product-detail">
            <view class="product-title">{{ item.product_title || '未知商品' }}</view>
            <view class="product-desc">售后单号：{{ item.after_sales_no }}</view>
            <view class="refund">状态：{{ item.status_text || '未知状态' }}</view>
          </view>
        </view>
        <view class="card-footer">
          <view class="footer-status">
            <text :class="['status-main', item.status == 1 ? 'status-pending' : 'status-done']">
              {{ item.status_text || '未知状态' }}
            </text>
            <text class="footer-tip">{{ item.create_time_text || '' }}</text>
          </view>
          <button class="detail-btn" @click.stop="goOrderDetails(item.id)">查看详情</button>
        </view>
      </view>
    </view>
    <view v-else class="empty">
      <emptyPage :title="$t('您还没有订单哦~')"></emptyPage>
    </view>
  </view>
</template>

<script>
import emptyPage from '@/components/emptyPage'
import { getAfterSalesList } from '@/api/group.js'
import { toLogin } from '@/libs/login.js'
import { mapGetters } from 'vuex'
export default {
  components: { emptyPage },
  computed: mapGetters(['isLogin']),
  data() {
    return {
      orderList: [],
      loading: false,
      loadend: false,
      page: 1,
      limit: 20,
    }
  },
  onLoad() {
    if (this.isLogin) {
      this.getOrderList()
    } else {
      toLogin()
    }
  },
  methods: {
    goBack() {
      uni.navigateBack()
    },
    goOrderDetails(aftersales_id) {
      if (!aftersales_id) return this.$util.Tips({ title: this.$t('缺少售后单号无法查看详情') })
      uni.navigateTo({ url: '/pages/users/after_sales/detail?id=' + aftersales_id })
    },
    // 安全获取商品图片
    getProductImage(item) {
      if (!item) {
        return '/static/images/default-product.png'
      }

      // 如果有问题图片，使用第一张问题图片作为商品图片
      if (item.problem_images && Array.isArray(item.problem_images) && item.problem_images.length > 0) {
        return item.problem_images[0]
      }

      // 如果有用户头像，使用用户头像
      if (item.user_avatar) {
        return item.user_avatar
      }

      return '/static/images/default-product.png'
    },
    getOrderList() {
      if (this.loading || this.loadend) return
      this.loading = true
      getAfterSalesList({ page: this.page, limit: this.limit }).then(res => {
        this.loading = false
        if (res.status === 200 && res.data && Array.isArray(res.data.list)) {
          const list = res.data.list
          // 确保每个售后项都有基本的数据结构
          const processedList = list.map(item => ({
            ...item,
            product_title: item.product_title || '未知商品',
            community_name: item.community_name || '未知社区',
            status_text: item.status_text || '未知状态',
            after_sales_no: item.after_sales_no || '',
            create_time_text: item.create_time_text || '',
            problem_images: item.problem_images || [],
            solution_images: item.solution_images || []
          }))
          this.orderList = this.orderList.concat(processedList)
          this.loadend = list.length < this.limit
          this.page = this.page + 1
        } else {
          this.loadend = true
        }
      }).catch(err => {
        this.loading = false
        this.loadend = true
        // 处理特定的错误状态码
        if (err && err.data && err.data.status === 400) {
          // 暂无售后数据，不显示错误提示
          return
        }
        // 其他错误显示提示
        this.$util.Tips({
          title: '获取售后列表失败'
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.after-sales-page {
  background: #f5f6fa;
  min-height: 100vh;

  .header {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 90rpx;
    background: #fff;
    position: relative;

    .back {
      position: absolute;
      left: 30rpx;
      top: 0;
      height: 100%;
      display: flex;
      align-items: center;
      color: #333;
      font-size: 30rpx;

      .iconfont {
        font-size: 36rpx;
        margin-right: 8rpx;
      }
    }

    .title {
      font-size: 36rpx;
      font-weight: bold;
      color: #222;
    }
  }

  .after-sales-list {
    padding: 24rpx 16rpx 0 16rpx;

    .card {
      background: #fff;
      border-radius: 16rpx;
      margin-bottom: 24rpx;
      box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.03);
      padding: 24rpx;

      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 30rpx;
        color: #222;
        margin-bottom: 12rpx;

        .shop-name {
          font-weight: bold;
        }

        .status {
          color: #bcbcbc;
          font-size: 28rpx;
        }
      }

      .product-info {
        display: flex;
        align-items: flex-start;

        .product-img {
          width: 120rpx;
          height: 120rpx;
          border-radius: 8rpx;
          margin-right: 18rpx;
        }

        .product-detail {
          flex: 1;

          .product-title {
            font-size: 28rpx;
            color: #222;
            font-weight: 500;
            margin-bottom: 8rpx;
          }

          .product-desc {
            font-size: 26rpx;
            color: #bcbcbc;
            margin-bottom: 8rpx;
          }

          .refund {
            font-size: 26rpx;
            color: #bcbcbc;
          }
        }
      }

      .card-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 18rpx;
        background-color: #F6F7F9;
        padding: 12rpx 16rpx;
        font-family: 'PingFang SC';

        .footer-status {
          display: flex;
          align-items: center;

          .status-main {
            font-size: 32rpx;
            font-weight: bold;
            margin-right: 16rpx;
          }

          .status-done {
            // color: #222;
            color: #333;
            font-weight: bold;
          }

          .status-pending {
            color: #FF9900;
          }

          .footer-tip {
            font-size: 24rpx;
            color: #bcbcbc;
            font-weight: normal;
          }
        }

        .detail-btn {
          background: #fff;
          border: 1rpx solid #bcbcbc;
          border-radius: 32rpx;
          padding: 8rpx 32rpx;
          font-size: 28rpx;
          color: #222;
        }
      }
    }
  }

  .empty {
    margin-top: 120rpx;
  }
}
</style>
