<template>
  <view class="message-private-page">
    <!-- 顶部导航栏 -->
    <view class="header">
      <view class="back-section" @click="goBack">
        <view class="back-arrow"></view>
        <text class="back-text">返回</text>
      </view>
      <view class="page-title">信息私信</view>
    </view>

    <!-- 页面内容区域 -->
    <view class="page-content">
      <!-- 消息标签页 -->
      <view class="top-tabs" :style="colorStyle">
        <view class="tabs">
          <view class="item" :class="{ btborder: type === index }" v-for="(item, index) in tabsList" :key="index"
            @tap="changeTabs(index)">
            {{ item.name }}
          </view>
        </view>
        <view class="read-all" @click="allLook()">
          全部已读
        </view>
      </view>

      <!-- 客服消息列表 -->
      <view v-if="list.length && type === 1" class="message-list">
        <view v-for="(item, index) in list" :key="index" class="message-item" @click="goChat(item)">
          <image class="avatar" :src="item.avatar" mode="aspectFill"></image>
          <view class="message-content">
            <view class="message-title">{{ item.nickname }}</view>
            <view class="message-preview">
              <text v-if="item.message_type === 1" v-html="item.message"></text>
              <text v-if="item.message_type === 2" v-html="item.message"></text>
              <text v-if="item.message_type === 3">[图片]</text>
              <text v-if="item.message_type === 4">[语音]</text>
              <text v-if="item.message_type === 5">[商品]</text>
              <text v-if="item.message_type === 6">[订单]</text>
            </view>
          </view>
          <view class="message-time">{{ item._update_time }}</view>
          <view class="num" v-if="item.mssage_num">{{ item.mssage_num }}</view>
        </view>
      </view>

      <!-- 站内消息列表 -->
      <view class="message-list" v-if="list.length && type === 0">
        <view v-for="(item, index) in list" :key="index">
          <tuiDrawer @click="(e) => bindClick(e, item)" :key="item.id" :actions="!item.look ? actions : actionsIsLook"
            :params="{ id: item.id }">
            <template v-slot:content>
              <view class="message-item" @click="goDetail(item.id)">
                <view class="avatar-container" v-if="type === 0">
                  <view class="service-avatar">
                    <image v-if="item.type === 1" class="notification-icon" src="/static/admin-msg.png"></image>
                    <image v-else class="notification-icon" src="/static/user-msg.png"></image>
                  </view>
                  <view class="badge" v-if="!item.look"></view>
                </view>
                <image v-else class="avatar" :src="item.avatar" mode="aspectFill"></image>
                <view class="message-content">
                  <view class="message-title">{{ item.title || '--' }}</view>
                  <view class="message-preview" v-html="item.content"></view>
                </view>
                <view class="message-time">{{ item.add_time }}</view>
              </view>
            </template>
          </tuiDrawer>
        </view>
      </view>

      <!-- 空消息提示 -->
      <view v-else-if="finished && !list.length" class="empty-wrap">
        <view class="empty-container">
          <image class="empty-image" :src="imgHost + '/statics/images/noMessage.png'"></image>
          <view>亲、暂无消息记录哟！</view>
        </view>
      </view>
    </view>

  </view>
</template>

<script>
import { serviceRecord, messageSystem, msgLookDel } from '@/api/user.js'
import colors from '@/mixins/color.js'
import tuiDrawer from '@/components/tuiDrawer/index.vue'
import { HTTP_REQUEST_URL } from '@/config/app'

