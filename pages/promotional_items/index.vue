<template>
  <view class="hot-group-buys">
    <view class="page-title">{{ $t(`热门团购`) }}</view>
    <view class="search-box">
      <view class="search-input">
        <text class="iconfont icon-sousuo"></text>
        <input
          type="text"
          :placeholder="$t(`请输入商品名称搜索`)"
          disabled
          @tap="goSearch"
        />
      </view>
    </view>
    <view class="group-buy-grid" v-if="groupBuyItems.length > 0">
      <view
        class="grid-item"
        v-for="(item, index) in groupBuyItems"
        :key="index"
        @tap="goToProduct(item.id)"
      >
        <view class="item-image-wrapper">
          <image class="item-image" :src="item.image" mode="aspectFill"></image>
        </view>
        <view class="item-name">{{ item.store_name }}</view>
        <view class="item-price">{{ $t(`￥`) }}{{ item.price }}</view>
      </view>
    </view>
    <view class="empty-state" v-else>
      <text>{{ $t(`暂无热门团购商品`) }}</text>
    </view>
    <recommend-list :hostProduct="hostProduct"></recommend-list>
  </view>
</template>

<script>
// import { getCombinationList } from "@/api/activity";
// import { getProductHot } from "@/api/store";
import recommendList from "@/components/recommend";

