<script>
import { checkLogin } from './libs/login'
import { HTTP_REQUEST_URL } from './config/app'
import { getShopConfig, silenceAuth, getSystemVersion, basicConfig, remoteRegister } from '@/api/public'
import Auth from '@/libs/wechat.js'
import Routine from './libs/routine.js'
import { silenceBindingSpread } from '@/utils'
import { colorChange, getCrmebCopyRight } from '@/api/api.js'
import { getLangJson, getLangVersion } from '@/api/user.js'
import { mapGetters } from 'vuex'
import colors from '@/mixins/color.js'
import Cache from '@/utils/cache'
import themeList from '@/utils/theme'
import { debug } from 'util'
import UserManager from '@/utils/userManager'
import { getMyCommunityInfo } from '@/api/group'
import { SITE_INFO } from '@/config/cache'
import { getGroupCartCount } from '@/api/groupCart.js'

export default {
	globalData: {
		spid: 0,
		code: 0,
		isLogin: false,
		userInfo: {},
		MyMenus: [],
		globalData: false,
		isIframe: false,
		tabbarShow: true,
		windowHeight: 0,
		locale: '',
		// 全局站点信息，可在任何页面通过 getApp().globalData.siteInfo 访问
		siteInfo: {
			name: '',
			location: '',
			deliveryTime: '',
			type: ''
		}
	},
	mixins: [colors],
	computed: mapGetters(['isLogin', 'cartNum']),
	watch: {
		isLogin: {
			deep: true, //深度监听设置为 true
			handler: function (newV, oldV) {
				if (newV) {
					// 用户登录后获取购物车数量和社区信息
					this.updateCartNum();
					this.fetchCommunityInfo();
				} else {
					this.$store.commit('indexData/setCartNum', '')
				}
			}
		},
		cartNum (newCart, oldCart) {
			// 确保购物车数量是数字类型
			const cartCount = parseInt(newCart) || 0;
			
			// 更新store中的购物车数量
			this.$store.commit('indexData/setCartNum', cartCount + '');
			
			// 更新原生tabbar的角标
			if (cartCount > 0) {
				uni.setTabBarBadge({
					index: Number(uni.getStorageSync('FOOTER_ADDCART')) || 2,
					text: cartCount + ''
				}).catch(err => {
					console.log('设置TabBar角标失败，可能是自定义TabBar已启用', err);
				});
			} else {
				uni.hideTabBarRedDot({
					index: Number(uni.getStorageSync('FOOTER_ADDCART')) || 2
				}).catch(err => {
					console.log('隐藏TabBar角标失败，可能是自定义TabBar已启用', err);
				});
			}
		}
	},
	onShow () {
		// 触发应用显示事件，用于用户管理器检查用户信息
		uni.$emit('appShow');
		
		// 应用显示时更新购物车数量
		if (this.isLogin) {
			this.updateCartNum();
		}

		const queryData = uni.getEnterOptionsSync() // uni-app版本 3.5.1+ 支持
		if (queryData.query.spread) {
			this.$Cache.set('spread', queryData.query.spread)
			this.globalData.spid = queryData.query.spread
			this.globalData.pid = queryData.query.spread
			silenceBindingSpread(this.globalData)
		}
		if (queryData.query.spid) {
			this.$Cache.set('spread', queryData.query.spid)
			this.globalData.spid = queryData.query.spid
			this.globalData.pid = queryData.query.spid
			silenceBindingSpread(this.globalData)
		}
		// #ifdef MP
		if (queryData.query.scene) {
			let param = this.$util.getUrlParams(decodeURIComponent(queryData.query.scene))
			if (param.pid) {
				this.$Cache.set('spread', param.pid)
				this.globalData.spid = param.pid
				this.globalData.pid = param.pid
			} else {
				switch (queryData.scene) {
					//扫描小程序码
					case 1047:
						this.globalData.code = queryData.query.scene
						break
					//长按图片识别小程序码
					case 1048:
						this.globalData.code = queryData.query.scene
						break
					//手机相册选取小程序码
					case 1049:
						this.globalData.code = queryData.query.scene
						break
					//直接进入小程序
					case 1001:
						this.globalData.spid = queryData.query.scene
						break
				}
			}
			silenceBindingSpread(this.globalData)
		}
		// #endif
		
		// 确保页面加载组件能被正确关闭
		setTimeout(() => {
			// 触发loadClose事件，强制关闭页面加载组件
			uni.$emit('loadClose')
			// 确保loadStatus被正确设置
			this.$Cache.set('loadStatus', false)
		}, 1000)
	},
	async onLaunch (option) {
		uni.hideTabBar()
		let that = this
		
		// 初始化站点信息，从缓存读取或设置默认值
		const siteInfoCache = Cache.get(SITE_INFO);
		if (siteInfoCache) {
			this.globalData.siteInfo = siteInfoCache;
		} else {
			// 设置默认站点信息
			this.globalData.siteInfo = {
				name: '',
				location: '北京尚德井小区菜鸟驿站',
				deliveryTime: '今日8：00前送达',
				type: '站点自提'
			};
			// 存入Vuex和缓存
			this.$store.dispatch('SET_SITEINFO', this.globalData.siteInfo);
		}
		
		// 尝试从API获取社区信息
		this.fetchCommunityInfo();
		
		// #ifdef H5
		// 检查当前路径，如果是根路径，则重定向到首页
		if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
			// 强制清除loadStatus
			this.$Cache.set('loadStatus', false)
			
			setTimeout(() => {
				uni.reLaunch({
					url: '/pages/index/index',
					success: function() {
					},
					fail: function(err) {
						console.error('App.vue重定向失败:', err)
						// 如果uni-app API失败，尝试使用传统方法
						window.location.href = '/pages/index/index'
					}
				})
			}, 300)
		}
		// #endif
		
		// 初始化用户管理器
		UserManager.init();

		basicConfig().then((res) => {
			uni.setStorageSync('BASIC_CONFIG', res.data)
		})
		// #ifdef H5
		if (option.query.hasOwnProperty('mdType') && option.query.mdType == 'iframeWindow') {
			this.globalData.isIframe = true
		} else {
			this.globalData.isIframe = false
		}
		if (!this.isLogin && option.query.hasOwnProperty('remote_token')) {
			this.remoteRegister(option.query.remote_token)
		}
		// #endif
		colorChange('color_change').then((res) => {
			uni.setStorageSync('is_diy', res.data.is_diy)
			uni.$emit('is_diy', res.data.is_diy)
			const themeMap = {
				1: 'blue',
				2: 'green',
				3: 'red',
				4: 'pink',
				5: 'orange'
			}

			const status = res.data.status
			const themeKey = themeMap[status] || 'red' // 默认使用红色
			const selectedTheme = themeList[themeKey]
			uni.setStorageSync('color_status', res.data.status)
			uni.setStorageSync('viewColor', selectedTheme)
			uni.$emit('ok', selectedTheme, status)
		})
		getLangVersion().then((res) => {
			let version = res.data.version
			if (version != uni.getStorageSync('LANG_VERSION')) {
				getLangJson().then((res) => {
					let value = Object.keys(res.data)[0]
					Cache.set('locale', Object.keys(res.data)[0])
					this.$i18n.setLocaleMessage(value, res.data[value])
					uni.setStorageSync('localeJson', res.data)
				})
			}
			uni.setStorageSync('LANG_VERSION', version)
		})

		// #ifdef APP-PLUS || H5
		uni.getSystemInfo({
			success: function (res) {
				// 首页没有title获取的整个页面的高度，里面的页面有原生标题要减掉就是视口的高度
				// 状态栏是动态的可以拿到 标题栏是固定写死的是44px
				let height = res.windowHeight - res.statusBarHeight - 44
				// #ifdef H5 || APP-PLUS
				that.globalData.windowHeight = res.windowHeight + 'px'
				// #endif
				// // #ifdef APP-PLUS
				// that.globalData.windowHeight = height + 'px'
				// // #endif
			}
		})
		// #endif
		// #ifdef MP
		if (HTTP_REQUEST_URL == '') {
			console.error(
				"请配置根目录下的config.js文件中的 'HTTP_REQUEST_URL'\n\n请修改开发者工具中【详情】->【AppID】改为自己的Appid\n\n请前往后台【小程序】->【小程序配置】填写自己的 appId and AppSecret"
			)
			return false
		}

		const updateManager = wx.getUpdateManager()
		const startParamObj = wx.getEnterOptionsSync()
		if (wx.canIUse('getUpdateManager') && startParamObj.scene != 1154) {
			const updateManager = wx.getUpdateManager()
			updateManager.onCheckForUpdate(function (res) {
				// 请求完新版本信息的回调
				// console.log(res.hasUpdate)
				if (res.hasUpdate) {
					updateManager.onUpdateFailed(function () {
						return that.Tips({
							title: '新版本下载失败'
						})
					})
					updateManager.onUpdateReady(function () {
						wx.showModal({
							title: '更新提示',
							content: '新版本已经下载好，是否重启当前应用？',
							success (res) {
								if (res.confirm) {
									updateManager.applyUpdate()
								}
							}
						})
					})
					updateManager.onUpdateFailed(function () {
						wx.showModal({
							title: '发现新版本',
							content: '请删除当前小程序，重启搜索打开...'
						})
					})
				}
			})
		}
		// #endif

		// getShopConfig().then(res => {
		// 	this.$store.commit('SETPHONESTATUS', res.data.status);
		// });
		// 获取导航高度；
		uni.getSystemInfo({
			success: function (res) {
				that.globalData.navHeight = res.statusBarHeight * (750 / res.windowWidth) + 91
			}
		})
		// #ifdef MP
		let menuButtonInfo = uni.getMenuButtonBoundingClientRect()
		that.globalData.navH = menuButtonInfo.top * 2 + menuButtonInfo.height / 2
		const version = uni.getSystemInfoSync().SDKVersion
		if (Routine.compareVersion(version, '2.21.3') >= 0) {
			that.$Cache.set('MP_VERSION_ISNEW', true)
		} else {
			that.$Cache.set('MP_VERSION_ISNEW', false)
		}
		// #endif

		// #ifdef MP
		// 小程序静默授权
		// if (!this.$store.getters.isLogin) {
		// 	Routine.getCode()
		// 		.then(code => {
		// 			this.silenceAuth(code);
		// 		})
		// 		.catch(res => {
		// 			uni.hideLoading();
		// 		});
		// }
		// #endif
		// #ifdef H5
		// 添加crmeb chat 统计
		var __s = document.createElement('script')
		__s.src = `${HTTP_REQUEST_URL}/api/get_script`
		document.head.appendChild(__s)
		// #endif
		getCrmebCopyRight().then((res) => {
			uni.setStorageSync('copyRight', res.data)
		})
	},
	// #ifdef H5
	onHide () {
		this.$Cache.clear('snsapiKey')
	},
	// #endif
	methods: {
		// 更新购物车数量
		async updateCartNum() {
			try {
				const count = await getGroupCartCount();
				if (count >= 0) {
					this.$store.dispatch("indexData/setCartnumber", count);
				}
			} catch (error) {
				console.error('获取购物车数量失败:', error);
				// 静默失败，不显示错误提示
			}
		},
		
		remoteRegister (remote_token) {
			remoteRegister({ remote_token }).then((res) => {
				let data = res.data
				if (data.get_remote_login_url) {
					location.href = data.get_remote_login_url
				} else {
					this.$store.commit('LOGIN', {
						token: data.token,
						time: data.expires_time - this.$Cache.time()
					})
					this.$store.commit('SETUID', data.userInfo.uid)
					location.reload()
				}
			})
		},
		
		/**
		 * 获取社区信息并更新到全局站点信息
		 */
		fetchCommunityInfo() {
			// 只有登录状态才获取社区信息
			if (!this.$store.getters.isLogin) return;
			
			getMyCommunityInfo()
				.then(res => {
					if (res.status === 200 && res.data && res.data.community) {
						const community = res.data.community;
						
						// 保存当前的配送时间，如果有的话
						const currentDeliveryTime = this.globalData.siteInfo.deliveryTime || '今日8：00前送达';
						
						// 更新站点信息
						const siteInfo = {
							name: community.name || '',
							location: community.full_address || community.address || '',
							deliveryTime: currentDeliveryTime, // 保留现有的配送时间
							type: '站点自提',
							// 保存完整的社区信息以便其他地方使用
							community: community,
							// 保存社区更新时间，用于判断数据新鲜度
							lastUpdated: new Date().getTime()
						};
						
						// 更新到Vuex和全局
						this.$store.dispatch('SET_SITEINFO', siteInfo);
						this.globalData.siteInfo = siteInfo;
						
						console.log('社区信息已更新:', siteInfo);
					}
				})
				.catch(error => {
					console.error('获取社区信息失败:', error);
					// 如果是未登录错误，不做处理，使用默认站点信息
					if (error && error.status === 110002) {
						console.log('用户未登录，使用默认站点信息');
					}
				});
		}
		// 小程序静默授权
		// silenceAuth(code) {
		// 	let that = this;
		// 	let spread = that.globalData.spid ? that.globalData.spid : '';
		// 	silenceAuth({
		// 			code: code,
		// 			spread_spid: spread,
		// 			spread_code: that.globalData.code
		// 		})
		// 		.then(res => {
		// 			if (res.data.token !== undefined && res.data.token) {
		// 				uni.hideLoading();
		// 				let time = res.data.expires_time - this.$Cache.time();
		// 				that.$store.commit('LOGIN', {
		// 					token: res.data.token,
		// 					time: time
		// 				});
		// 				that.$store.commit('SETUID', res.data.userInfo.uid);
		// 				that.$store.commit('UPDATE_USERINFO', res.data.userInfo);
		// 			}
		// 		})
		// 		.catch(res => {});
		// },
	}
}
</script>

