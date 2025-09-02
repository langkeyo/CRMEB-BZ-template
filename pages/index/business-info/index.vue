<template>
    <view class="business-info-page">

        <!-- 顶部区域 -->
        <view class="header">
            <view class="back-btn" @click="goBack">
                <image class="back-icon" src="/static/images/index/business-info/back_arrow.svg" />
            </view>

            <!-- 搜索框 -->
            <view class="search-container">
                <view class="search-box">
                    <image class="search-icon" src="/static/icons/search.svg" />
                    <input class="search-input" type="text" v-model="keyword" placeholder="搜索项目名称" @confirm="searchItems" />
                </view>
                <view class="search-btn" @click="searchItems">搜索</view>
            </view>
        </view>

        <view class="content-wrapper">
            <!-- 顶部banner图 -->
            <view class="banner-container">
                <swiper
                    class="banner-swiper"
                    :indicator-dots="false"
                    :autoplay="true"
                    :interval="3000"
                    :duration="500"
                    :circular="true"
                    @change="onBannerChange"
                >
                    <swiper-item v-for="(banner, index) in bannerList" :key="banner.id">
                        <image class="banner-img" :src="banner.image" mode="aspectFill" />
                        <view class="banner-gradient"></view>
                    </swiper-item>
                </swiper>

                <!-- 轮播指示器 -->
                <view class="banner-dots">
                    <view
                        v-for="(banner, index) in bannerList"
                        :key="banner.id"
                        :class="index === currentBannerIndex ? 'active-dot' : 'dot'"
                        @click="switchBanner(index)"
                    ></view>
                </view>
            </view>

            <!-- filter-tabs -->
            <view class="filter-tabs">
                <!-- areas -->
                <view class="tab-item" :class="{ 'active': activeFilter === 'area' }" @click="selectFilter('area')">
                    <text class="tab-text">区域</text>
                    <text class="tab-arrow">^</text>
                </view>

                <!-- community -->
                <view class="tab-item" :class="{ 'active': activeFilter === 'community' }" @click="selectFilter('community')">
                    <text class="tab-text">社区</text>
                    <text class="tab-arrow">^</text>
                </view>

                <!-- site -->
                <view class="tab-item" :class="{ 'active': activeFilter === 'station' }" @click="selectFilter('station')">
                    <text class="tab-text">站点</text>
                    <text class="tab-arrow">^</text>
                </view>

                <!-- more -->
                <view class="tab-item more-tab" :class="{ 'active': activeFilter === 'more' }" @click="toggleMoreOptions">
                    <text class="tab-text more-text">{{ activeMoreOption }}</text>
                    <text class="tab-arrow more-arrow" :class="{ 'arrow-rotated': showMoreOptions }">^</text>

                    <!-- pop-up-menu -->
                    <view class="dropdown-menu" v-if="showMoreOptions">
                        <!-- 小尾巴 -->
                        <view class="menu-tail"></view>
                        <!-- 菜单内容 -->
                        <view class="menu-content">
                            <view class="dropdown-item" @click="selectMoreOption('加盟')" :class="{ 'active-item': currentType === 'franchise' }">
                                <text>加盟</text>
                            </view>
                            <view class="dropdown-item" @click="selectMoreOption('招商合作')" :class="{ 'active-item': currentType === 'cooperation' }">
                                <text>招商合作</text>
                            </view>
                            <view class="dropdown-item" @click="selectMoreOption('便民服务')" :class="{ 'active-item': currentType === 'service' }">
                                <text>便民服务</text>
                            </view>
                        </view>
                    </view>
                </view>
            </view>

            <!-- 列表区域 -->
            <scroll-view scroll-y class="business-list" @scrolltolower="onScrollToLower">
                <!-- 内容容器 -->
                <view class="content-container">
                    <!-- 加盟商家列表 -->
                    <transition name="slide-fade">
                        <view v-if="currentType === 'franchise'" key="franchise" class="list-container">
                            <view class="franchise-list">
                                <view class="franchise-card" v-for="item in franchiseList" :key="item.id" @click="viewDetail(item.id)">
                                    <!-- 内容 -->
                                    <view class="business-img-box">
                                        <image class="business-img" :src="item.image || '/static/images/empty.png'" mode="aspectFill" />
                                    </view>
                                    <view class="business-info">
                                        <view class="business-title">{{ item.name }}</view>
                                        <view class="business-desc">加盟费：{{ item.fee }}</view>
                                        <view class="business-desc">{{ item.desc }}</view>
                                        <view class="business-tag">{{ item.tag }}</view>
                                    </view>
                                    <view class="view-btn">查看</view>
                                </view>
                                
                                <!-- 加载状态 -->
                                <view class="loading-state" v-if="pageParams.franchise.loading">
                                    <view class="loading-spinner"></view>
                                    <text class="loading-text">加载中...</text>
                                </view>
                                
                                <!-- 没有更多 -->
                                <view class="no-more-state" v-if="!pageParams.franchise.loading && pageParams.franchise.finished && franchiseList.length > 0">
                                    <text class="no-more-text">没有更多了</text>
                                </view>
                                
                                <!-- 空状态 -->
                                <view class="empty-state" v-if="!pageParams.franchise.loading && franchiseList.length === 0">
                                    <image class="empty-icon" src="/static/images/empty.png" mode="aspectFit"></image>
                                    <text class="empty-text">暂无数据</text>
                                </view>
                            </view>
                        </view>
                    </transition>

                    <!-- 招商合作列表 -->
                    <transition name="slide-fade">
                        <view v-if="currentType === 'cooperation'" key="cooperation" class="list-container">
                            <view class="cooperation-list">
                                <view class="cooperation-card" v-for="item in cooperationList" :key="item.id" @click="viewBusinessDetail(item.id)">
                                    <!-- 内容 -->
                                    <!-- 项目标题 -->
                                    <view class="cooperation-title">{{ item.name }}</view>
                                    
                                    <!-- 标签组 -->
                                    <view class="cooperation-tag-group">
                                        <view class="cooperation-tag" v-for="(tag, tagIndex) in item.tags" :key="tagIndex">{{ tag }}</view>
                                    </view>
                                    
                                    <!-- 信息区域 -->
                                    <view class="info-section">
                                        <!-- 第一行：对接费用 + 房屋租金 -->
                                        <view class="info-row">
                                            <view class="info-item contact-fee">对接费用：{{ item.contactFee }}</view>
                                            <view class="info-item rent-fee">房屋租金：{{ item.rentFee }}</view>
                                        </view>
                                        
                                        <!-- 第二行：招商类别 + 房屋面积 -->
                                        <view class="info-row">
                                            <view class="info-item category">招商类别：{{ item.category }}</view>
                                            <view class="info-item area">房屋面积：{{ item.area }}</view>
                                        </view>
                                        
                                        <!-- 第三行：招商区域 -->
                                        <view class="info-row">
                                            <view class="info-item region">招商区域：{{ item.region }}</view>
                                        </view>
                                    </view>
                                    
                                    <!-- 查看按钮 -->
                                    <view class="preview-button">
                                        <view class="preview-btn-text">查看</view>
                                    </view>
                                </view>
                                
                                <!-- 加载状态 -->
                                <view class="loading-state" v-if="pageParams.cooperation.loading">
                                    <view class="loading-spinner"></view>
                                    <text class="loading-text">加载中...</text>
                                </view>
                                
                                <!-- 没有更多 -->
                                <view class="no-more-state" v-if="!pageParams.cooperation.loading && pageParams.cooperation.finished && cooperationList.length > 0">
                                    <text class="no-more-text">没有更多了</text>
                                </view>
                                
                                <!-- 空状态 -->
                                <view class="empty-state" v-if="!pageParams.cooperation.loading && cooperationList.length === 0">
                                    <image class="empty-icon" src="/static/images/empty.png" mode="aspectFit"></image>
                                    <text class="empty-text">暂无数据</text>
                                </view>
                            </view>
                        </view>
                    </transition>

                    <!-- 便民服务列表 -->
                    <transition name="slide-fade">
                        <view v-if="currentType === 'service'" key="service" class="list-container">
                            <view class="service-list">
                                <view class="service-card" v-for="item in serviceList" :key="item.id" @click="viewServiceDetail(item.id)">
                                    <!-- 内容 -->
                                    <!-- left 左侧图片 -->
                                    <view class="service-left">
                                        <image :src="item.image" mode="aspectFill" class="service-image"></image>
                                    </view>
                                    
                                    <!-- right 右侧内容 -->
                                    <view class="service-right">
                                        <!-- 服务标题 -->
                                        <view class="service-title">{{ item.name }}</view>
                                        
                                        <!-- service-coverage 服务覆盖区域 -->
                                        <view class="service-coverage">
                                            <view class="coverage-bg"></view>
                                            <view class="coverage-text">{{ item.area }} {{ item.serviceType }}</view>
                                        </view>
                                        
                                        <!-- review 评分区域 -->
                                        <view class="service-review">
                                            <!-- 星级评分 -->
                                            <view class="rating-stars">
                                                <image v-for="n in 5" :key="n" class="star-icon" src="/static/images/index/business-info/review_star.svg" mode="aspectFit" />
                                            </view>
                                            <!-- 评分数字 -->
                                            <view class="rating-score">{{ item.rating }}</view>
                                        </view>
                                        
                                        <!-- 平台保障 -->
                                        <view class="service-guarantee">平台保障</view>
                                        
                                        <!-- view-btn 查看按钮 -->
                                        <view class="view-btn">
                                            <view class="btn-bg"></view>
                                            <view class="btn-text">查看</view>
                                        </view>
                                    </view>
                                </view>
                                
                                <!-- 加载状态 -->
                                <view class="loading-state" v-if="pageParams.service.loading">
                                    <view class="loading-spinner"></view>
                                    <text class="loading-text">加载中...</text>
                                </view>
                                
                                <!-- 没有更多 -->
                                <view class="no-more-state" v-if="!pageParams.service.loading && pageParams.service.finished && serviceList.length > 0">
                                    <text class="no-more-text">没有更多了</text>
                                </view>
                                
                                <!-- 空状态 -->
                                <view class="empty-state" v-if="!pageParams.service.loading && serviceList.length === 0">
                                    <image class="empty-icon" src="/static/images/empty.png" mode="aspectFit"></image>
                                    <text class="empty-text">暂无数据</text>
                                </view>
                            </view>
                        </view>
                    </transition>
                </view>
            </scroll-view>
        </view>

        <!-- 底部安全区 -->
        <view class="safe-area-bottom"></view>
    </view>