export default {
  mixins: [colors],
  components: {
    tuiDrawer
  },
  data() {
    return {
      showNotificationBar: false, // 默认不显示通知栏
      imgHost: HTTP_REQUEST_URL,
      list: [],
      page: 1,
      type: 0,
      limit: 20,
      loading: false,
      finished: false,
      tabsList: [{
        key: 0,
        name: '站内消息'
      }, {
        key: 1,
        name: '客服消息'
      }],
      startData: {
        clientX: 0,
        clientY: 0
      },
      actions: [{
        name: '删除',
        color: '#fff',
        fontsize: 28, //单位rpx
        width: 70, //单位px
        background: '#E6A23C'
      },
      {
        name: '已读',
        color: '#fff',
        fontsize: 28, //单位rpx
        width: 70, //单位px
        background: '#409EFF'
      },
      ],
      actionsIsLook: [{
        name: '删除',
        color: '#fff',
        fontsize: 28, //单位rpx
        width: 70, //单位px
        background: '#E6A23C'
      },]
    }
  },
  onShow() {
    this.page = 1
    this.list = []
    this.changeTabs(this.type)
  },
  onReachBottom() {
    if (this.type === 1) {
      this.getList()
    } else {
      this.messageSystem()
    }
  },
  onPullDownRefresh() {
    this.page = 1
    this.finished = false
    this.list = []
    if (this.type === 1) {
      this.getList()
    } else {
      this.messageSystem()
    }
  },
  methods: {
    goBack() {
      uni.navigateBack()
    },
    start(e) {
      this.startData.clientX = e.changedTouches[0].clientX
      this.startData.clientY = e.changedTouches[0].clientY
    },
    end(e) {
      const subX = e.changedTouches[0].clientX - this.startData.clientX
      const subY = e.changedTouches[0].clientY - this.startData.clientY
      if (subY > 50 || subY < -50) {
        console.log('上下滑')
      } else {
        if (subX > 50) {
          console.log('右滑')
          if (this.type == 1) {
            this.type = 0
            this.changeTabs(this.type)
          }
        } else if (subX < -50) {
          if (this.type == 0) {
            this.type = 1
            this.changeTabs(this.type)
          }
          console.log('左滑')
        } else {
          console.log('无效')
        }
      }
    },
    // 滑动点击操作
    bindClick(e, item) {
      if (e.index == 0) {
        msgLookDel({
          id: item.id,
          key: 'is_del',
          value: 1
        }).then(res => {
          let i = this.list.findIndex(e => {
            return e.id === item.id
          })
          this.list.splice(i, 1)
        }).catch(err => {
          uni.showToast({
            title: err.msg,
            icon: 'none'
          })
        })
      } else {
        // 已读
        msgLookDel({
          id: item.id,
          key: 'look',
          value: 1
        }).then(res => {
          item.look = 1
        }).catch(err => {
          uni.showToast({
            title: err.msg,
            icon: 'none'
          })
        })
      }
    },
    allLook() {
      msgLookDel({
        id: 0,
        key: 'look',
        value: 1,
        all: 1
      }).then(res => {
        this.page = 1
        this.limit = 20
        this.list = []
        this.finished = false
        if (this.type === 1) {
          this.getList()
        } else {
          this.messageSystem()
        }
      }).catch(err => {
        uni.showToast({
          title: err.msg,
          icon: 'none'
        })
      })
    },
    changeTabs(index) {
      this.type = index
      this.page = 1
      this.limit = 20
      this.list = []
      this.finished = false
      if (index === 1) {
        this.getList()
      } else {
        this.messageSystem()
      }
    },
    // 站内信
    messageSystem() {
      if (this.loading || this.finished) {
        return
      }
      this.loading = true
      uni.showLoading({
        title: '加载中'
      })
      messageSystem({
        page: this.page,
        limit: this.limit
      })
        .then(res => {
          let data = res.data
          uni.hideLoading()
          this.loading = false
          this.list = this.list.concat(data.list)
          this.finished = data.list.length < this.limit
          this.page += 1
          uni.stopPullDownRefresh()
        })
        .catch(err => {
          uni.showToast({
            title: err.msg,
            icon: 'none'
          })
        })
    },
    // 客服list
    getList() {
      if (this.loading || this.finished) {
        return
      }
      this.loading = true
      uni.showLoading({
        title: '加载中'
      })
      serviceRecord({
        page: this.page,
        limit: this.limit
      })
        .then(res => {
          uni.stopPullDownRefresh()
          let data = res.data
          uni.hideLoading()
          this.loading = false
          data.forEach(item => {
            if (item.message_type === 1) {
              item.message = this.replace_em(item.message)
            }
            if (item.message_type === 2) {
              item.message = this.replace_em(item.message)
            }
          })
          this.list = this.list.concat(data)
          this.finished = data.length < this.limit
          this.page += 1
        })
        .catch(err => {
          uni.showToast({
            title: err.msg,
            icon: 'none'
          })
        })
    },
    replace_em(str) {
      str = str.replace(/\[([^\[\]]+)\]/g, "<span class='em $1'/></span>")
      return str
    },
    goChat(item) {
      item.mssage_num = 0
      uni.navigateTo({
        url: '/pages/extension/customer_list/chat?to_uid=' + item.to_uid + '&type=1'
      })
    },
    goDetail(id) {
      uni.navigateTo({
        url: '/pages/users/message_center/messageDetail?id=' + id,
      })
    },
  }
}
</script>

