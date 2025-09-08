<template>
    <view class="station-selector-page">
        <!-- 导航栏 -->
        <view class="nav-bar">
            <view class="nav-left" @click="goBack">
                <image class="back-icon" src="/static/icons/back-arrow.svg" mode="aspectFit"></image>
                <text class="back-text">返回</text>
            </view>
            <text class="nav-title">站点</text>
            <text class="nav-right" @click="toggleSelectionMode">{{ isSelectionMode ? '取消' : '选择' }}</text>
        </view>

        <!-- 我的站点区域 -->
        <view class="my-station-section" v-if="myStation">
            <view class="section-title">我的站点</view>
            <view class="station-card my-station" :class="{ 'selected-station': selectedStationId === myStation.id }"
                @click="selectMyStation()">
                <view class="station-left">
                    <image class="station-blue-icon" :src="myStation.imageUrl" mode="aspectFit"></image>
                </view>
                <view class="station-center">
                    <text class="station-name">{{ myStation.name }}</text>
                    <text class="gray-tag current-tag">当前取货点</text>
                    <view class="location-wrap">
                        <image class="location-icon" src="/static/images/location_icon.svg" mode="aspectFit"></image>
                        <text class="distance">{{ myStation.distance || '100m' }}</text>
                    </view>
                </view>
            </view>
        </view>

        <!-- 其他站点区域 -->
        <view class="other-stations-section">
            <view class="section-title">其他站点</view>
            <view class="station-list">
                <view class="station-card" v-for="station in otherStations" :key="station.id"
                    :class="{ 'selected-station': selectedStationId === station.id }"
                    @click="selectOtherStation(station)">
                    <view class="station-left">
                        <view v-if="isSelectionMode"
                            :class="['select-circle', { 'selected': selectedStationId === station.id }]" />
                        <image class="station-blue-icon" :src="station.imageUrl" mode="aspectFit"></image>
                    </view>
                    <view class="station-center">
                        <text class="station-name">{{ station.name }}</text>
                        <text class="gray-tag">附近取货点</text>
                        <view class="location-wrap">
                            <image class="location-icon" src="/static/images/location_icon.svg" mode="aspectFit">
                            </image>
                            <text class="distance">{{ station.distance }}</text>
                        </view>
                    </view>
                </view>
            </view>
        </view>

        <!-- 加载状态 -->
        <view class="loading-state" v-if="loading">
            <text class="loading-text">正在加载站点信息...</text>
        </view>

        <!-- 空状态 -->
        <view class="empty-state" v-if="!loading && !myStation && otherStations.length === 0">
            <text class="empty-text">暂无可用站点</text>
        </view>

        <!-- 底部进入站点按钮 -->
        <view class="bottom-safe-area" v-if="selectedStationId">
            <button class="enter-btn" @click="enterStation">进入站点</button>
        </view>
    </view>
</template>

<script>
import {
    getCommunityList,
    getMyCommunityInfo
} from '@/api/group.js'

