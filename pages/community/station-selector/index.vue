<template>
    <view class="station-selector-page">
        <!-- 导航栏 -->
        <view class="nav-bar">
            <view class="nav-left" @click="goBack">
                <image class="back-icon" src="/static/icons/back-arrow.svg" mode="aspectFit"></image>
                <text class="back-text">返回</text>
            </view>
            <text class="nav-title">站点</text>
            <text class="nav-right" @click="selectStation">选择</text>
        </view>
        
        <!-- 我的站点区域 -->
        <view class="my-station-section" v-if="myStation">
            <view class="section-title">我的站点</view>
            <view class="station-card my-station">
                <view class="station-left">
                    <image class="station-blue-icon" src="/static/icons/station-selected.png" mode="aspectFit"></image>
                </view>
                <view class="station-center">
                    <text class="station-name">{{ myStation.name }}</text>
                    <view class="station-meta">
                        <view class="current-tag">当前取货点</view>
                        <image class="location-icon" src="/static/icons/location.png" mode="aspectFit"></image>
                        <text class="distance">{{ myStation.distance || '100m' }}</text>
                    </view>
                </view>
            </view>
        </view>
        
        <!-- 其他站点区域 -->
        <view class="other-stations-section">
            <view class="section-title">其他站点</view>
            <view class="station-list">
                <view class="station-card"
                      v-for="station in otherStations" 
                      :key="station.id"
                      :class="{ 'selected': selectedStationId === station.id }"
                      @click="selectOtherStation(station)">
                    <view class="station-left">
                        <view v-if="selectedStationId === station.id" class="select-circle selected">
                            <text class="check">✓</text>
                        </view>
                        <view v-else class="select-circle"></view>
                    </view>
                    <view class="station-center">
                        <text class="station-name">{{ station.name }}</text>
                        <view class="station-meta">
                            <view class="current-tag" v-if="station.status === '当前站点'">当前取货点</view>
                            <image class="location-icon" src="/static/icons/location.png" mode="aspectFit"></image>
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
            loading: false
        }
    },
    onLoad() {
        this.loadStationData();
    },
    methods: {
        // 加载站点数据
        async loadStationData() {
            this.loading = true;
            try {
                // 获取我的社区信息
                await this.loadMyStation();
                // 获取其他站点列表
                await this.loadOtherStations();
            } catch (error) {
                console.error('加载站点数据失败:', error);
            } finally {
                this.loading = false;
            }
        },
        
        // 获取我的站点
        async loadMyStation() {
            try {
                const response = await getMyCommunityInfo();
                if (response.status === 200 && response.data && response.data.is_bind && response.data.community) {
                    this.myStation = {
                        id: response.data.community.id,
                        name: response.data.community.name,
                        distance: '100m',
                        status: '当前站点'
                    };
                }
            } catch (error) {
                console.log('获取我的站点失败:', error);
            }
        },
        
        // 获取其他站点列表
        async loadOtherStations() {
            try {
                const response = await getCommunityList({
                    page: 1,
                    limit: 20
                });
                
                if (response.status === 200 && response.data) {
                    const allStations = response.data.list || response.data;
                    
                    // 过滤掉我的站点，生成其他站点列表
                    this.otherStations = allStations
                        .filter(station => !this.myStation || station.id !== this.myStation.id)
                        .map((station, index) => ({
                            id: station.id,
                            name: station.name,
                            distance: this.generateDistance(index),
                            status: '仅可预览'
                        }));
                }
            } catch (error) {
                console.log('获取其他站点失败:', error);
            }
        },
        
        // 生成距离信息（模拟数据）
        generateDistance(index) {
            const distances = ['200m', '500m', '1km', '2km', '3km'];
            return distances[index % distances.length];
        },
        
        // 选择我的站点
        selectMyStation() {
            if (this.myStation) {
                this.selectedStationId = this.myStation.id;
            }
        },
        
        // 选择其他站点
        selectOtherStation(station) {
            this.selectedStationId = station.id;
        },
        
        // 确认选择站点
        selectStation() {
            if (!this.selectedStationId) {
                uni.showToast({
                    title: '请选择一个站点',
                    icon: 'none'
                });
                return;
            }
            
            // 找到选中的站点
            let selectedStation = null;
            if (this.myStation && this.selectedStationId === this.myStation.id) {
                selectedStation = this.myStation;
            } else {
                selectedStation = this.otherStations.find(s => s.id === this.selectedStationId);
            }
            
            if (selectedStation) {
                // 返回选中的站点信息
                const pages = getCurrentPages();
                const prevPage = pages[pages.length - 2];
                if (prevPage && prevPage.onStationSelected) {
                    prevPage.onStationSelected(selectedStation);
                }
                
                uni.navigateBack();
            }
        },
        
        // 返回
        goBack() {
            uni.navigateBack();
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
        height: 44px;
        padding: 0 16px;
        background: #FFFFFF;
        border-bottom: 1px solid #E5E5E5;
        
        .nav-left {
            display: flex;
            align-items: center;
            
            .back-icon {
                width: 20px;
                height: 20px;
                margin-right: 4px;
            }
            
            .back-text {
                font-size: 16px;
                color: #007AFF;
            }
        }
        
        .nav-title {
            font-size: 17px;
            font-weight: 600;
            color: #000000;
        }
        
        .nav-right {
            font-size: 16px;
            color: #007AFF;
        }
    }
    
    .my-station-section, .other-stations-section {
        margin-top: 20px;
        
        .section-title {
            padding: 0 16px 8px;
            font-size: 14px;
            color: #666666;
        }
    }
    
    .station-card {
        display: flex;
        align-items: center;
        background: #fff;
        border-radius: 16px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.04);
        margin: 12px 16px 0 16px;
        padding: 12px 16px;
        position: relative;
        min-height: 56px;
    }

    .station-left {
        width: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    // 蓝色icon（我的站点）
    .station-blue-icon {
        width: 24px;
        height: 24px;
        border-radius: 6px;
    }

    // 选择圆点（其它站点）
    .select-circle {
        width: 18px;
        height: 18px;
        border-radius: 50%;
        background: #FF840B;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .select-circle.selected {
        background: #FF840B;
        border: 2px solid #FF840B;
    }
    .check {
        color: #fff;
        font-size: 14px;
        font-weight: bold;
    }

    .station-center {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        margin-left: 10px;
        min-width: 0;
    }
    .station-name {
        font-size: 16px;
        font-weight: 500;
        color: #333;
        margin-bottom: 6px;
        max-width: 180px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .station-meta {
        display: flex;
        align-items: center;
        gap: 8px;
    }
    .current-tag {
        background: #407BFF;
        color: #fff;
        font-size: 12px;
        border-radius: 6px;
        padding: 2px 8px;
        margin-right: 6px;
    }
    .location-icon {
        width: 14px;
        height: 14px;
        margin-right: 2px;
    }
    .distance {
        font-size: 12px;
        color: #999;
    }
    
    .loading-state, .empty-state {
        text-align: center;
        padding: 60px 20px;
        
        .loading-text, .empty-text {
            font-size: 14px;
            color: #999999;
        }
    }
}
</style>
