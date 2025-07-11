<template>
  <view class="pending-delivery-container" :style="colorStyle">
    <!-- 顶部导航栏 -->
    <view class="header">
      <view class="status-bar"></view>
      <view class="nav-bar">
        <view class="left" @click="goBack">
          <image class="back-icon" src="/static/images/order/back_arrow.svg" mode="widthFix"></image>
          <text>返回</text>
        </view>
        <view class="title">待收货</view>
      </view>
    </view>

    <!-- 地图区域 -->
    <view v-if="status === 'onway'" class="map-container">
      <image class="map-background" src="/static/common/shared/coffee.png" mode="aspectFill"></image>

      <!-- 司机位置标记 -->
      <view class="driver-marker">
        <view class="marker-dot"></view>
        <view class="marker-pulse"></view>
      </view>

      <!-- 配送地址标记 -->
      <view class="destination-marker">
        <text class="marker-label">配送地址</text>
        <view class="marker-pin"></view>
      </view>
    </view>

    <!-- 司机信息区 -->
    <view v-if="status === 'onway'" class="driver-info">
      <view class="driver-header">
        <view class="driver-avatar">
          <image src="/static/common/shared/driver_avatar.png" mode="aspectFill"></image>
        </view>
        <view class="driver-details">
          <view class="driver-name">王师傅</view>
          <view class="driver-status">骑手已接单，正在配送中</view>
        </view>
        <view class="driver-contact" @click="callDriver">
          <view class="contact-icon">
            <text class="iconfont icon-phone"></text>
          </view>
          <text class="contact-text">联系骑手</text>
        </view>
      </view>

      <!-- 物流状态流程 -->
      <view class="delivery-process">
        <image src="/static/common/icons/business/location.svg" mode="widthFix"></image>
      </view>
    </view>

    <!-- 订单卡片 -->
    <view class="order-card">
      <view class="order-info">
        <view class="order-no">订单号: 6546846541821654</view>
        <view class="order-status">待收货</view>
      </view>
      <view class="product-info">
        <view class="product-image">
          <image :src="order.image" mode="aspectFill"></image>
        </view>
        <view class="product-details">
          <view class="product-name">{{ order.name }}</view>
          <view class="product-spec">
            <view class="spec-tag">{{ order.spec }}</view>
            <view class="product-quantity">×{{ order.quantity }}</view>
          </view>
          <view class="product-price">￥{{ order.price }}</view>
        </view>
      </view>
      <view class="divider"></view>
      <view class="logistics-status" v-if="status === 'onway'">
        <image src="/static/common/icons/business/location.svg" mode="aspectFit"></image>
        <text>司机正在路上~ 预计{{ estimatedTime }}送达</text>
      </view>
      <view class="logistics-status delivered" v-else-if="status === 'delivered'">
        <view class="delivered-icon">
          <text class="iconfont icon-wancheng1"></text>
        </view>
        <text>商品已送达！ 请您到取货点取货</text>
      </view>
      <view class="logistics-status delivered" v-else>
        <view class="delivered-icon">
          <text class="iconfont icon-wancheng1"></text>
        </view>
        <text>商品已送达！ 请您到取货点取货</text>
      </view>
      <view class="button-group" v-if="status === 'onway'">
        <view class="not-found-btn" @click="showNotFoundPopup">未找到商品</view>
        <view class="confirm-btn" @click="confirmDelivery">确认收货</view>
      </view>
      <view class="button-group" v-else-if="status === 'delivered'">
        <view class="confirm-btn received" @click="gotoOrderComplete">我已收货</view>
      </view>
      <view class="button-group" v-else>
        <view class="not-found-btn active" @click="showNotFoundNotice">未找到商品</view>
        <view class="confirm-btn" @click="gotoOrderComplete">确认收货</view>
      </view>
    </view>

    <!-- 弹窗 -->
    <view v-if="showPopup" class="popup-mask">
      <view class="popup-content" :class="{ 'notfound-popup': notFoundPopupActive }">
        <view class="popup-text">{{ popupText }}</view>
        <view class="popup-btn" @click="handlePopupConfirm">{{ popupBtnText }}</view>
      </view>
    </view>

    <!-- 查找订单提示 -->
    <view class="find-order-tip">没有找到订单？试试查看全部订单</view>

    <!-- 猜你喜欢 -->
    <view class="guess-like">
      <view class="title">你可能还会喜欢</view>
      <view class="like-list">
        <view class="like-item" v-for="(item, idx) in likeList" :key="idx">
          <image :src="item.image" mode="aspectFill"></image>
          <view class="like-name">{{ item.name }}</view>
          <view class="like-info">{{ item.info }}</view>
        </view>
      </view>
    </view>

    <!-- 状态切换按钮（开发用，可删除） -->
    <view style="position:fixed;bottom:10px;right:10px;z-index:999;">
      <button size="mini" @click="status = 'onway'">在路上</button>
      <button size="mini" @click="status = 'delivered'">已送达</button>
      <button size="mini" @click="status = 'notfound'">未找到</button>
      <button size="mini" @click="showNotFoundNotice">弹窗</button>
    </view>
  </view>