</template>

<script>
import {
    getFranchiseList,
    getCooperationList,
    getConvenientServiceList
} from '@/api/group.js'
import { HTTP_REQUEST_URL } from '@/config/app.js'

export default {
    name: 'BusinessInfoPage',
    data () {
        return {
            keyword: '',
            activeFilter: '', // 默认不选中任何过滤器
            moreOptions: ['加盟', '招商合作', '便民服务'], // 更多选项列表
            showMoreOptions: false, // 是否显示下拉菜单
            activeMoreOption: '更多', // 当前选中的更多选项
            currentType: 'franchise', // 当前显示的数据类型：franchise(加盟), business(招商合作), service(便民服务)
            isLoading: false, // 加载状态
            // 分页参数
            pageParams: {
                franchise: { page: 1, limit: 10, loading: false, finished: false },
                cooperation: { page: 1, limit: 10, loading: false, finished: false },
                service: { page: 1, limit: 10, loading: false, finished: false }
            },
            // 筛选参数
            selectedArea: '',
            selectedCategory: '',
            // 轮播图数据（暂时让同一张图片轮播4次，方便后续接口对接）
            bannerList: [
                {
                    id: 1,
                    image: '/static/images/index/business-info/business_header.png',
                    title: '商机无限，等你发现'
                },
                {
                    id: 2,
                    image: '/static/images/index/business-info/business_header.png',
                    title: '优质项目，轻松加盟'
                },
                {
                    id: 3,
                    image: '/static/images/index/business-info/business_header.png',
                    title: '创业首选，成功起航'
                },
                {
                    id: 4,
                    image: '/static/images/index/business-info/business_header.png',
                    title: '合作共赢，共创未来'
                }
            ],
            currentBannerIndex: 0, // 当前轮播图索引
            bannerTimer: null, // 轮播定时器
            franchiseList: [], // 加盟列表数据
            cooperationList: [], // 招商合作列表数据
            businessList: [
                {
                    id: 1,
                    name: '瑞幸咖啡 Luckin Coffee',
                    image: '/static/images/index/business-info/luckin_coffee.png',
                    fee: '12万~18万',
                    desc: '全国加盟上万家，饮品行业领头者',
                    tag: '全国连锁'
                },
                {
                    id: 2,
                    name: '盒马生鲜',
                    image: '/static/images/index/business-info/mixue.png',
                    fee: '11万~15万',
                    desc: '专注有机产品，让您更放心',
                    tag: '全国连锁'
                },
                {
                    id: 3,
                    name: '蜜雪冰城',
                    image: '/static/images/index/business-info/mixue_image.png',
                    fee: '8万~12万',
                    desc: '低价高销量，年轻人喜爱的品牌',
                    tag: '全国连锁'
                },

            ],
            // 招商合作列表
            businessCooperationList: [
                {
                    id: 101,
                    name: '万霖大厦B1楼餐饮项目',
                    tags: ['知名商圈', '办公楼'],
                    contactFee: '10000元',
                    rentFee: '5-10万/月',
                    category: '餐饮',
                    area: '110㎡',
                    region: '海淀区'
                },
                {
                    id: 102,
                    name: '三里山3.3大厦餐饮项目',
                    tags: ['知名商圈', '办公楼'],
                    contactFee: '10000元',
                    rentFee: '5~10万/月',
                    category: '餐饮',
                    area: '110m²',
                    region: '海淀区'
                },
                {
                    id: 103,
                    name: '酒仙桥宏源大厦5楼餐饮项目',
                    tags: ['知名商圈', '办公楼'],
                    contactFee: '10000元',
                    rentFee: '5~10万/月',
                    category: '餐饮',
                    area: '110m²',
                    region: '海淀区'
                },
                {
                    id: 104,
                    name: '商业中心A区餐饮项目',
                    tags: ['知名商圈', '办公楼'],
                    contactFee: '10000元',
                    rentFee: '5~10万/月',
                    category: '餐饮',
                    area: '110m²',
                    region: '海淀区'
                }
            ],
            // 便民服务列表
            serviceList: [
                {
                    id: 201,
                    name: '快速上门开荒深度清洁地毯',
                    image: '/static/images/index/business-info/service_img1.png',
                    area: '全朝阳',
                    serviceType: '可服务',
                    rating: '5.0'
                },
                {
                    id: 202,
                    name: '上门开锁（各种锁可开）',
                    image: '/static/images/index/business-info/service_img2.png',
                    area: '全朝阳',
                    serviceType: '可服务',
                    rating: '5.0'
                },
                {
                    id: 203,
                    name: '全职保姆服务',
                    image: '/static/images/index/business-info/service_img3.png',
                    area: '全朝阳',
                    serviceType: '可服务',
                    rating: '5.0'
                },
                {
                    id: 204,
                    name: '天使家政-月嫂',
                    image: '/static/images/index/business-info/service_img4.png',
                    area: '全朝阳',
                    serviceType: '可服务',
                    rating: '5.0'
                },
                {
                    id: 205,
                    name: '电器维修高级维修师傅',
                    image: '/static/images/index/business-info/service_img5.png',
                    area: '全朝阳',
                    serviceType: '可服务',
                    rating: '5.0'
                }
            ]
        }
    },
    onLoad() {
        // 初始化数据
        this.franchiseList = this.businessList || [];
        this.cooperationList = this.businessCooperationList || [];
        
        // 根据当前类型加载对应数据
        this.loadDataByType();
    },
    methods: {
        // 加载初始数据
        loadInitialData() {
            // 根据当前类型加载数据
            if (this.currentType === 'franchise') {
                this.loadFranchiseList();
            } else if (this.currentType === 'cooperation') {
                this.loadCooperationList();
            } else if (this.currentType === 'service') {
                this.loadServiceList();
            }
        },
        goBack () {
            uni.navigateBack()
        },
        viewDetail (id) {
            uni.navigateTo({
                url: `/pages/index/business-info/franchise/index?id=${id}`
            })
        },

        viewBusinessDetail (id) {
            uni.navigateTo({
                url: `/pages/index/business-info/business-cooperation/index?id=${id}`
            })
        },

        viewServiceDetail (id) {
            console.log('查看服务详情', id);
            uni.navigateTo({
                url: `/pages/index/business-info/service-detail?id=${id}`
            });
        },
        search () {
            // 打开搜索页面
            uni.navigateTo({
                url: `/pages/goods_search/index`
            });
        },
        selectFilter (filter) {
            // 这些按钮暂时只是显示选中状态，不切换内容
            // 实际应用中可以显示对应的下拉选项
            this.activeFilter = filter
            this.showMoreOptions = false // 关闭更多选项下拉菜单

            const filterName = filter === 'area' ? '区域' :
                             filter === 'community' ? '社区' :
                             filter === 'station' ? '站点' : this.activeMoreOption

            uni.showToast({
                title: `选择了${filterName}筛选`,
                icon: 'none',
                duration: 1000
            })
        },

        // 切换下拉菜单显示/隐藏
        toggleMoreOptions() {
            this.showMoreOptions = !this.showMoreOptions
            // 如果打开了下拉菜单，将当前过滤器设置为more
            if (this.showMoreOptions) {
                this.activeFilter = 'more'
            }
        },

        // 选择下拉菜单项
        selectMoreOption(option) {
            // 如果选择的是当前已选中的选项，直接返回
            if (this.activeMoreOption === option) {
                this.showMoreOptions = false
                return
            }

            this.activeMoreOption = option
            this.showMoreOptions = false
            this.activeFilter = 'more'

            // 根据选择的选项切换数据类型
            let newType = 'franchise'
            if (option === '加盟') {
                newType = 'franchise'
            } else if (option === '招商合作') {
                newType = 'cooperation' // 修正为cooperation
            } else if (option === '便民服务') {
                newType = 'service'
            }

            // 切换数据类型并加载对应数据
            console.log('切换到类型:', newType);
            this.currentType = newType
            this.loadDataByType(); // 调用API加载数据

            uni.showToast({
                title: `已切换到${option}`,
                icon: 'success',
                duration: 1000
            })
        },

        // 轮播图切换事件
        onBannerChange(e) {
            this.currentBannerIndex = e.detail.current
        },

        // 手动切换轮播图
        switchBanner(index) {
            this.currentBannerIndex = index
            // 这里可以通过swiper的API来切换，但uni-app的swiper组件没有直接的API
            // 所以我们只更新指示器状态，实际切换由用户滑动完成
        },

        // 根据类型加载数据
        loadDataByType() {
            console.log('当前类型:', this.currentType);
            switch (this.currentType) {
                case 'franchise':
                    console.log('加载加盟数据');
                    this.loadFranchiseData();
                    break;
                case 'cooperation':
                    console.log('加载招商合作数据');
                    this.loadCooperationData();
                    break;
                case 'service':
                    console.log('加载便民服务数据');
                    this.loadServiceData();
                    break;
                default:
                    console.log('默认加载加盟数据');
                    this.loadFranchiseData(); // 默认加载加盟数据
            }
        },

        // 加载加盟项目数据
        async loadFranchiseData() {
            try {
                this.isLoading = true;
                const response = await getFranchiseList({
                    page: 1,
                    limit: 10
                });

                if (response.status === 200 && response.data) {
                    // 映射后端数据到页面需要的字段格式
                    this.businessList = (response.data.list || []).map(item => ({
                        id: item.id,
                        name: item.title, // title -> name
                        fee: item.franchise_fee, // franchise_fee -> fee
                        desc: item.intro, // intro -> desc
                        tag: item.multiple_type, // multiple_type -> tag
                        image: item.image ? this.getImageUrl(item.image) : '/static/images/index/business-info/luckin_coffee.png' // 兼容处理图片URL
                    }));
                    // 同时更新franchiseList
                    this.franchiseList = this.businessList;
                    console.log('加盟项目数据加载成功:', this.businessList);
                }
            } catch (error) {
                console.error('加载加盟项目失败:', error);

                // 检查是否是登录相关错误
                if (error && error.isLoginError) {
                    // 登录相关错误已经由request.js自动处理，这里不需要额外操作
                    console.log('登录状态失效，已自动跳转到登录页面');
                    return;
                }

                // 其他错误显示提示
                uni.showToast({
                    title: error.msg || '加载失败',
                    icon: 'none'
                });
            } finally {
                this.isLoading = false;
            }
        },

        // 加载招商合作数据
        async loadCooperationData() {
            try {
                this.isLoading = true;
                const response = await getCooperationList({
                    page: 1,
                    limit: 10
                });

                if (response.status === 200 && response.data) {
                    // 映射后端数据到页面需要的字段格式
                    this.businessCooperationList = (response.data.list || []).map(item => ({
                        id: item.id,
                        name: item.title || '招商合作项目',
                        tags: item.tags ? item.tags.split('|') : ['优质项目', '合作共赢'], // 使用|分割
                        contactFee: '面议', // API中没有此字段，使用默认值
                        rentFee: '面议', // API中没有此字段，使用默认值
                        category: item.categroy || '餐饮', // 招商类别
                        area: item.floor_space || '面积待定', // 房屋面积
                        region: item.district_name || '全国', // 招商区域
                        image: item.image ? this.getImageUrl(item.image) : '' // 使用helper处理图片URL
                    }));
                    // 同时更新cooperationList
                    this.cooperationList = this.businessCooperationList;
                    console.log('招商合作数据加载成功:', this.businessCooperationList);
                }
            } catch (error) {
                console.error('加载招商合作失败:', error);

                // 检查是否是登录相关错误
                if (error && error.isLoginError) {
                    // 登录相关错误已经由request.js自动处理，这里不需要额外操作
                    console.log('登录状态失效，已自动跳转到登录页面');
                    return;
                }

                // 其他错误显示提示
                uni.showToast({
                    title: error.msg || '加载失败',
                    icon: 'none'
                });
            } finally {
                this.isLoading = false;
            }
        },

        // 加载便民服务数据
        async loadServiceData() {
            try {
                this.isLoading = true;
                const response = await getConvenientServiceList({
                    page: 1,
                    limit: 10
                });

                if (response.status === 200 && response.data) {
                    // 映射后端数据到页面需要的字段格式
                    this.serviceList = (response.data.list || []).map(item => ({
                        id: item.id,
                        name: item.title || '便民服务',
                        image: item.image ? this.getImageUrl(item.image) : '/static/images/index/business-info/service_default.png',
                        area: item.district_name || '全市', // 使用district_name作为区域
                        serviceType: item.tags ? item.tags.split('|')[0] : '服务', // 使用tags的第一个作为服务类型
                        rating: item.star ? item.star.toString() : '5.0' // 使用star字段作为评分
                    }));
                    console.log('便民服务数据加载成功:', this.serviceList);
                }
            } catch (error) {
                console.error('加载便民服务失败:', error);

                // 检查是否是登录相关错误
                if (error && error.isLoginError) {
                    // 登录相关错误已经由request.js自动处理，这里不需要额外操作
                    console.log('登录状态失效，已自动跳转到登录页面');
                    return;
                }

                // 其他错误显示提示
                uni.showToast({
                    title: error.msg || '加载失败',
                    icon: 'none'
                });
            } finally {
                this.isLoading = false;
            }
        },

        // Helper to handle image URLs
        getImageUrl(url) {
            if (!url) return url; // 如果url为null或undefined，直接返回
            if (url.startsWith('http://') || url.startsWith('https://')) {
                return url; // 已经是完整URL，直接返回
            }
            if (url.startsWith('/static/')) {
                return url; // 本地静态资源，直接返回
            }
            if (url.startsWith('/')) {
                return `${HTTP_REQUEST_URL}${url}`; // 以/开头的相对路径，拼接域名
            }
            // 其他情况，也拼接域名
            return `${HTTP_REQUEST_URL}/${url}`;
        },

        // 搜索项目
        searchItems() {
            // 重置分页并搜索
            this.resetPageParams();
            
            // 根据当前类型执行对应的搜索
            if (this.currentType === 'franchise') {
                this.loadFranchiseList(true);
            } else if (this.currentType === 'cooperation') {
                this.loadCooperationList(true);
            } else if (this.currentType === 'service') {
                this.loadServiceList(true);
            }
        },

        // 重置分页参数
        resetPageParams() {
            this.pageParams = {
                franchise: { page: 1, limit: 10, loading: false, finished: false },
                cooperation: { page: 1, limit: 10, loading: false, finished: false },
                service: { page: 1, limit: 10, loading: false, finished: false }
            };
            
            // 清空对应数据
            if (this.currentType === 'franchise') {
                this.franchiseList = [];
            } else if (this.currentType === 'cooperation') {
                this.cooperationList = [];
            } else if (this.currentType === 'service') {
                this.serviceList = [];
            }
        },

        // 加载加盟项目列表
        loadFranchiseList(isRefresh = false) {
            const params = this.pageParams.franchise;
            if (params.loading || params.finished) return;
            
            params.loading = true;
            this.isLoading = true;
            
            getFranchiseList({
                page: params.page,
                limit: params.limit,
                search: this.keyword,
                area: this.selectedArea,
                category: this.selectedCategory
            }).then(res => {
                params.loading = false;
                this.isLoading = false;
                
                if (res.status === 200 && res.data) {
                    const list = res.data.list || [];
                    
                    if (isRefresh) {
                        this.franchiseList = list;
                    } else {
                        this.franchiseList = [...this.franchiseList, ...list];
                    }
                    
                    params.finished = list.length < params.limit;
                    
                    if (!params.finished) {
                        params.page++;
                    }
                } else {
                    uni.showToast({
                        title: res.msg || '加载失败',
                        icon: 'none'
                    });
                }
            }).catch(err => {
                params.loading = false;
                this.isLoading = false;
                
                console.error('加载加盟项目失败:', err);
                uni.showToast({
                    title: '网络错误',
                    icon: 'none'
                });
            });
        },

        // 加载招商合作列表
        loadCooperationList(isRefresh = false) {
            const params = this.pageParams.cooperation;
            if (params.loading || params.finished) return;
            
            params.loading = true;
            this.isLoading = true;
            
            getCooperationList({
                page: params.page,
                limit: params.limit,
                search: this.keyword,
                area: this.selectedArea,
                category: this.selectedCategory
            }).then(res => {
                params.loading = false;
                this.isLoading = false;
                
                if (res.status === 200 && res.data) {
                    const list = (res.data.list || []).map(item => ({
                        id: item.id,
                        name: item.title || '招商合作项目',
                        tags: item.tags ? item.tags.split('|') : ['优质项目', '合作共赢'], // 使用|分割
                        contactFee: '面议', // API中没有此字段，使用默认值
                        rentFee: '面议', // API中没有此字段，使用默认值
                        category: item.categroy || '餐饮', // 招商类别
                        area: item.floor_space || '面积待定', // 房屋面积
                        region: item.district_name || '全国', // 招商区域
                        image: item.image ? this.getImageUrl(item.image) : '' // 使用helper处理图片URL
                    }));
                    
                    if (isRefresh) {
                        this.cooperationList = list;
                    } else {
                        this.cooperationList = [...this.cooperationList, ...list];
                    }
                    
                    params.finished = list.length < params.limit;
                    
                    if (!params.finished) {
                        params.page++;
                    }
                } else {
                    uni.showToast({
                        title: res.msg || '加载失败',
                        icon: 'none'
                    });
                }
            }).catch(err => {
                params.loading = false;
                this.isLoading = false;
                
                console.error('加载招商合作失败:', err);
                uni.showToast({
                    title: '网络错误',
                    icon: 'none'
                });
            });
        },

        // 加载便民服务列表
        loadServiceList(isRefresh = false) {
            const params = this.pageParams.service;
            if (params.loading || params.finished) return;
            
            params.loading = true;
            this.isLoading = true;
            
            getConvenientServiceList({
                page: params.page,
                limit: params.limit,
                search: this.keyword,
                category: this.selectedCategory
            }).then(res => {
                params.loading = false;
                this.isLoading = false;
                
                if (res.status === 200 && res.data) {
                    const list = res.data.list || [];
                    
                    if (isRefresh) {
                        this.serviceList = list;
                    } else {
                        this.serviceList = [...this.serviceList, ...list];
                    }
                    
                    params.finished = list.length < params.limit;
                    
                    if (!params.finished) {
                        params.page++;
                    }
                } else {
                    uni.showToast({
                        title: res.msg || '加载失败',
                        icon: 'none'
                    });
                }
            }).catch(err => {
                params.loading = false;
                this.isLoading = false;
                
                console.error('加载便民服务失败:', err);
                uni.showToast({
                    title: '网络错误',
                    icon: 'none'
                });
            });
        },

        // 处理滚动到底部加载更多
        onScrollToLower() {
            // 根据当前类型加载更多
            if (this.currentType === 'franchise') {
                this.loadFranchiseList();
            } else if (this.currentType === 'cooperation') {
                this.loadCooperationList();
            } else if (this.currentType === 'service') {
                this.loadServiceList();
            }
        }
    }
}
</script>

