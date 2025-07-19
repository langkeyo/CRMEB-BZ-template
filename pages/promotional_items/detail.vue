<template>
  <view class="product-detail" :style="colorStyle">
    <!-- 商品图片轮播 -->
    <view class="product-swiper">
      <swiper
        class="swiper"
        :indicator-dots="true"
        :autoplay="true"
        :interval="3000"
        :duration="500"
      >
        <swiper-item>
          <image
            src="https://via.placeholder.com/750x750.png?text=小龙虾"
            mode="aspectFill"
            class="slide-image"
          ></image>
        </swiper-item>
        <swiper-item>
          <image
            src="https://via.placeholder.com/750x750.png?text=小龙虾2"
            mode="aspectFill"
            class="slide-image"
          ></image>
        </swiper-item>
        <swiper-item>
          <image
            src="https://via.placeholder.com/750x750.png?text=小龙虾3"
            mode="aspectFill"
            class="slide-image"
          ></image>
        </swiper-item>
      </swiper>
    </view>

    <!-- 商品信息 -->
    <view class="product-info">
      <view class="price-section">
        <view class="current-price">{{ $t(`￥`) }}{{ product.price }}</view>
        <view class="original-price"
          >{{ $t(`￥`) }}{{ product.original_price }}</view
        >
        <view class="share-btn">
          <text class="iconfont icon-fenxiang"></text>
        </view>
      </view>
      <view class="product-name">{{ product.store_name }}</view>
      <view class="product-desc">{{ product.description }}</view>
      <view class="sales-info">
        <view class="stock-info">
          <text
            >{{ $t(`库存`) }}: {{ product.stock
            }}{{ $t(product.unit_name) }}</text
          >
          <text>{{ $t(`已选`) }}: {{ selectedAttr || $t(`请选择规格`) }}</text>
        </view>
        <text
          >{{ $t(`销量`) }}: {{ product.sales
          }}{{ $t(product.unit_name) }}</text
        >
      </view>
    </view>

    <!-- 规格选择 -->
    <view class="product-attr" @tap="showAttrPopup">
      <view class="attr-title">{{ $t(`规格`) }}</view>
      <view class="attr-content">
        <text>{{ selectedAttr || $t(`请选择规格`) }}</text>
        <text class="iconfont icon-jiantou"></text>
      </view>
    </view>

    <!-- 商品详情 -->
    <view class="detail-section">
      <view class="section-title">{{ $t(`商品详情`) }}</view>
      <view class="detail-content">
        <rich-text :nodes="product.content"></rich-text>
        <view class="detail-images">
          <image
            src="https://via.placeholder.com/750x500.png?text=详情图1"
            mode="widthFix"
          ></image>
          <image
            src="https://via.placeholder.com/750x500.png?text=详情图2"
            mode="widthFix"
          ></image>
          <image
            src="https://via.placeholder.com/750x500.png?text=详情图3"
            mode="widthFix"
          ></image>
        </view>
      </view>
    </view>

    <!-- 用户评价 -->
    <view class="review-section">
      <view class="section-title"
        >{{ $t(`用户评价`) }} ({{ product.review_count }})</view
      >
      <view
        class="review-list"
        v-if="product.reviews && product.reviews.length > 0"
      >
        <view
          class="review-item"
          v-for="(review, index) in product.reviews"
          :key="index"
        >
          <view class="reviewer-info">
            <image class="avatar" :src="review.avatar"></image>
            <text class="nickname">{{ review.nickname }}</text>
            <view class="stars">
              <text
                class="iconfont icon-shoucang1"
                v-for="n in review.star"
                :key="n"
              ></text>
            </view>
          </view>
          <view class="review-content">{{ review.content }}</view>
          <view
            class="review-images"
            v-if="review.images && review.images.length > 0"
          >
            <image
              v-for="(img, imgIndex) in review.images"
              :key="imgIndex"
              :src="img"
              mode="aspectFill"
            ></image>
          </view>
          <view class="review-time">{{ review.time }}</view>
        </view>
      </view>
      <view class="empty-review" v-else>
        <text>{{ $t(`暂无评价`) }}</text>
      </view>
    </view>

    <!-- 推荐商品 -->
    <recommend-list :hostProduct="relatedProducts"></recommend-list>

    <!-- 底部操作栏 -->
    <view class="bottom-bar">
      <view class="left-btns">
        <view class="btn-item">
          <text class="iconfont icon-kefu"></text>
          <text>{{ $t(`客服`) }}</text>
        </view>
        <view class="btn-item">
          <text class="iconfont icon-shoucang"></text>
          <text>{{ $t(`收藏`) }}</text>
        </view>
        <view class="btn-item" @tap="goToCart">
          <text class="iconfont icon-gouwuche"></text>
          <text>{{ $t(`购物车`) }}</text>
        </view>
      </view>
      <view class="right-btns">
        <view class="add-cart-btn" @tap="addToCart">{{
          $t(`加入购物车`)
        }}</view>
        <view class="buy-now-btn" @tap="buyNow">{{ $t(`立即购买`) }}</view>
      </view>
    </view>

    <!-- 规格选择弹窗 -->
    <uni-popup ref="attrPopup" type="bottom">
      <view class="attr-popup">
        <view class="popup-header">
          <image class="product-image" :src="product.image"></image>
          <view class="popup-product-info">
            <view class="popup-price">{{ $t(`￥`) }}{{ product.price }}</view>
            <view class="popup-stock">
              {{ $t(`库存`) }}: {{ product.stock }}{{ $t(product.unit_name) }}
              <text class="popup-selected"
                >{{ $t(`已选`) }}: {{ selectedAttr || $t(`请选择规格`) }}</text
              >
            </view>
          </view>
          <text
            class="close-icon iconfont icon-guanbi"
            @tap="hideAttrPopup"
          ></text>
        </view>

        <view class="attr-list">
          <view class="attr-group">
            <view class="attr-group-name">规格</view>
            <view class="attr-group-values">
              <view
                class="attr-value"
                :class="{ active: isAttrSelected('规格', '公蟹4.0-4.5两') }"
                @tap="selectAttr('规格', '公蟹4.0-4.5两')"
              >
                公蟹4.0-4.5两
              </view>
              <view
                class="attr-value"
                :class="{ active: isAttrSelected('规格', '母蟹3.0-3.5两') }"
                @tap="selectAttr('规格', '母蟹3.0-3.5两')"
              >
                母蟹3.0-3.5两
              </view>
              <view
                class="attr-value"
                :class="{ active: isAttrSelected('规格', '公蟹5.0-5.5两') }"
                @tap="selectAttr('规格', '公蟹5.0-5.5两')"
              >
                公蟹5.0-5.5两
              </view>
              <view
                class="attr-value"
                :class="{ active: isAttrSelected('规格', '母蟹3.5-4.0两') }"
                @tap="selectAttr('规格', '母蟹3.5-4.0两')"
              >
                母蟹3.5-4.0两
              </view>
            </view>
          </view>

          <view class="attr-group">
            <view class="attr-group-name">数量</view>
            <view class="attr-group-values">
              <view
                class="attr-value"
                :class="{ active: isAttrSelected('数量', '4只装') }"
                @tap="selectAttr('数量', '4只装')"
              >
                4只装
              </view>
              <view
                class="attr-value"
                :class="{ active: isAttrSelected('数量', '6只装') }"
                @tap="selectAttr('数量', '6只装')"
              >
                6只装
              </view>
              <view
                class="attr-value"
                :class="{ active: isAttrSelected('数量', '8只装') }"
                @tap="selectAttr('数量', '8只装')"
              >
                8只装
              </view>
              <view
                class="attr-value"
                :class="{ active: isAttrSelected('数量', '10只装') }"
                @tap="selectAttr('数量', '10只装')"
              >
                10只装
              </view>
            </view>
          </view>
        </view>

        <view class="quantity-selector">
          <view class="quantity-label">数量</view>
          <view class="quantity-control">
            <text
              class="minus"
              :class="{ disabled: quantity <= 1 }"
              @tap="decreaseQuantity"
              >-</text
            >
            <input type="number" v-model="quantity" class="quantity-input" />
            <text class="plus" @tap="increaseQuantity">+</text>
          </view>
        </view>

        <view class="popup-buttons">
          <view class="popup-add-cart" @tap="confirmAddToCart">{{
            $t(`加入购物车`)
          }}</view>
          <view class="popup-buy-now" @tap="confirmBuyNow">{{
            $t(`立即购买`)
          }}</view>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script>