<style lang="scss">
@import url('@/plugin/emoji-awesome/css/tuoluojiang.css');
@import url('@/plugin/animate/animate.min.css');
@import 'static/css/base.css';
@import 'static/iconfont/iconfont.css';
@import 'static/css/guildford.css';
@import 'static/css/style.scss';
@import 'static/css/unocss.css';
@import 'static/fonts/font.scss';

view {
	box-sizing: border-box;
}

page {
	font-family: PingFang SC;
}

.bg-color-red {
	background-color: var(--view-theme) !important;
}

.syspadding {
	padding-top: var(--status-bar-height);
}

.flex {
	display: flex;
}

/* 隐藏滚动条但保持滚动功能 */
.uni-scroll-view::-webkit-scrollbar {
	/* 隐藏滚动条，但依旧具备可以滚动的功能 */
	display: none;
}

/* 全局隐藏滚动条但保持滚动功能 */
::-webkit-scrollbar {
	width: 0;
	height: 0;
}

::-webkit-scrollbar-track {
	background: transparent;
}

::-webkit-scrollbar-thumb {
	background: transparent;
}

/* 确保页面可以滚动 */
html, body {
	overflow: auto !important;
	-webkit-overflow-scrolling: touch;
}

/* uni-app页面容器滚动设置 */
uni-page-body {
	overflow: auto !important;
	-webkit-overflow-scrolling: touch;
}

.uni-system-open-location .map-content.fix-position {
	height: 100vh;
	top: 0;
	bottom: 0;
}

.open-location {
	width: 100%;
	height: 100vh;
}

/* Stagewise overlay container - won't interfere with page content */
.stagewise-overlay {
	position: fixed;
	pointer-events: none;
	z-index: 9999;
	top: 0;
	left: 0;
	width: 0;
	height: 0;
}
</style>