<style lang="scss" scoped>
page {
    background: #F7F7F7;
}

.business-info-page {
    min-height: 100vh;
    background: #F7F7F7;
    font-family: 'PingFang SC', sans-serif;
    position: relative;
    display: flex;
    flex-direction: column;
}

.status-bar {
    height: 0; /* 移除状态栏高度，因为header从顶部开始 */
    background: #FFFFFF;
}

/* 头部样式 */
.header {
    display: flex;
    align-items: center;
    padding: 20rpx 20rpx 20rpx 0;
    background: #FFFFFF;
    position: relative;
    z-index: 50;
    
    .back-btn {
        width: 80rpx;
        height: 80rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        
        .back-icon {
            width: 40rpx;
            height: 40rpx;
        }
    }
}

/* 搜索框样式 */
.search-container {
    flex: 1;
    display: flex;
    align-items: center;
    padding-left: 30rpx;
    
    .search-box {
        flex: 1;
        height: 70rpx;
        background-color: #F5F5F5;
        border-radius: 35rpx;
        display: flex;
        align-items: center;
        padding: 0 30rpx;
        
        .search-icon {
            width: 40rpx;
            height: 40rpx;
            margin-right: 10rpx;
        }
        
        .search-input {
            flex: 1;
            height: 70rpx;
            font-size: 28rpx;
            color: #333;
        }
    }
    
    .search-btn {
        width: 120rpx;
        height: 70rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #333;
        font-size: 28rpx;
    }
}

