<template>
  <view class="user-follow-page">
    <view class="header-gradient"></view>
    <view class="header-bar">
      <view class="back-area" @click="goBack">
        <view class="back-arrow"></view>
        <text class="back-text">返回</text>
      </view>
      <view class="header-title">我的关注</view>
    </view>
    <view class="tab-section">
      <view class="tab-container">
        <view class="tab-item" :class="{ 'active': currentTab === 0 }" @click="switchTab(0)">租售信息</view>
        <view class="tab-item" :class="{ 'active': currentTab === 1 }" @click="switchTab(1)">商业信息</view>
      </view>
      <view class="tab-slider" :style="sliderStyle"></view>
    </view>
    <view class="search-bar">
      <image class="search-icon" src="/static/icons/search.svg" />
      <input class="search-input" @confirm="searchItems" v-model="searchQuery" placeholder="搜索" />
    </view>
    <view class="follow-list-container">
      <view class="follow-list" v-show="currentTab === 0">
        <view class="follow-item" v-for="(item, index) in rentalList" :key="index">
          <image class="store-logo" :src="setDomain(item.houses.image)" mode="aspectFill"></image>
          <view class="store-info">
            <view class="store-name">{{ item.houses.title }}</view>
            <view class="follow-time">{{ formatRelativeTime(item.create_time) }}</view>
          </view>
          <view class="follow-btn" @click.stop="toggleFollow(item, 'rental')">
            <text class="check-icon">✓</text>
            <text>{{ item.isFollowed ? '已关注' : '关注' }}</text>
          </view>
        </view>
      </view>
      <view class="follow-list" v-show="currentTab === 1">
        <view class="follow-item" v-for="(item, index) in businessList" :key="index">
          <block v-if="item.sub_type === 1">
            <image class="store-logo" :src="item.franchise.image" mode="aspectFill"></image>
            <view class="store-info">
              <view class="store-name">{{ item.franchise.title }}</view>
              <view class="follow-time">{{ formatRelativeTime(item.create_time) }}</view>
            </view>
            <view class="follow-btn" @click.stop="toggleFollow(item, 'business')">
              <text class="check-icon">✓</text>
              <text>已关注</text>
            </view>
          </block>
          <block v-if="item.sub_type === 2">
            <image class="store-logo" :src="item.cooperation.image" mode="aspectFill"></image>
            <view class="store-info">
              <view class="store-name">{{ item.cooperation.title }}</view>
              <view class="follow-time">{{ formatRelativeTime(item.create_time) }}</view>
            </view>
            <view class="follow-btn" @click.stop="toggleFollow(item, 'business')">
              <text class="check-icon">✓</text>
              <text>已关注</text>
            </view>
          </block>
          <block v-if="item.sub_type === 3">
            <image class="store-logo" :src="item.convenientService.image" mode="aspectFill"></image>
            <view class="store-info">
              <view class="store-name">{{ item.convenientService.title }}</view>
              <view class="follow-time">{{ formatRelativeTime(item.create_time) }}</view>
            </view>
            <view class="follow-btn" @click.stop="toggleFollow(item, 'business')">
              <text class="check-icon">✓</text>
              <text>已关注</text>
            </view>
          </block>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import CommonHeader from '@/components/CommonHeader/index.vue'
import { addCollect, deleteCollect, getCollectList } from '@/api/group'
import { HTTP_REQUEST_URL } from '@/config/app.js'
import dayjs from '@/plugin/dayjs/dayjs.min.js'