import recommendList from "@/components/recommend";
import { mapGetters } from "vuex";
import colors from "@/mixins/color";
import { getGroupGoodsDetail } from "@/api/group.js";

export default {
  components: {
    recommendList,
  },
  mixins: [colors],
  data() {
    return {
      id: null,
      productType: 'normal', // 商品类型：normal-普通商品，group-团购商品
      product: {
        id: 3,
        image: "https://via.placeholder.com/750x750.png?text=小龙虾",
        store_name: "阳澄湖大闸蟹",
        description:
          "阳澄湖大闸蟹，产自太湖流域的阳澄湖，肉质鲜美，膏黄肉肥，营养丰富，是秋季美食的首选。",
        price: "78-88",
        original_price: "108",
        sales: 789,
        stock: 1000,
        unit_name: "只",
        content:
          "<p>阳澄湖大闸蟹，又名金爪蟹，产自太湖流域的阳澄湖，是中国传统名产。</p><p>阳澄湖大闸蟹以个大、肉肥、膏黄、味鲜、壳薄、毛短、脚长、青背、白肚、金爪而著称。</p>",
        review_count: 2,
        reviews: [
          {
            avatar: "https://via.placeholder.com/50x50",
            nickname: "用户1234",
            star: 5,
            content: "蟹黄饱满，肉质鲜美，非常满意！",
            images: [
              "https://via.placeholder.com/100x100?text=评价图1",
              "https://via.placeholder.com/100x100?text=评价图2",
            ],
            time: "2023-10-15",
          },
          {
            avatar: "https://via.placeholder.com/50x50",
            nickname: "美食爱好者",
            star: 4,
            content: "包装很好，蟹很新鲜，就是有点小贵。",
            images: [],
            time: "2023-10-10",
          },
        ],
        attr_groups: [
          {
            name: "规格",
            values: [
              "公蟹4.0-4.5两",
              "母蟹3.0-3.5两",
              "公蟹5.0-5.5两",
              "母蟹3.5-4.0两",
            ],
          },
          {
            name: "数量",
            values: ["4只装", "6只装", "8只装", "10只装"],
          },
        ],
      },
      relatedProducts: [
        {
          id: 101,
          image: "https://via.placeholder.com/150x150.png?text=相关商品1",
          store_name: "帝王蟹 - 顶级海鲜，鲜甜可口",
          price: "299.00",
          ot_price: "399.00",
          activity: null,
        },
        {
          id: 102,
          image: "https://via.placeholder.com/150x150.png?text=相关商品2",
          store_name: "澳洲龙虾 - 鲜活发货，肉质紧实",
          price: "188.00",
          ot_price: "258.00",
          activity: { type: "1" }, // 模拟秒杀
        },
        {
          id: 103,
          image: "https://via.placeholder.com/150x150.png?text=相关商品3",
          store_name: "海参礼盒 - 送礼佳品，营养丰富",
          price: "468.00",
          ot_price: "598.00",
          activity: { type: "2" }, // 模拟砍价
        },
      ],
      selectedAttr: "",
      selectedAttrs: {},
      quantity: 1,
    };
  },
  computed: {
    ...mapGetters(["isLogin"]),
  },
  onLoad(options) {
    if (options.id) {
      this.id = options.id;
      this.productType = options.type || 'normal'; // 获取商品类型
      this.getProductDetail();
    }
  },
  methods: {
    // 获取商品详情
    getProductDetail() {
      if (this.productType === 'group') {
        this.getGroupProductDetail();
      } else {
        // 原有的普通商品详情获取逻辑
        console.log('获取普通商品详情:', this.id);
      }
    },

    // 获取团购商品详情
    getGroupProductDetail() {
      getGroupGoodsDetail(this.id).then(res => {
        if (res.status === 200 && res.data) {
          // 将API返回的数据转换为页面需要的格式
          const apiData = res.data;
          this.product = {
            id: apiData.id,
            image: apiData.image || "https://via.placeholder.com/750x750.png?text=商品图片",
            store_name: apiData.title,
            description: apiData.description || "暂无描述",
            price: apiData.min_price + (apiData.max_price !== apiData.min_price ? '-' + apiData.max_price : ''),
            original_price: apiData.max_price,
            sales: apiData.sales || 0,
            stock: 1000, // 默认库存
            unit_name: "件",
            content: apiData.description || "<p>暂无详细描述</p>",
            review_count: 0,
            reviews: [],
            attr_groups: [
              {
                name: "规格",
                values: ["默认规格"]
              }
            ]
          };
        }
      }).catch(err => {
        console.log('获取团购商品详情失败:', err);
        uni.showToast({
          title: '获取商品详情失败',
          icon: 'none'
        });
      });
    },
    getProductDetail() {
      // 在实际应用中，这里应该调用API获取商品详情
      // 目前使用模拟数据
      console.log("获取商品ID:", this.id, "的详情");
      // 如果需要，可以根据ID匹配不同的模拟数据
    },
    showAttrPopup() {
      this.$refs.attrPopup.open();
    },
    hideAttrPopup() {
      this.$refs.attrPopup.close();
    },
    selectAttr(groupName, value) {
      this.selectedAttrs[groupName] = value;
      this.updateSelectedAttrText();
    },
    isAttrSelected(groupName, value) {
      return this.selectedAttrs[groupName] === value;
    },
    updateSelectedAttrText() {
      const selectedValues = Object.values(this.selectedAttrs);
      if (selectedValues.length > 0) {
        this.selectedAttr = selectedValues.join(", ");
      } else {
        this.selectedAttr = "";
      }
    },
    increaseQuantity() {
      this.quantity++;
    },
    decreaseQuantity() {
      if (this.quantity > 1) {
        this.quantity--;
      }
    },
    addToCart() {
      if (!this.isLogin) {
        this.toLogin();
        return;
      }
      this.showAttrPopup();
    },
    buyNow() {
      if (!this.isLogin) {
        this.toLogin();
        return;
      }
      this.showAttrPopup();
    },
    confirmAddToCart() {
      if (!this.checkAttrSelected()) return;

      uni.showToast({
        title: this.$t(`已加入购物车`),
        icon: "success",
      });
      this.hideAttrPopup();
    },
    confirmBuyNow() {
      if (!this.checkAttrSelected()) return;

      // 跳转到确认订单页面
      uni.navigateTo({
        url: `/pages/goods/order_confirm/index?productId=${this.product.id}&quantity=${this.quantity}`,
      });
      this.hideAttrPopup();
    },
    checkAttrSelected() {
      const attrGroups = this.product.attr_groups;
      for (let group of attrGroups) {
        if (!this.selectedAttrs[group.name]) {
          uni.showToast({
            title: this.$t(`请选择`) + group.name,
            icon: "none",
          });
          return false;
        }
      }
      return true;
    },
    toLogin() {
      uni.navigateTo({
        url: "/pages/users/login/index",
      });
    },
    goToCart() {
      uni.switchTab({
        url: "/pages/order_addcart/order_addcart",
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.product-detail {
  padding-bottom: 100rpx;
  background-color: #f5f5f5;
}

.product-swiper {
  width: 100%;
  height: 750rpx;

  .swiper {
    width: 100%;
    height: 100%;

    .slide-image {
      width: 100%;
      height: 100%;
    }
  }
}

.product-info {
  padding: 30rpx;
  background-color: #fff;
  margin-bottom: 20rpx;

  .price-section {
    display: flex;
    align-items: center;
    margin-bottom: 20rpx;

    .current-price {
      font-size: 48rpx;
      color: #e93323;
      font-weight: bold;
      margin-right: 20rpx;
    }

    .original-price {
      font-size: 28rpx;
      color: #999;
      text-decoration: line-through;
    }

    .share-btn {
      margin-left: auto;

      .iconfont {
        font-size: 40rpx;
        color: #666;
      }
    }
  }

  .product-name {
    font-size: 32rpx;
    color: #333;
    font-weight: bold;
    margin-bottom: 15rpx;
  }

  .product-desc {
    font-size: 28rpx;
    color: #666;
    margin-bottom: 20rpx;
    line-height: 1.5;
  }

  .sales-info {
    display: flex;
    justify-content: space-between;
    font-size: 24rpx;
    color: #999;

    .stock-info {
      display: flex;
      flex-direction: column;

      text {
        margin-bottom: 5rpx;
      }
    }
  }
}

.product-attr {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx;
  background-color: #fff;
  margin-bottom: 20rpx;

  .attr-title {
    font-size: 28rpx;
    color: #333;
  }

  .attr-content {
    display: flex;
    align-items: center;
    font-size: 26rpx;
    color: #666;

    .iconfont {
      margin-left: 10rpx;
      font-size: 24rpx;
    }
  }
}

.detail-section,
.review-section {
  background-color: #fff;
  margin-bottom: 20rpx;
  padding: 30rpx;

  .section-title {
    font-size: 32rpx;
    color: #333;
    font-weight: bold;
    margin-bottom: 20rpx;
    position: relative;
    padding-left: 20rpx;

    &:before {
      content: "";
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 6rpx;
      height: 30rpx;
      background-color: #e93323;
      border-radius: 3rpx;
    }
  }

  .detail-content {
    font-size: 28rpx;
    color: #666;
    line-height: 1.8;

    .detail-images {
      margin-top: 20rpx;

      image {
        width: 100%;
        margin-bottom: 20rpx;
      }
    }
  }
}

.review-list {
  .review-item {
    padding: 20rpx 0;
    border-bottom: 1px solid #eee;

    &:last-child {
      border-bottom: none;
    }

    .reviewer-info {
      display: flex;
      align-items: center;
      margin-bottom: 15rpx;

      .avatar {
        width: 60rpx;
        height: 60rpx;
        border-radius: 50%;
        margin-right: 15rpx;
      }

      .nickname {
        font-size: 26rpx;
        color: #333;
        margin-right: 20rpx;
      }

      .stars {
        .iconfont {
          color: #ff9900;
          font-size: 24rpx;
          margin-right: 5rpx;
        }
      }
    }

    .review-content {
      font-size: 28rpx;
      color: #333;
      line-height: 1.5;
      margin-bottom: 15rpx;
    }

    .review-images {
      display: flex;
      flex-wrap: wrap;
      margin-bottom: 15rpx;

      image {
        width: 150rpx;
        height: 150rpx;
        margin-right: 10rpx;
        margin-bottom: 10rpx;
        border-radius: 8rpx;
      }
    }

    .review-time {
      font-size: 24rpx;
      color: #999;
    }
  }
}

.empty-review {
  text-align: center;
  padding: 30rpx 0;
  color: #999;
  font-size: 28rpx;
}

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100rpx;
  background-color: #fff;
  display: flex;
  align-items: center;
  z-index: 99;
  box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);

  .left-btns {
    display: flex;
    width: 40%;
    height: 100%;

    .btn-item {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      .iconfont {
        font-size: 40rpx;
        color: #666;
        margin-bottom: 5rpx;
      }

      text {
        font-size: 22rpx;
        color: #666;
      }
    }
  }

  .right-btns {
    display: flex;
    width: 60%;
    height: 100%;
    padding: 10rpx;

    .add-cart-btn,
    .buy-now-btn {
      flex: 1;
      height: 80rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 28rpx;
      border-radius: 40rpx;
      margin-left: 10rpx;
    }

    .add-cart-btn {
      background-color: #fef0f0;
      color: #e93323;
      border: 1px solid #e93323;
    }

    .buy-now-btn {
      background-color: #e93323;
      color: #fff;
    }
  }
}

.attr-popup {
  background-color: #fff;
  border-radius: 20rpx 20rpx 0 0;
  padding-bottom: 30rpx;

  .popup-header {
    display: flex;
    padding: 30rpx;
    border-bottom: 1px solid #f5f5f5;
    position: relative;

    .product-image {
      width: 180rpx;
      height: 180rpx;
      border-radius: 10rpx;
    }

    .popup-product-info {
      flex: 1;
      margin-left: 20rpx;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .popup-price {
        font-size: 36rpx;
        color: #e93323;
        font-weight: bold;
      }

      .popup-stock {
        font-size: 26rpx;
        color: #666;
        display: flex;
        flex-direction: column;

        .popup-selected {
          margin-top: 10rpx;
          color: #666;
        }
      }
    }

    .close-icon {
      position: absolute;
      top: 20rpx;
      right: 20rpx;
      font-size: 40rpx;
      color: #999;
    }
  }

  .attr-list {
    padding: 20rpx 30rpx;

    .attr-group {
      margin-bottom: 30rpx;

      .attr-group-name {
        font-size: 28rpx;
        color: #333;
        margin-bottom: 20rpx;
      }

      .attr-group-values {
        display: flex;
        flex-wrap: wrap;

        .attr-value {
          padding: 10rpx 30rpx;
          background-color: #f7f7f7;
          border-radius: 8rpx;
          margin-right: 20rpx;
          margin-bottom: 20rpx;
          font-size: 26rpx;
          color: #333;
          border: 1px solid transparent;

          &.active {
            background-color: #fff;
            color: #e93323;
            border: 1px solid #e93323;
          }
        }
      }
    }
  }

  .quantity-selector {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 30rpx 30rpx;
    border-bottom: 1px solid #f5f5f5;

    .quantity-label {
      font-size: 28rpx;
      color: #333;
    }

    .quantity-control {
      display: flex;
      align-items: center;

      .minus,
      .plus {
        width: 60rpx;
        height: 60rpx;
        background-color: #f7f7f7;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 40rpx;
        border-radius: 8rpx;

        &.disabled {
          color: #ccc;
        }
      }

      .quantity-input {
        width: 80rpx;
        height: 60rpx;
        text-align: center;
        margin: 0 10rpx;
        background-color: #f7f7f7;
        border-radius: 8rpx;
      }
    }
  }

  .popup-buttons {
    display: flex;
    padding: 30rpx;

    .popup-add-cart,
    .popup-buy-now {
      flex: 1;
      height: 80rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 28rpx;
      border-radius: 40rpx;
    }

    .popup-add-cart {
      background-color: #fef0f0;
      color: #e93323;
      margin-right: 20rpx;
    }

    .popup-buy-now {
      background-color: #e93323;
      color: #fff;
    }
  }
}
</style>