/* 内容包装器 */
.content-wrapper {
    display: flex;
    flex-direction: column;
    flex: 1;
    width: 100%;
    box-sizing: border-box;
    padding: 0;
}

/* banner-section */
.banner-container {
    width: 702rpx; /* 351px * 2 */
    height: 202rpx; /* 101px * 2 */
    margin: 20rpx auto 0;
    overflow: hidden;
    border-radius: 8rpx; /* 4px * 2 */
    position: relative;

    /* swiper */
    .banner-swiper {
        width: 100%;
        height: 100%;
    }

    /* image */
    .banner-img {
        width: 100%;
        height: 100%;
        border-radius: 8rpx; /* 4px * 2 */
        object-fit: cover;
    }

    /* Rectangle 467 */
    .banner-gradient {
        position: absolute;
        width: 148rpx; /* 74px * 2 */
        height: 692rpx; /* 346px * 2 */
        left: 30rpx; /* 15px * 2 */
        top: 54rpx; /* 调整相对位置 */
        background: linear-gradient(90deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.2) 100%);
        border-radius: 0px 8rpx 8rpx 0px; /* 4px * 2 */
        transform: matrix(0, 1, 1, 0, 0, 0);
    }

    /* dot container */
    .banner-dots {
        position: absolute;
        bottom: 10rpx; /* 距离底部10rpx */
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        align-items: center;
        gap: 8rpx; /* 4px * 2 */
        z-index: 10;

        /* active-dot */
        .active-dot {
            width: 24rpx; /* 12px * 2 */
            height: 6rpx; /* 3px * 2 */
            background: #ED7237;
            border-radius: 16rpx; /* 8px * 2 */
            transition: all 0.3s ease;
            cursor: pointer;
        }

        /* Rectangle 4, 5, 6 */
        .dot {
            width: 6rpx; /* 3px * 2 */
            height: 6rpx; /* 3px * 2 */
            background: #FFFFFF;
            border-radius: 16rpx; /* 8px * 2 */
            transition: all 0.3s ease;
            cursor: pointer;

            &:hover {
                background: rgba(237, 114, 55, 0.7);
            }
        }
    }
}