export default {
  components: {
    CommonHeader
  },
  data() {
    return {
      currentTab: 0,
      sliderStyle: {
        left: 'calc(25% - 40rpx)',
        width: '80rpx'
      },
      searchQuery: '',
      rentalList: [

      ],
      businessList: [
        {
          id: 1,
          name: '优选咖啡',
          logo: '/static/images/follows/store_business_1.jpg',
          followed: true,
          followTime: '2天前关注'
        }
      ]
    }
  },
  onLoad(options) {
    if (options.tab) {
      this.currentTab = parseInt(options.tab) || 0
    }
  },
  methods: {
    goBack() {
      uni.navigateBack()
    },
    // 处理图片URL
    setDomain(url) {
      if (!url) return ''
      url = url.toString()

      // 如果是本地 static 资源，直接返回，不拼接域名
      if (url.indexOf('/static/') === 0) {
        return url
      }

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
    // 1. 首先在获取列表时添加 isFollowed 字段
    async getCollectListAPI() {
      const res = await getCollectList()
      // 给每个项目添加关注状态字段
      this.rentalList = (res.data.data || []).map(item => ({
        ...item,
        isFollowed: !!item.fav_id // 根据 fav_id 判断是否已关注
      }))
      const res1 = await getCollectList(2, '')
      this.businessList = (res1.data.data || []).map(item => ({
        ...item,
        isFollowed: !!item.fav_id // 根据 fav_id 判断是否已关注
      }))
    },
    async searchItems() {
      console.log('搜索内容:', this.searchQuery)
      const res = await getCollectList(this.currentTab === 0 ? 1 : 2, '', this.searchQuery)
      console.log(res)

      this.rentalList = res.data.map(item => ({
        ...item,
        isFollowed: !!item.fav_id // 根据 fav_id 判断是否已关注
      }))
      this.businessList = res.data.map(item => ({
        ...item,
        isFollowed: !!item.fav_id // 根据 fav_id 判断是否已关注
      }))
    },
    switchTab(index) {
      this.getCollectListAPI()
      this.currentTab = index
      const lefts = ['calc(25% - 40rpx)', 'calc(75% - 40rpx)']
      this.sliderStyle = {
        left: lefts[index],
        width: '80rpx'
      }
    },
    // 2. 修改 toggleFollow 方法
    async toggleFollow(item, listType) {
      try {
        const isFollowed = item.isFollowed // 使用新的字段判断
        console.log('当前是否已关注:', isFollowed)

        const type = listType === 'rental' ? 1 : 2 // 假设1是租售信息，2是商业信息

        if (isFollowed) {
          // 取消关注
          await deleteCollect({
            fav_id: item.fav_id, // 使用收藏记录的ID
            type: type,
            sub_type: item.sub_type
          })

          // 更新本地状态 - 只改变关注状态，保留所有数据
          item.isFollowed = false
          // 保留 fav_id，因为我们不删除页面数据

        } else {
          const result = await addCollect({
            fav_id: item.fav_id,
            type: type
          })

          // 更新本地状态
          item.isFollowed = true
          item.fav_id = result.fav_id || item.fav_id // 更新为新的收藏记录ID
        }

        // 显示操作结果
        uni.showToast({
          title: isFollowed ? '已取消关注' : '已关注',
          icon: 'success'
        })

      } catch (error) {
        console.error('关注操作失败:', error)
        uni.showToast({
          title: '操作失败，请重试',
          icon: 'none'
        })
      }
    },

    // 使用 dayjs 格式化相对时间
    // 需要先引入 dayjs 和相对时间插件
    // import dayjs from 'dayjs'
    // import relativeTime from 'dayjs/plugin/relativeTime'
    // import 'dayjs/locale/zh-cn' // 中文语言包
    // dayjs.extend(relativeTime)
    // dayjs.locale('zh-cn')

    formatRelativeTime(createTime) {
      if (!createTime) return ''

      const now = dayjs()
      const createDate = dayjs(createTime)

      // 计算时间差
      const diffYears = now.diff(createDate, 'year')
      const diffMonths = now.diff(createDate, 'month')
      const diffDays = now.diff(createDate, 'day')
      const diffHours = now.diff(createDate, 'hour')
      const diffMinutes = now.diff(createDate, 'minute')

      // 根据时间差返回相应格式
      if (diffYears > 0) {
        return `${diffYears}年前关注`
      } else if (diffMonths > 0) {
        return `${diffMonths}个月前关注`
      } else if (diffDays > 0) {
        return `${diffDays}天前关注`
      } else if (diffHours > 0) {
        return `${diffHours}小时前关注`
      } else if (diffMinutes > 0) {
        return `${diffMinutes}分钟前关注`
      } else {
        return '刚刚关注'
      }
    },
    goToStore(item) {
      // 跳转到店铺详情页
      uni.navigateTo({
        url: '/pages/store/detail?id=' + item.id
      })
    }
  },
  created() {
    this.getCollectListAPI()
  },
  mounted() {
    // 初始化下划线位置
    const lefts = ['calc(25% - 40rpx)', 'calc(75% - 40rpx)']
    this.sliderStyle = {
      left: lefts[this.currentTab],
      width: '80rpx'
    }
  }
}
</script>

<style lang="scss" scoped>
.user-follow-page {
  min-height: 100vh;
  background: #f8f8f8;
  position: relative;
}

.header-gradient {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 120rpx;
  /* 减少高度 */
  background: linear-gradient(180deg, #F9E4CA 0%, rgba(249, 227, 200, 0.2) 100%);
  z-index: 0;
}

.header-bar {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 88rpx;
  /* 减少高度 */
  background: transparent;

  .back-area {
    position: absolute;
    left: 24rpx;
    display: flex;
    align-items: center;

    .back-arrow {
      width: 28rpx;
      height: 28rpx;
      border-left: 3rpx solid #4D4D4D;
      border-bottom: 3rpx solid #4D4D4D;
      transform: rotate(45deg);
      margin-right: 8rpx;
    }

    .back-text {
      font-size: 32rpx;
      color: #4D4D4D;
    }
  }

  .header-title {
    font-size: 36rpx;
    color: #000;
    font-weight: 400;
    text-align: center;
  }
}

.tab-section {
  margin-top: 30rpx;
  /* 减少顶部间距 */
  background: transparent;
  position: relative;
  /* 确保相对定位 */
  z-index: 2;

  /* 确保在渐变层上方 */
  .tab-container {
    display: flex;
    justify-content: space-around;
    align-items: flex-end;
    height: 80rpx;
    position: relative;

    /* 确保相对定位 */
    .tab-item {
      flex: 1;
      text-align: center;
      font-size: 32rpx;
      color: #B3B3B3;
      font-weight: 400;
      padding-bottom: 12rpx;
      transition: color 0.2s;
      position: relative;

      &.active {
        color: #000;
        font-weight: bold;
      }
    }
  }

  .tab-slider {
    position: absolute;
    bottom: 0;
    height: 4rpx;
    background: #FE8D00;
    border-radius: 2rpx;
    transition: left 0.3s, width 0.3s;
    z-index: 3;
    /* 确保可见 */
    width: 80rpx;
    left: calc(25% - 40rpx + (currentTab * 50%));
    // 80rpx为tab文字宽度，40rpx为一半
  }
}

.search-bar {
  margin: 16rpx 24rpx 0 24rpx;
  /* 减少顶部间距 */
  height: 64rpx;
  background: #fff;
  border-radius: 32rpx;
  display: flex;
  align-items: center;
  padding: 0 24rpx;
  box-shadow: 0 2rpx 8rpx 0 rgba(0, 0, 0, 0.04);

  .search-icon {
    width: 30rpx;
    height: 30rpx;
    margin-right: 12rpx;
  }

  .search-input {
    flex: 1;
    border: none;
    background: transparent;
    font-size: 28rpx;
    color: #333;
    outline: none;

    &::placeholder {
      color: #CCCCCC;
    }
  }
}

.follow-list-container {
  margin-top: 16rpx;

  .follow-list {
    padding: 0 24rpx;

    /* 添加左右内边距，与返回箭头对齐 */
    .follow-item {
      display: flex;
      align-items: center;
      padding: 10rpx;
      border-bottom: 1rpx solid #f0f0f0;
      // background: #fff;
      width: 100%;
      /* 确保宽度不超出父容器 */
      box-sizing: border-box;

      /* 确保padding不会增加宽度 */
      .store-logo {
        width: 64rpx;
        height: 64rpx;
        border-radius: 50%;
        margin-right: 16rpx;
        flex-shrink: 0;
        /* 防止图片被压缩 */
      }

      .store-info {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        min-width: 0;

        /* 允许内容在必要时被截断 */
        .store-name {
          font-size: 32rpx;
          color: #000;
          font-weight: bold;
          margin-bottom: 4rpx;
          white-space: nowrap;
          /* 防止换行 */
          overflow: hidden;
          /* 超出部分隐藏 */
          text-overflow: ellipsis;
          /* 显示省略号 */
        }

        .follow-time {
          font-size: 22rpx;
          color: #B3B3B3;
          font-weight: 400;
        }
      }

      .follow-btn {
        min-width: 120rpx;
        /* 增加宽度 */
        height: 48rpx;
        /* 增加高度 */
        border-radius: 24rpx;
        /* 增加圆角 */
        border: 1rpx solid #CCCCCC;
        /* 更浅的边框颜色 */
        background: #fff;
        color: #999;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24rpx;
        font-weight: 400;
        flex-shrink: 0;
        margin-right: 12rpx;
        padding: 0 16rpx;

        /* 增加内边距 */
        .check-icon {
          margin-right: 6rpx;
          /* 增加图标与文字间距 */
          font-size: 24rpx;
          /* 增大图标尺寸 */
          color: #999;
        }
      }
    }
  }
}

/* 可选：添加点击态样式 */
.follow-btn:active {
  opacity: 0.8;
}
</style>