<style lang="scss">
.message-private-page {
  position: relative;
  width: 100%;
  min-height: 100vh;
  background: #F8F8F8;
  font-family: 'PingFang SC', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif;
  box-sizing: border-box;
  -webkit-font-smoothing: antialiased;

  // 顶部导航栏背景渐变
  .header {
    position: fixed;
    width: 100%;
    height: 56px;
    left: 0;
    top: 0;
    background: linear-gradient(180deg, rgba(254, 141, 0, 0.15) 0%, rgba(254, 141, 1, 0) 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 999;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

    .back-section {
      position: absolute;
      left: 4px;
      top: 50%;
      transform: translateY(-50%);
      display: flex;
      align-items: center;
      cursor: pointer;
      padding: 10px;
      border-radius: 50%;
      transition: background-color 0.2s;

      &:active {
        background-color: rgba(0, 0, 0, 0.05);
      }

      .back-arrow {
        width: 10px;
        height: 10px;
        border: 2px solid #4D4D4D;
        border-right: none;
        border-top: none;
        transform: rotate(45deg);
        margin-right: 5px;
      }

      .back-text {
        font-weight: 400;
        font-size: 16px;
        color: #4D4D4D;
      }
    }

    .page-title {
      font-weight: 500;
      font-size: 18px;
      color: #000000;
      text-align: center;
    }
  }

  // 页面内容区域
  .page-content {
    padding-top: 56px;
    width: 100%;
    box-sizing: border-box;
    transition: padding-top 0.3s ease;
  }

  // 消息标签页
  .top-tabs {
    position: fixed;
    width: 100%;
    display: flex;
    align-items: center;
    background-color: #fff;
    font-size: 28rpx;
    border-radius: 8rpx;
    padding: 20rpx 0;
    margin-bottom: 10rpx;
    z-index: 1000;
    transition: all 0.3s;
    justify-content: space-between;
    top: 56px;

    .read-all {
      margin-right: 24rpx;
      font-size: 24rpx;
    }
  }

  .tabs {
    display: flex;
  }

  .item {
    display: flex;
    align-items: center;
    padding: 4rpx 15rpx;
    margin: 0 20rpx;
    animation: Gradient 0.3s;
    border-radius: 30rpx;
    transition: all 0.4s;
  }

  .btborder {
    color: #fff;
    background-color: var(--view-theme);
    border-radius: 30rpx;
  }

  @-webkit-keyframes Gradient {
    0% {
      background-color: pink;
    }

    50% {
      background-position: 100% 50%
    }

    100% {
      background-position: 0% 50%
    }
  }

  @-moz-keyframes Gradient {
    0% {
      background-position: 0% 50%
    }

    50% {
      background-position: 100% 50%
    }

    100% {
      background-position: 0% 50%
    }
  }

  @keyframes Gradient {
    0% {
      background-position: 0% 50%
    }

    50% {
      background-position: 100% 50%
    }

    100% {
      background-position: 0% 50%
    }
  }

  // 消息列表
  .message-list {
    padding: 15px;
    margin-top: 100rpx;

    .message-item {
      position: relative;
      width: 100%;
      min-height: 60px;
      margin-bottom: 15px;
      display: flex;
      align-items: center;
      padding: 10px 15px;
      background: #FFFFFF;
      border-radius: 12px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
      transition: transform 0.2s, box-shadow 0.2s;

      &:active {
        transform: scale(0.98);
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
      }

      .avatar-container {
        position: relative;
        margin-right: 12px;
        width: 48px;
        height: 48px;

        .service-avatar {
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, #FF9B1F, #FE8D00);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 6px rgba(254, 141, 0, 0.25);

          .notification-icon {
            width: 22px;
            height: 20px;
            display: block;
          }
        }

        .badge {
          position: absolute;
          width: 18px;
          height: 18px;
          right: -5px;
          top: -5px;
          background: #FB5B17;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 1px 3px rgba(251, 91, 23, 0.3);
          border: 1.5px solid #FFFFFF;

          text {
            font-size: 12px;
            color: #FFFFFF;
            font-weight: 500;
          }
        }
      }

      .avatar {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        margin-right: 12px;
        border: 1px solid rgba(0, 0, 0, 0.05);
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
      }

      .message-content {
        flex: 1;
        overflow: hidden;
        padding-right: 30px;

        .message-title {
          font-weight: 500;
          font-size: 16px;
          line-height: 22px;
          color: #1A1A1A;
          margin-bottom: 6px;
        }

        .message-preview {
          font-size: 14px;
          line-height: 18px;
          color: #808080;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }

      .message-time {
        position: absolute;
        right: 15px;
        top: 12px;
        font-size: 12px;
        color: #999;
      }

      .num {
        position: absolute;
        right: 15px;
        top: 35px;
        min-width: 16px;
        height: 16px;
        border-radius: 8px;
        background-color: #e93323;
        font-size: 10px;
        line-height: 16px;
        text-align: center;
        color: #fff;
        padding: 0 4px;
        box-sizing: border-box;
      }
    }
  }

  // 空消息提示
  .empty-wrap {
    font-size: 26rpx;
    text-align: center;
    color: #999;
    margin-top: 100rpx;

    .empty-container {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .empty-image {
      width: 414rpx;
      height: 436rpx;
      padding-top: 100rpx;
      margin: 0 auto;
    }
  }

}
</style>