/* filter-tabs */
.filter-tabs {
    display: flex;
    width: 702rpx; /* 351px * 2 */
    height: 52rpx; /* 26px * 2 */
    margin: 20rpx auto 0;
    gap: 22rpx; /* 按钮之间的间距 */
}

/* tab-item 通用样式 */
.tab-item {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 160rpx; /* 80px * 2 */
    height: 52rpx; /* 26px * 2 */
    background: #FFFFFF;
    border-radius: 36rpx; /* 18px * 2 */
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
    gap: 12rpx; /* 文字和箭头间距 6px * 2 */

    .tab-text {
        font-family: 'PingFang SC';
        font-style: normal;
        font-weight: 400;
        font-size: 24rpx; /* 12px * 2 */
        line-height: 34rpx; /* 17px * 2 */
        color: #333333;
        transition: color 0.3s ease;
    }

    .tab-arrow {
        font-size: 18rpx; /* 9px * 2 */
        color: #D9D9D9;
        transform: rotate(180deg); /* 默认向下 */
        transition: all 0.3s ease;
        line-height: 1;
    }

    &.active {
        .tab-text {
            color: #47B9FB;
        }
        .tab-arrow {
            color: #47B9FB;
        }
    }
}

/* more tab 特殊样式 */
.more-tab {
    width: 156rpx; /* 78px * 2，比其他按钮稍宽 */
    z-index: 10; /* 确保下拉菜单在上层 */

    .more-text {
        color: #47B9FB; /* 更多按钮文字为蓝色 */
    }

    .more-arrow {
        color: #47B9FB; /* 更多按钮箭头为蓝色 */

        &.arrow-rotated {
            transform: rotate(0deg); /* 展开后向上 */
        }
    }
}