export default {
    name: 'StationSelector',
    data() {
        return {
            myStation: null,
            otherStations: [],
            selectedStationId: null,
            loading: false,
            isSelectionMode: false,
            baseUrl: 'http://wx.laizhangluo.com'
        }
    },
    onLoad() {
        this.loadStationData()
    },
    methods: {
        // 进入站点
        enterStation() {
            if (!this.selectedStationId) return

            // 找到选中的站点
            let selectedStation = null
            if (this.myStation && this.selectedStationId === this.myStation.id) {
                selectedStation = this.myStation
            } else {
                selectedStation = this.otherStations.find(s => s.id === this.selectedStationId)
            }

            if (selectedStation) {
                // 导航到今日开团页面，并传递社区ID参数和距离参数
                uni.navigateTo({
                    url: `/pages/index/today-group-buying/index?community_id=${selectedStation.id}&distance=${encodeURIComponent(selectedStation.distance)}&is_my_station=${this.selectedStationId === this.myStation.id ? '1' : '0'}`
                })
            }
        },

        // 切换选择模式
        toggleSelectionMode() {
            this.isSelectionMode = !this.isSelectionMode

            // 如果取消选择，清除选中状态
            if (!this.isSelectionMode) {
                this.selectedStationId = null
            }
        },

        // 确认选择
        confirmSelection() {
            if (!this.selectedStationId) {
                return
            }

            // 找到选中的站点
            let selectedStation = null
            if (this.myStation && this.selectedStationId === this.myStation.id) {
                selectedStation = this.myStation
            } else {
                selectedStation = this.otherStations.find(s => s.id === this.selectedStationId)
            }

            if (selectedStation) {
                // 返回选中的站点信息
                const pages = getCurrentPages()
                const prevPage = pages[pages.length - 2]
                if (prevPage && prevPage.onStationSelected) {
                    prevPage.onStationSelected(selectedStation)
                }

                uni.navigateBack()
            }
        },

        // 加载站点数据
        async loadStationData() {
            this.loading = true
            try {
                // 获取我的社区信息
                await this.loadMyStation()
                // 获取其他站点列表
                await this.loadOtherStations()
            } catch (error) {
                console.error('加载站点数据失败:', error)
            } finally {
                this.loading = false
            }
        },

        // 处理图片URL，如果不包含域名则拼接
        formatImageUrl(url) {
            if (!url) return '/static/icons/station-selected.png'
            if (url.startsWith('http://') || url.startsWith('https://')) {
                return url
            }
            return this.baseUrl + (url.startsWith('/') ? url : '/' + url)
        },

        // 获取我的站点
        async loadMyStation() {
            try {
                const response = await getMyCommunityInfo()
                if (response.status === 200 && response.data && response.data.is_bind && response.data.community) {
                    this.myStation = {
                        id: response.data.community.id,
                        name: response.data.community.name,
                        distance: '100m',
                        status: '当前站点',
                        imageUrl: this.formatImageUrl(response.data.community.image)
                    }
                }
            } catch (error) {
                console.log('获取我的站点失败:', error)
            }
        },

        // 获取其他站点列表
        async loadOtherStations() {
            try {
                const response = await getCommunityList({
                    page: 1,
                    limit: 20
                })

                if (response.status === 200 && response.data) {
                    const allStations = response.data.list || response.data

                    // 过滤掉我的站点，生成其他站点列表
                    this.otherStations = allStations
                        .filter(station => !this.myStation || station.id !== this.myStation.id)
                        .map((station, index) => ({
                            id: station.id,
                            name: station.name,
                            distance: this.generateDistance(index),
                            status: '仅可预览',
                            imageUrl: this.formatImageUrl(station.image)
                        }))
                }
            } catch (error) {
                console.log('获取其他站点失败:', error)
            }
        },

        // 生成距离信息（模拟数据）
        generateDistance(index) {
            // 生成更真实的距离值
            const distanceValues = [
                '200m', '350m', '500m', '750m', '1.2km',
                '1.5km', '2.3km', '3.1km', '4.5km', '5.2km'
            ]
            return distanceValues[index % distanceValues.length]
        },

        // 选择我的站点
        selectMyStation() {
            if (this.myStation && this.isSelectionMode) {
                this.selectedStationId = this.myStation.id
            }
        },

        // 选择其他站点
        selectOtherStation(station) {
            if (this.isSelectionMode) {
                this.selectedStationId = station.id
            }
        },

        // 返回
        goBack() {
            uni.navigateBack()
        }
    }
}
</script>