</template>

<script>
import colors from '@/mixins/color.js'
import { navigateToOrderComplete } from '@/utils/orderNavigation.js'

export default {
  mixins: [colors],
  data () {
    return {
      status: 'onway', // onway:在路上 delivered:已送达 notfound:未找到商品
      showPopup: false,
      popupText: '',
      popupBtnText: '知道了',
      popupAction: null,
      notFoundPopupActive: false,
      order: {
        id: '123456', // 添加订单ID
        image: '/static/common/shared/chicken_feet.png',
        name: '柠檬无骨鸡爪',
        spec: '一斤装/500g',
        quantity: 1,
        price: '25.50',
      },
      estimatedTime: '今日11:30',
      likeList: [
        {
          image: '/static/common/shared/coffee.png',
          name: '瑞幸咖啡5选1',
          info: '￥12.5 已售99+单'
        },
        {
          image: '/static/common/shared/bbq.png',
          name: '滩羊烤串21串套餐',
          info: '￥49 已售754件'
        },
        {
          image: '/static/common/shared/wings.png',
          name: '精美黄金烤鸡翅',
          info: '￥22 已售99+份'
        },
        {
          image: '/static/common/shared/octopus.png',
          name: '超值章鱼丸子1份',
          info: '￥7.5 已售1122件'
        }
      ]
    }
  },
  methods: {
    goBack () {
      uni.navigateBack()
    },
    confirmDelivery () {
      // 确认收货前先显示商品在路上提示弹窗
      this.showProductOnWayPopup()
    },
    showProductOnWayPopup () {
      this.notFoundPopupActive = false
      this.popupText = '商品还在路上请您耐心等候哦~'
      this.popupBtnText = '知道了'
      this.popupAction = null
      this.showPopup = true
    },
    showNotFoundNotice () {
      this.notFoundPopupActive = true
      this.popupText = '未找到商品？已反馈平台管理员'
      this.popupBtnText = '知道了'
      this.popupAction = () => {
        this.status = 'notfound'
      }
      this.showPopup = true
    },
    gotoOrderComplete () {
      navigateToOrderComplete(this.order.id)
    },
    handlePopupConfirm () {
      this.showPopup = false
      if (this.popupAction) {
        this.popupAction()
      }
    },
    showNotFoundPopup () {
      // 切换到未找到状态，显示弹窗提示
      this.showNotFoundNotice()
    },
    callDriver () {
      uni.makePhoneCall({
        phoneNumber: '13812345678',
        success: () => {
          console.log('已拨打电话')
        },
        fail: (err) => {
          console.error('拨打电话失败', err)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.pending-delivery-container {
  min-height: 100vh;
  background-color: #F0F0F0;

  .header {
    background-color: #FFFFFF;

    .status-bar {
      height: 44px;
    }

    .nav-bar {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 44px;

      .left {
        position: absolute;
        left: 15px;
        display: flex;
        align-items: center;

        .back-icon {
          width: 10px;
          height: 18px;
          margin-right: 5px;
        }

        text {
          color: #333333;
          font-size: 18px;
        }
      }

      .title {
        font-size: 18px;
        font-weight: 400;
        color: #1A1A1A;
      }
    }
  }

  // 地图区域
  .map-container {
    position: relative;
    width: 100%;
    height: 160px;
    overflow: hidden;

    .map-background {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .driver-marker {
      position: absolute;
      left: 30%;
      top: 40%;
      z-index: 2;

      .marker-dot {
        width: 12px;
        height: 12px;
        background-color: #EB3C3C;
        border-radius: 50%;
        position: relative;
        z-index: 3;
      }

      .marker-pulse {
        position: absolute;
        top: -4px;
        left: -4px;
        width: 20px;
        height: 20px;
        background-color: rgba(235, 60, 60, 0.3);
        border-radius: 50%;
        z-index: 2;
        animation: pulse 1.5s infinite;
      }
    }

    .destination-marker {
      position: absolute;
      right: 20%;
      bottom: 35%;
      display: flex;
      flex-direction: column;
      align-items: center;

      .marker-label {
        background-color: #FFFFFF;
        color: #333333;
        font-size: 12px;
        padding: 2px 6px;
        border-radius: 10px;
        margin-bottom: 4px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }

      .marker-pin {
        width: 10px;
        height: 10px;
        background-color: #FFFFFF;
        border-radius: 50%;
        border: 2px solid #333333;
      }
    }
  }

  // 司机信息区
  .driver-info {
    background-color: #FFFFFF;
    margin: 0 0 10px 0;
    padding: 15px;

    .driver-header {
      display: flex;
      align-items: center;

      .driver-avatar {
        width: 50px;
        height: 50px;
        border-radius: 25px;
        overflow: hidden;
        margin-right: 12px;

        image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }

      .driver-details {
        flex: 1;

        .driver-name {
          font-size: 16px;
          color: #1A1A1A;
          margin-bottom: 4px;
        }

        .driver-status {
          font-size: 14px;
          color: #999999;
        }
      }

      .driver-contact {
        display: flex;
        flex-direction: column;
        align-items: center;

        .contact-icon {
          width: 30px;
          height: 30px;
          border-radius: 15px;
          background-color: #F0F0F0;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 4px;

          .iconfont {
            color: #333333;
            font-size: 18px;
          }
        }

        .contact-text {
          font-size: 12px;
          color: #666666;
        }
      }
    }

    .delivery-process {
      margin-top: 15px;

      image {
        width: 100%;
      }
    }
  }

  // 订单卡片
  .order-card {
    background: #FFFFFF;
    border-radius: 4px;
    margin: 10px 15px;
    padding: 15px;

    .order-info {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .order-no {
        color: #B3B3B3;
        font-size: 13px;
      }

      .order-status {
        color: #DA3232;
        font-size: 15px;
      }
    }

    .product-info {
      display: flex;
      margin: 15px 0;

      .product-image {
        width: 80px;
        height: 80px;
        border-radius: 4px;
        overflow: hidden;
        margin-right: 15px;

        image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }

      .product-details {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        .product-name {
          font-size: 15px;
          color: #1A1A1A;
          margin-bottom: 5px;
        }

        .product-spec {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 5px;

          .spec-tag {
            background: #F7F7F7;
            color: #999999;
            font-size: 14px;
            padding: 2px 8px;
            border-radius: 6px;
          }

          .product-quantity {
            color: #999999;
            font-size: 14px;
          }
        }

        .product-price {
          font-size: 15px;
          color: #1A1A1A;
        }
      }
    }

    .divider {
      height: 0.5px;
      background: #F0F0F0;
      margin-bottom: 15px;
    }

    .logistics-status {
      padding: 10px 15px;
      color: #000000;
      font-size: 15px;
      margin-bottom: 15px;
      background-color: #F8F8F8;
      border-radius: 4px;
      display: flex;
      align-items: center;

      image {
        width: 20px;
        height: 20px;
        margin-right: 5px;
      }

      &.delivered {
        font-weight: 500;

        .delivered-icon {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background-color: #4CD964;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 5px;

          .iconfont {
            color: #FFFFFF;
            font-size: 12px;
          }
        }
      }
    }

    .button-group {
      display: flex;
      justify-content: flex-end;
      align-items: center;

      .not-found-btn {
        height: 30px;
        padding: 0 15px;
        border-radius: 15px;
        background: #FFFFFF;
        color: #4D4D4D;
        font-size: 15px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 10px;

        &.active {
          background: #4D4D4D;
          color: #FFFFFF;
        }
      }

      .confirm-btn {
        height: 30px;
        padding: 0 15px;
        border-radius: 15px;
        background: #FF840B;
        color: #FFFFFF;
        font-size: 15px;
        display: flex;
        align-items: center;
        justify-content: center;

        &.received {
          background: #4D4D4D;
        }
      }
    }
  }

  // 查找订单提示
  .find-order-tip {
    text-align: center;
    font-size: 13px;
    color: #000000;
    margin: 15px 0;
  }

  // 猜你喜欢
  .guess-like {
    background: #FFFFFF;
    padding: 15px;
    margin-top: 10px;

    .title {
      font-size: 18px;
      color: #000000;
      margin-bottom: 15px;
    }

    .like-list {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;

      .like-item {
        width: 48%;
        margin-bottom: 15px;

        image {
          width: 100%;
          height: 100px;
          border-radius: 4px 4px 0 0;
          object-fit: cover;
        }

        .like-name {
          font-size: 16px;
          color: #1A1A1A;
          margin-top: 8px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .like-info {
          font-size: 16px;
          color: #EB3C3C;
          margin-top: 4px;
        }
      }
    }
  }

  // 弹窗
  .popup-mask {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;

    .popup-content {
      background: #FFFFFF;
      border-radius: 10px;
      padding: 15px 20px;
      width: 80%;
      display: flex;
      flex-direction: column;
      align-items: center;

      &.notfound-popup {
        .popup-text {
          background-color: rgba(0, 0, 0, 0.7);
        }
      }

      .popup-text {
        font-size: 16px;
        color: #FFFFFF;
        margin-bottom: 0;
        text-align: center;
        background-color: rgba(0, 0, 0, 0.7);
        border-radius: 10px;
        padding: 15px 20px;
        width: 100%;
      }

      .popup-btn {
        background: #FF840B;
        color: #FFFFFF;
        border-radius: 15px;
        padding: 6px 30px;
        font-size: 15px;
        text-align: center;
        margin-top: 15px;
      }
    }
  }

  @keyframes pulse {
    0% {
      transform: scale(1);
      opacity: 0.5;
    }

    70% {
      transform: scale(2);
      opacity: 0;
    }

    100% {
      transform: scale(1);
      opacity: 0;
    }
  }
}
</style>