/* dropdown-menu */
.dropdown-menu {
    position: absolute;
    top: 62rpx; /* 26px + 5px = 31px * 2 */
    right: 0;
    width: 142rpx; /* 71px * 2 */
    height: 196rpx; /* 98px * 2 */
    z-index: 100;
    animation: dropdownSlideIn 0.3s ease-out;
    transform-origin: top right;

    /* 小尾巴 */
    .menu-tail {
        position: absolute;
        top: -10rpx; /* 向上突出 */
        right: 60rpx; /* 指向更多按钮的中心 */
        width: 0;
        height: 0;
        border-left: 10rpx solid transparent;
        border-right: 10rpx solid transparent;
        border-bottom: 10rpx solid #FFFFFF;
        z-index: 101;
    }

    /* 菜单内容 */
    .menu-content {
        background: #FFFFFF;
        box-shadow: 0px 0px 16.8rpx rgba(0, 0, 0, 0.15); /* 8.4px * 2 */
        border-radius: 8rpx;
        padding: 18rpx; /* 9px * 2 */
        display: flex;
        flex-direction: column;
        gap: 22rpx; /* 11px * 2 */
    }

    .dropdown-item {
        width: 96rpx; /* 48px * 2 */
        height: 34rpx; /* 17px * 2 */
        font-family: 'PingFang SC';
        font-style: normal;
        font-weight: 400;
        font-size: 24rpx; /* 12px * 2 */
        line-height: 34rpx; /* 17px * 2 */
        color: #333333;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
        cursor: pointer;
        border-radius: 4rpx;

        &:hover {
            color: #47B9FB;
        }

        &:active {
            transform: scale(0.98);
        }

        &.active-item {
            color: #47B9FB;
        }
    }
}

.business-list {
    padding: 0 30rpx;
    flex: 1;
    margin-top: 20rpx;
    box-sizing: border-box;
    height: 0; /* 这个设置是为了让flex: 1生效 */
    
    /* 内容容器 */
    .content-container {
        opacity: 1;
        transform: translateY(0);
    }

    /* 列表容器动画 */
    .list-container {
        animation: slideInUp 0.5s ease-out;
    }

    /* 加盟列表 */
    .franchise-list {
        display: flex;
        flex-direction: column;
        width: 100%;
    }

    /* 招商合作列表 */
    .cooperation-list {
        display: flex;
        flex-direction: column;
        width: 100%;
    }

    .business-card {
        position: relative;
        display: flex;
        width: 702rpx; /* 351px * 2 */
        height: 282rpx; /* 141px * 2 */
        background: #FFFFFF;
        border-radius: 16rpx; /* 8px * 2 */
        margin-bottom: 30rpx;
        box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.08);

        .business-img-box {
            width: 208rpx; /* 104px * 2 */
            height: 208rpx; /* 104px * 2 */
            border-radius: 8rpx; /* 4px * 2 */
            overflow: hidden;
            margin: 38rpx 0 0 36rpx; /* top: 19px, left: 18px */
            flex-shrink: 0;

            .business-img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
        }

        /* Frame 241 */
        .business-info {
            /* Auto layout */
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            padding: 0px;
            gap: 20rpx; /* 10px * 2 */
            width: 460rpx; /* 230px * 2 */
            height: 220rpx; /* 110px * 2 */
            margin: 32rpx 0 0 24rpx; /* top: 16px, left: 12px (130px - 104px - 18px + 4px) */

            /* 瑞幸咖啡Coffee */
            .business-title {
                width: 460rpx; /* 230px * 2 */
                height: 40rpx; /* 20px * 2 */
                font-family: 'PingFang SC';
                font-style: normal;
                font-weight: 400;
                font-size: 32rpx; /* 16px * 2 */
                line-height: 44rpx; /* 22px * 2 */
                color: #1A1A1A;
                /* Inside auto layout */
                flex: none;
                order: 0;
                align-self: stretch;
                flex-grow: 0;
            }

            /* 加盟费：12万~18万 */
            .business-desc:nth-child(2) {
                width: 460rpx; /* 230px * 2 */
                height: 40rpx; /* 20px * 2 */
                font-family: 'PingFang SC';
                font-style: normal;
                font-weight: 400;
                font-size: 28rpx; /* 14px * 2 */
                line-height: 40rpx; /* 20px * 2 */
                color: #333333;
                /* Inside auto layout */
                flex: none;
                order: 1;
                align-self: stretch;
                flex-grow: 0;
            }

            /* 全国加盟上万家，饮品行业领头者 */
            .business-desc:nth-child(3) {
                width: 460rpx; /* 230px * 2 */
                height: 40rpx; /* 20px * 2 */
                font-family: 'PingFang SC';
                font-style: normal;
                font-weight: 400;
                font-size: 28rpx; /* 14px * 2 */
                line-height: 40rpx; /* 20px * 2 */
                color: #333333;
                /* Inside auto layout */
                flex: none;
                order: 2;
                align-self: stretch;
                flex-grow: 0;
            }

            /* 全国连锁 */
            .business-tag {
                width: 460rpx; /* 230px * 2 */
                height: 40rpx; /* 20px * 2 */
                font-family: 'PingFang SC';
                font-style: normal;
                font-weight: 400;
                font-size: 28rpx; /* 14px * 2 */
                line-height: 40rpx; /* 20px * 2 */
                color: #333333;
                /* Inside auto layout */
                flex: none;
                order: 3;
                align-self: stretch;
                flex-grow: 0;
            }
        }

        .view-btn {
            position: absolute;
            right: 36rpx; /* 351px - 269px - 84px + 18px = 2px, 调整为18px */
            bottom: 16rpx; /* 258px + 141px - 366px - 26px = 7px, 调整为8px */
            width: 168rpx; /* 84px * 2 */
            height: 52rpx; /* 26px * 2 */
            background: linear-gradient(90deg, #FF7E00 0%, #FDA44D 100%);
            border-radius: 44rpx; /* 22px * 2 */
            font-family: 'PingFang SC';
            font-style: normal;
            font-weight: 400;
            font-size: 36rpx; /* 18px * 2 */
            line-height: 50rpx; /* 25px * 2 */
            text-align: center;
            color: #FFFFFF;
            display: flex;
            align-items: center;
            justify-content: center;
        }
    }
    
    /* 加盟卡片样式 */
    .franchise-card {
        position: relative;
        display: flex;
        width: 702rpx; /* 351px * 2 */
        height: 282rpx; /* 141px * 2 */
        background: #FFFFFF;
        border-radius: 16rpx; /* 8px * 2 */
        margin-bottom: 30rpx;
        box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.08);

        .business-img-box {
            width: 208rpx; /* 104px * 2 */
            height: 208rpx; /* 104px * 2 */
            border-radius: 8rpx; /* 4px * 2 */
            overflow: hidden;
            margin: 38rpx 0 0 36rpx; /* top: 19px, left: 18px */
            flex-shrink: 0;

            .business-img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
        }

        .business-info {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            padding: 0px;
            gap: 20rpx; /* 10px * 2 */
            width: 460rpx; /* 230px * 2 */
            height: 220rpx; /* 110px * 2 */
            margin: 32rpx 0 0 24rpx; /* top: 16px, left: 12px (130px - 104px - 18px + 4px) */

            .business-title {
                width: 460rpx; /* 230px * 2 */
                height: 40rpx; /* 20px * 2 */
                font-family: 'PingFang SC';
                font-style: normal;
                font-weight: 400;
                font-size: 32rpx; /* 16px * 2 */
                line-height: 44rpx; /* 22px * 2 */
                color: #1A1A1A;
                flex: none;
                order: 0;
                align-self: stretch;
                flex-grow: 0;
            }

            .business-desc {
                width: 460rpx; /* 230px * 2 */
                height: 40rpx; /* 20px * 2 */
                font-family: 'PingFang SC';
                font-style: normal;
                font-weight: 400;
                font-size: 28rpx; /* 14px * 2 */
                line-height: 40rpx; /* 20px * 2 */
                color: #333333;
                flex: none;
                align-self: stretch;
                flex-grow: 0;
            }

            .business-tag {
                width: 460rpx; /* 230px * 2 */
                height: 40rpx; /* 20px * 2 */
                font-family: 'PingFang SC';
                font-style: normal;
                font-weight: 400;
                font-size: 28rpx; /* 14px * 2 */
                line-height: 40rpx; /* 20px * 2 */
                color: #333333;
                flex: none;
                order: 3;
                align-self: stretch;
                flex-grow: 0;
            }
        }

        .view-btn {
            position: absolute;
            right: 36rpx; /* 351px - 269px - 84px + 18px = 2px, 调整为18px */
            bottom: 16rpx; /* 258px + 141px - 366px - 26px = 7px, 调整为8px */
            width: 168rpx; /* 84px * 2 */
            height: 52rpx; /* 26px * 2 */
            background: linear-gradient(90deg, #FF7E00 0%, #FDA44D 100%);
            border-radius: 44rpx; /* 22px * 2 */
            font-family: 'PingFang SC';
            font-style: normal;
            font-weight: 400;
            font-size: 36rpx; /* 18px * 2 */
            line-height: 50rpx; /* 25px * 2 */
            text-align: center;
            color: #FFFFFF;
            display: flex;
            align-items: center;
            justify-content: center;
        }
    }
}