export default {
  components: {
    recommendList,
  },
  data() {
    return {
      groupBuyItems: [],
      hostProduct: [],
      page: 1,
      limit: 10,
      loading: false,
      loadend: false,
      loadTitle: this.$t(`加载更多`),
    };
  },
  onLoad() {
    this.fetchGroupBuyItems();
    this.fetchRecommendedProducts();
  },
  onReachBottom() {
    !this.loading && this.fetchGroupBuyItems();
  },
  methods: {
    fetchGroupBuyItems() {
      // 使用模拟数据
      this.loading = true;
      setTimeout(() => {
        const mockGroupBuyItems = [
          {
            id: 1,
            image: "https://via.placeholder.com/160x160.png?text=萝卜",
            store_name: "云南香脆萝卜",
            price: "15-26",
            ot_price: "",
            sales: 123,
          },
          {
            id: 2,
            image: "https://via.placeholder.com/160x160.png?text=香蕉",
            store_name: "海南进口香蕉",
            price: "21-35",
            ot_price: "",
            sales: 456,
          },
          {
            id: 3,
            image: "https://via.placeholder.com/160x160.png?text=小龙虾",
            store_name: "阳澄湖大闸蟹",
            price: "78-88",
            ot_price: "",
            sales: 789,
          },
          {
            id: 4,
            image: "https://via.placeholder.com/160x160.png?text=菠萝",
            store_name: "云南精品菠萝",
            price: "15-26",
            ot_price: "",
            sales: 234,
          },
          {
            id: 5,
            image: "https://via.placeholder.com/160x160.png?text=橙子",
            store_name: "赣南脐橙",
            price: "21-35",
            ot_price: "",
            sales: 567,
          },
          {
            id: 6,
            image: "https://via.placeholder.com/160x160.png?text=青菜",
            store_name: "新鲜有机蔬菜",
            price: "3-6",
            ot_price: "",
            sales: 890,
          },
          {
            id: 7,
            image: "https://via.placeholder.com/160x160.png?text=香菜",
            store_name: "新鲜农家香菜",
            price: "4-8.8",
            ot_price: "",
            sales: 345,
          },
          {
            id: 8,
            image: "https://via.placeholder.com/160x160.png?text=鸡肉",
            store_name: "三黄走地鸡",
            price: "35-46",
            ot_price: "",
            sales: 678,
          },
          {
            id: 9,
            image: "https://via.placeholder.com/160x160.png?text=猪肉",
            store_name: "农家散养猪后腿",
            price: "45-56",
            ot_price: "",
            sales: 901,
          },
        ];
        if (this.page === 1) {
          this.groupBuyItems = mockGroupBuyItems;
        } else {
          // 模拟分页加载更多，实际项目中根据需求调整
          // 这里简单处理，不再添加更多数据，或者可以再造一些分页数据
          // this.groupBuyItems = this.groupBuyItems.concat(mockGroupBuyItems.slice(0,1));
        }
        this.loading = false;
        this.loadend = this.page > 1; // 假设只有一页数据
        this.page += 1;
        this.loadTitle = this.loadend
          ? this.$t(`没有更多内容啦`)
          : this.$t(`加载更多`);
      }, 500);
      return; // 阻止执行原有API调用
      if (this.loading || this.loadend) return;
      if (this.loading || this.loadend) return;
      this.loading = true;
      // getCombinationList({ page: this.page, limit: this.limit })
      //   .then((res) => {
      //     this.loading = false;
      //     const list = res.data.list;
      //     this.groupBuyItems = this.groupBuyItems.concat(list);
      //     this.loadend = list.length < this.limit;
      //     this.page += 1;
      //     this.loadTitle = this.loadend
      //       ? this.$t(`没有更多内容啦`)
      //       : this.$t(`加载更多`);
      //   })
      //   .catch((err) => {
      //     this.loading = false;
      //     uni.showToast({
      //       title: err.msg || this.$t(`加载失败`),
      //       icon: "none",
      //     });
      //   });
    },
    fetchRecommendedProducts() {
      // 使用模拟数据
      const mockHostProduct = [
        {
          id: 101,
          image: "https://via.placeholder.com/150x150.png?text=Rec1",
          store_name: "推荐商品X - 店长力荐，性价比之选",
          price: "79.00",
          ot_price: "129.00",
          activity: null,
        },
        {
          id: 102,
          image: "https://via.placeholder.com/150x150.png?text=Rec2",
          store_name: "推荐商品Y - 新品上市，火热预订中",
          price: "159.00",
          ot_price: "259.00",
          activity: { type: "1" }, // 模拟秒杀
        },
        {
          id: 103,
          image: "https://via.placeholder.com/150x150.png?text=Rec3",
          store_name: "推荐商品Z - 清仓特卖，买到就是赚到",
          price: "39.00",
          ot_price: "89.00",
          activity: { type: "2" }, // 模拟砍价
        },
      ];
      this.hostProduct = mockHostProduct;
      return; // 阻止执行原有API调用
      // getProductHot().then((res) => {
      //   this.hostProduct = res.data.list;
      // });
    },
    goToProduct(id) {
      uni.navigateTo({
        url: `/pages/promotional_items/detail?id=${id}`,
      });
    },
    goSearch() {
      uni.navigateTo({
        url: "/pages/goods_search/index",
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.hot-group-buys {
  padding: 10rpx;
  background-color: #fff;

  .page-title {
    font-size: 36rpx;
    font-weight: bold;
    text-align: center;
    margin: 20rpx 0;
  }

  .search-box {
    padding: 0 20rpx 20rpx;
    .search-input {
      background-color: #f5f5f5;
      border-radius: 40rpx;
      height: 70rpx;
      display: flex;
      align-items: center;
      padding: 0 30rpx;
      .iconfont {
        font-size: 30rpx;
        color: #999;
        margin-right: 10rpx;
      }
      input {
        flex: 1;
        height: 70rpx;
        font-size: 28rpx;
      }
    }
  }

  .group-buy-grid {
    display: flex;
    flex-wrap: wrap;
    padding: 0 10rpx;

    .grid-item {
      width: 33.33%;
      padding: 0 10rpx;
      margin-bottom: 30rpx;
      box-sizing: border-box;

      .item-image-wrapper {
        width: 100%;
        padding-bottom: 100%;
        position: relative;
        border-radius: 50%;
        overflow: hidden;
        margin-bottom: 10rpx;

        .item-image {
          position: absolute;
          width: 100%;
          height: 100%;
          left: 0;
          top: 0;
          border-radius: 50%;
        }
      }

      .item-name {
        font-size: 24rpx;
        color: #333;
        text-align: center;
        margin-bottom: 6rpx;
        height: 68rpx;
        line-height: 34rpx;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .item-price {
        font-size: 26rpx;
        color: #e93323;
        text-align: center;
        font-weight: bold;
      }
    }
  }

  .empty-state {
    text-align: center;
    padding: 50rpx 0;
    color: #999;
    font-size: 28rpx;
  }
}
</style>