<style lang="scss" scoped>
.station-selector-page {
    min-height: 100vh;
    background: #F5F5F5;

    .nav-bar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 88rpx;
        padding: 0 32rpx;
        background: #FFFFFF;
        border-bottom: 1rpx solid #E5E5E5;

        .nav-left {
            display: flex;
            align-items: center;

            .back-icon {
                width: 40rpx;
                height: 40rpx;
                margin-right: 8rpx;
            }

            .back-text {
                font-family: 'PingFang SC';
                font-style: normal;
                font-weight: 400;
                font-size: 36rpx;
                line-height: 50rpx;
                color: #333333;
            }
        }

        .nav-title {
            font-family: 'PingFang SC';
            font-style: normal;
            font-weight: 400;
            font-size: 36rpx;
            line-height: 50rpx;
            color: #333333;
        }

        .nav-right {
            font-family: 'PingFang SC';
            font-style: normal;
            font-weight: 400;
            font-size: 36rpx;
            line-height: 50rpx;
            color: #333333;
        }
    }

    .my-station-section,
    .other-stations-section {
        margin-top: 40rpx;
        padding: 0 32rpx;

        .section-title {
            padding: 0 0 16rpx 0;
            font-size: 36rpx;
            color: #333;
            font-weight: bold;
        }
    }

    .station-card {
        display: flex;
        align-items: center;
        background: #fff;
        border-radius: 24rpx;
        box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.04);
        margin: 0 0 36rpx 0;
        padding: 0 32rpx;
        height: 128rpx;
        box-sizing: border-box;
        width: 100%;

        &:active {
            opacity: 0.9;
        }

        &.selected-station {
            background-color: #FFFAF5;
        }
    }

    .station-left {
        display: flex;
        align-items: center;
        margin-right: 24rpx;
        flex-shrink: 0;
    }

    .select-circle {
        width: 40rpx;
        height: 40rpx;
        border-radius: 50%;
        border: 3rpx solid #DDDDDD;
        background: #fff;
        margin-right: 20rpx;
        box-sizing: border-box;
        flex-shrink: 0;
        transition: all 0.2s ease;
    }

    .select-circle.selected {
        border: none;
        background: #FF840B;
    }

    .station-blue-icon {
        width: 64rpx;
        height: 64rpx;
        border-radius: 12rpx;
        flex-shrink: 0;
    }

    .station-center {
        display: flex;
        align-items: center;
        flex: 1;
        min-width: 0;
        height: 100%;
        overflow: hidden;
        width: calc(100% - 128rpx);
        /* 减去左侧图标区域宽度 */
    }

    .station-name {
        font-size: 32rpx;
        font-weight: 500;
        color: #333;
        flex: 0 1 auto;
        max-width: 30%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        margin-right: 24rpx;
    }

    .gray-tag {
        background: #F3F4F6;
        color: #B0B3B8;
        font-size: 28rpx;
        border-radius: 12rpx;
        padding: 0 16rpx;
        margin-right: 24rpx;
        height: 48rpx;
        line-height: 48rpx;
        flex-shrink: 0;
        white-space: nowrap;
    }

    .location-wrap {
        display: flex;
        align-items: center;
        margin-left: auto;
        flex-shrink: 0;
        white-space: nowrap;
    }

    .location-icon {
        width: 32rpx;
        height: 32rpx;
        margin-right: 8rpx;
    }

    .distance {
        font-size: 28rpx;
        color: #8A8A8A;
    }

    .loading-state,
    .empty-state {
        text-align: center;
        padding: 120rpx 40rpx;

        .loading-text,
        .empty-text {
            font-size: 28rpx;
            color: #999999;
        }
    }

    .current-tag {
        background: #407BFF !important;
        color: #fff !important;
    }
}

.bottom-safe-area {
    position: fixed;
    left: 0;
    right: 0;
    bottom: env(safe-area-inset-bottom, 0);
    background: transparent;
    display: flex;
    justify-content: center;
    align-items: center;
    padding-bottom: 32rpx;
    z-index: 99;
}

.enter-btn {
    width: 80vw;
    max-width: 600rpx;
    height: 96rpx;
    background: #FF9800;
    color: #fff;
    font-size: 36rpx;
    border: none;
    border-radius: 48rpx;
    text-align: center;
    line-height: 96rpx;
    font-weight: 500;
    box-shadow: 0 8rpx 24rpx rgba(255, 152, 0, 0.10);
    margin: 0 auto;
    transition: background 0.2s;
}

.enter-btn:active {
    background: #ffb74d;
}
</style>