.safe-area-bottom {
    height: 34rpx;
    background: #F7F7F7;
    width: 100%;
    flex-shrink: 0;
}

/* 招商合作卡片样式 */
.business-cooperation-card {
    position: relative;
    width: 702rpx; /* 351px * 2 */
    height: 388rpx; /* 194px * 2 */
    background: #FFFFFF;
    border-radius: 8rpx; /* 4px * 2 */
    margin-bottom: 24rpx; /* 12px * 2 */
    padding: 20rpx 44rpx 30rpx 44rpx; /* 上10px 右22px 下15px 左22px */
    display: flex;
    flex-direction: column;

    /* 项目标题 */
    .cooperation-title {
        font-family: 'PingFang SC';
        font-style: normal;
        font-weight: 500; /* 保持字重 */
        font-size: 34rpx; /* 适中的标题大小 */
        line-height: 48rpx; /* 调整行高 */
        color: #000000;
        margin-bottom: 20rpx; /* 10px * 2 */
    }

    /* 标签组 */
    .cooperation-tag-group {
        display: flex;
        gap: 20rpx; /* 10px * 2 */
        margin-bottom: 24rpx; /* 12px * 2 */

        .cooperation-tag {
            width: 168rpx; /* 84px * 2 */
            height: 46rpx; /* 23px * 2 */
            background: #FFC082;
            border-radius: 8rpx; /* 4px * 2 */

            font-family: 'PingFang SC';
            font-style: normal;
            font-weight: 400;
            font-size: 26rpx; /* 适中的标签大小 */
            line-height: 36rpx; /* 调整行高 */
            color: #FF7E00;

            display: flex;
            align-items: center;
            justify-content: center;
        }
    }

    /* 信息区域 */
    .info-section {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 16rpx; /* 8px * 2 */

        /* 信息行 */
        .info-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 12rpx; /* 增加行间距 */

            .info-item {
                font-family: 'PingFang SC';
                font-style: normal;
                font-weight: 400;
                font-size: 30rpx; /* 适中的信息文字大小 */
                line-height: 42rpx; /* 调整行高 */
                color: #666666; /* 保持颜色，提高可读性 */
                flex: 1;

                &.contact-fee {
                    max-width: 340rpx; /* 增加宽度，让文字一行显示 */
                }

                &.rent-fee {
                    max-width: 340rpx; /* 增加宽度，让文字一行显示 */
                    text-align: right;
                }

                &.category {
                    max-width: 280rpx; /* 增加宽度，让文字一行显示 */
                }

                &.area {
                    max-width: 340rpx; /* 增加宽度，让文字一行显示 */
                    text-align: right;
                }

                &.region {
                    max-width: 340rpx; /* 增加宽度，让文字一行显示 */
                }
            }
        }
    }

    /* 查看按钮 */
    .preview-button {
        position: absolute;
        right: 44rpx; /* 22px * 2 */
        bottom: 30rpx; /* 15px * 2 */
        width: 168rpx; /* 84px * 2 */
        height: 52rpx; /* 26px * 2 */
        background: linear-gradient(90deg, #FF7E00 0%, #FDA44D 100%);
        border-radius: 44rpx; /* 22px * 2 */

        display: flex;
        align-items: center;
        justify-content: center;

        .preview-btn-text {
            font-family: 'PingFang SC';
            font-style: normal;
            font-weight: 500; /* 保持字重 */
            font-size: 32rpx; /* 适中的按钮文字大小 */
            line-height: 44rpx; /* 调整行高 */
            color: #FFFFFF;
        }
    }
}

/* 招商合作卡片样式 - 复制上面的样式 */
.cooperation-card {
    position: relative;
    width: 702rpx; /* 351px * 2 */
    height: 388rpx; /* 194px * 2 */
    background: #FFFFFF;
    border-radius: 8rpx; /* 4px * 2 */
    margin-bottom: 24rpx; /* 12px * 2 */
    padding: 20rpx 44rpx 30rpx 44rpx; /* 上10px 右22px 下15px 左22px */
    display: flex;
    flex-direction: column;

    /* 项目标题 */
    .cooperation-title {
        font-family: 'PingFang SC';
        font-style: normal;
        font-weight: 500; /* 保持字重 */
        font-size: 34rpx; /* 适中的标题大小 */
        line-height: 48rpx; /* 调整行高 */
        color: #000000;
        margin-bottom: 20rpx; /* 10px * 2 */
    }

    /* 标签组 */
    .cooperation-tag-group {
        display: flex;
        gap: 20rpx; /* 10px * 2 */
        margin-bottom: 24rpx; /* 12px * 2 */

        .cooperation-tag {
            width: 168rpx; /* 84px * 2 */
            height: 46rpx; /* 23px * 2 */
            background: #FFC082;
            border-radius: 8rpx; /* 4px * 2 */

            font-family: 'PingFang SC';
            font-style: normal;
            font-weight: 400;
            font-size: 26rpx; /* 适中的标签大小 */
            line-height: 36rpx; /* 调整行高 */
            color: #FF7E00;

            display: flex;
            align-items: center;
            justify-content: center;
        }
    }

    /* 信息区域 */
    .info-section {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 16rpx; /* 8px * 2 */

        /* 信息行 */
        .info-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 12rpx; /* 增加行间距 */

            .info-item {
                font-family: 'PingFang SC';
                font-style: normal;
                font-weight: 400;
                font-size: 30rpx; /* 适中的信息文字大小 */
                line-height: 42rpx; /* 调整行高 */
                color: #666666; /* 保持颜色，提高可读性 */
                flex: 1;

                &.contact-fee {
                    max-width: 340rpx; /* 增加宽度，让文字一行显示 */
                }

                &.rent-fee {
                    max-width: 340rpx; /* 增加宽度，让文字一行显示 */
                    text-align: right;
                }

                &.category {
                    max-width: 280rpx; /* 增加宽度，让文字一行显示 */
                }

                &.area {
                    max-width: 340rpx; /* 增加宽度，让文字一行显示 */
                    text-align: right;
                }

                &.region {
                    max-width: 340rpx; /* 增加宽度，让文字一行显示 */
                }
            }
        }
    }

    /* 查看按钮 */
    .preview-button {
        position: absolute;
        right: 44rpx; /* 22px * 2 */
        bottom: 30rpx; /* 15px * 2 */
        width: 168rpx; /* 84px * 2 */
        height: 52rpx; /* 26px * 2 */
        background: linear-gradient(90deg, #FF7E00 0%, #FDA44D 100%);
        border-radius: 44rpx; /* 22px * 2 */

        display: flex;
        align-items: center;
        justify-content: center;

        .preview-btn-text {
            font-family: 'PingFang SC';
            font-style: normal;
            font-weight: 500; /* 保持字重 */
            font-size: 32rpx; /* 适中的按钮文字大小 */
            line-height: 44rpx; /* 调整行高 */
            color: #FFFFFF;
        }
    }
}

/* 关键帧动画 */
@keyframes slideInUp {
    0% {
        opacity: 0;
        transform: translateY(30rpx);
    }
    100% {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes dropdownSlideIn {
    0% {
        opacity: 0;
        transform: scaleY(0.8) translateY(-10rpx);
    }
    100% {
        opacity: 1;
        transform: scaleY(1) translateY(0);
    }
}

/* 过渡动画类 */
.slide-fade-enter-active, .slide-fade-leave-active {
    transition: all 0.4s ease;
}

.slide-fade-enter {
    opacity: 0;
    transform: translateX(30rpx);
}

.slide-fade-leave-to {
    opacity: 0;
    transform: translateX(-30rpx);
}

/* 便民服务卡片样式 */
.service-list {
    display: flex;
    flex-direction: column;
    /* 移除padding以与其他区域对齐 */
}

/* card */
.service-card {
    width: 702rpx; /* 351px * 2 */
    height: 282rpx; /* 141px * 2 */
    background: #FFFFFF;
    border-radius: 16rpx; /* 8px * 2 */
    margin-bottom: 24rpx; /* 12px * 2 */
    padding: 32rpx 36rpx 32rpx 36rpx; /* top: 16px, right: 18px, bottom: 16px, left: 18px */
    display: flex;
    gap: 32rpx; /* 图片和内容之间的间距 16px * 2 */

    /* left 左侧图片 */
    .service-left {
        flex-shrink: 0; /* 防止图片被压缩 */

        .service-image {
            width: 208rpx; /* 104px * 2 */
            height: 208rpx; /* 104px * 2 */
            border-radius: 8rpx; /* 4px * 2 */
            object-fit: cover;
        }
    }

    /* right 右侧内容 */
    .service-right {
        flex: 1;
        display: flex;
        flex-direction: column;
        position: relative;

        /* 快速上门开荒深度清洁地毯... */
        .service-title {
            font-family: 'PingFang SC';
            font-style: normal;
            font-weight: 400;
            font-size: 32rpx; /* 16px * 2 */
            line-height: 44rpx; /* 22px * 2 */
            color: #1A1A1A;
            margin-bottom: 16rpx; /* 8px * 2 */
        }

        /* service-coverage 服务覆盖区域 */
        .service-coverage {
            width: 210rpx; /* 105px * 2 */
            height: 46rpx; /* 23px * 2 */
            background: #F8F8F8;
            border-radius: 8rpx; /* 4px * 2 */
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 16rpx; /* 8px * 2 */

            .coverage-text {
                font-family: 'PingFang SC';
                font-style: normal;
                font-weight: 400;
                font-size: 28rpx; /* 14px * 2 */
                line-height: 40rpx; /* 20px * 2 */
                color: #333333;
            }
        }

        /* review 评分区域 */
        .service-review {
            display: flex;
            align-items: center;
            gap: 20rpx; /* 10px * 2 */
            margin-bottom: 16rpx; /* 8px * 2 */

            /* 星级评分 */
            .rating-stars {
                display: flex;
                align-items: center;
                gap: 4rpx; /* 2px * 2 星星之间的间距 */

                .star-icon {
                    width: 28rpx; /* 14px * 2 */
                    height: 28rpx; /* 14px * 2 */
                }
            }

            /* 5.0 评分数字 */
            .rating-score {
                font-family: 'PingFang SC';
                font-style: normal;
                font-weight: 400;
                font-size: 28rpx; /* 14px * 2 */
                line-height: 40rpx; /* 20px * 2 */
                color: #FF840C;
            }
        }

        /* 平台保障 */
        .service-guarantee {
            font-family: 'PingFang SC';
            font-style: normal;
            font-weight: 400;
            font-size: 28rpx; /* 14px * 2 */
            line-height: 40rpx; /* 20px * 2 */
            color: #333333;
            flex: 1; /* 占据剩余空间 */
        }

        /* view-btn 查看按钮 */
        .view-btn {
            position: absolute;
            right: 0;
            bottom: 0;
            width: 168rpx; /* 84px * 2 */
            height: 52rpx; /* 26px * 2 */
            background: linear-gradient(90deg, #FF7E00 0%, #FDA44D 100%);
            border-radius: 44rpx; /* 22px * 2 */
            display: flex;
            align-items: center;
            justify-content: center;

            .btn-text {
                font-family: 'PingFang SC';
                font-style: normal;
                font-weight: 400;
                font-size: 36rpx; /* 18px * 2 */
                line-height: 50rpx; /* 25px * 2 */
                color: #FFFFFF;
            }
        }
    }
}

/* 加载中、没有更多、空状态样式 */
.loading-state, .no-more-state, .empty-state {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 30rpx 0;
}

.loading-state {
    .loading-spinner {
        width: 40rpx;
        height: 40rpx;
        border: 4rpx solid #f3f3f3;
        border-top: 4rpx solid #3498db;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin-bottom: 10rpx;
    }
    
    .loading-text {
        font-size: 24rpx;
        color: #999;
    }
}

.no-more-state {
    .no-more-text {
        font-size: 24rpx;
        color: #999;
    }
}

.empty-state {
    padding: 100rpx 0;
    
    .empty-icon {
        width: 200rpx;
        height: 200rpx;
        margin-bottom: 20rpx;
    }
    
    .empty-text {
        font-size: 28rpx;
        color: #999;
    }
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
</style>