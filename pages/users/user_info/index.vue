<template>
	<view>
		<form @submit="formSubmit">
			<view class='personal-data' :style="colorStyle">
				<!-- 顶部导航栏 -->
				<view class="header">
					<view class="back-icon" @click="navigateBack">
						<text class="iconfont icon-left"></text>
					</view>
					<view class="page-title">个人资料</view>
				</view>
				
				<view class='list'>
					<!-- 头像 -->
					<view class='item acea-row row-between-wrapper' @click="navigateTo('/pages/users/user_avatar/index')">
						<view>头像</view>
						<view class="right-content">
							<image class="avatar-img" :src="userInfo.avatar"></image>
							<text class="iconfont icon-xiangyou right-arrow"></text>
						</view>
					</view>
					
					<!-- 昵称 -->
					<view class='item acea-row row-between-wrapper' @click="navigateTo('/pages/users/user_nickname/index')">
						<view>昵称</view>
						<view class="right-content">
							<text class="value-text">{{ userInfo.nickname || '加载中...' }}</text>
							<text class="iconfont icon-xiangyou right-arrow"></text>
						</view>
					</view>
					
					<!-- 性别 -->
					<view class='item acea-row row-between-wrapper' @click="showGenderPicker">
						<view>性别</view>
						<view class="right-content">
							<text class="value-text">{{ userInfo.sex == 1 ? '男' : (userInfo.sex == 2 ? '女' : '未设置') }}</text>
							<text class="iconfont icon-xiangyou right-arrow"></text>
						</view>
					</view>
					
					<!-- 生日 -->
					<view class='item acea-row row-between-wrapper' @click="navigateTo('/pages/users/user_birthday/index')">
						<view>生日</view>
						<view class="right-content">
							<text class="value-text">{{ userInfo.birthday || '未设置' }}</text>
							<text class="iconfont icon-xiangyou right-arrow"></text>
						</view>
					</view>
					
					<!-- 其他保留项 -->
					<view class='item acea-row row-between-wrapper'>
						<view>手机号码</view>
						<!-- #ifdef MP -->
						<button class="input" open-type="getPhoneNumber" @getphonenumber="getphonenumber"
							v-if="!userInfo.phone">点击绑定手机号
							<text class="iconfont icon-xiangyou"></text>
						</button>
						<!-- #endif -->
						<!-- #ifndef MP -->
						<navigator url="/pages/users/user_phone/index" hover-class="none" class="input"
							v-if="!userInfo.phone">
							点击绑定手机号<text class="iconfont icon-xiangyou"></text>
						</navigator>
						<!-- #endif -->

						<view class='input acea-row row-between-wrapper' v-else>
							<view class=""></view>
							<view class="acea-row row-middle">
								<input type='text' disabled='true' name='phone' :value='userInfo.phone'
									class='id'></input>
								<text class='iconfont icon-suozi'></text>
							</view>
						</view>
					</view>
					
					<!-- 其他项目保留不变 -->
					<view class='item acea-row row-between-wrapper'>
						<view>ID号</view>
						<view class='input acea-row row-between-wrapper'>
							<view class=""></view>
							<view class="">
								<text>{{userInfo.uid}}</text>
								<text class='iconfont icon-suozi'></text>
							</view>
						</view>
					</view>
					
					<!-- 其他原有项目 -->
					<!-- #ifdef MP -->
					<view class='item acea-row row-between-wrapper'>
						<view>权限设置</view>
						<view class="input" @click="Setting">
							点击管理<text class="iconfont icon-xiangyou"></text>
						</view>
					</view>
					<!-- #endif -->
					<!-- #ifdef H5 -->
					<view class="item acea-row row-between-wrapper" v-if="userInfo.phone && !this.$wechat.isWeixin()">
						<view>密码</view>
						<navigator url="/pages/users/user_settings/change_password" hover-class="none" class="input">
							点击修改密码<text class="iconfont icon-xiangyou"></text>
						</navigator>
					</view>
					<!-- #endif -->
					
					<!-- 其他保留项 -->
					<view class="item acea-row row-between-wrapper" v-if="userInfo.phone">
						<view>更换手机号码</view>
						<navigator url="/pages/users/user_phone/index?type=1" hover-class="none" class="input">
							{{$t(`点击更换手机号码`)}}<text class="iconfont icon-xiangyou"></text>
						</navigator>
					</view>
					<!-- #ifdef APP-PLUS -->
					<view class="item acea-row row-between-wrapper" v-if="userInfo.phone">
						<view>密码</view>
						<navigator url="/pages/users/user_settings/change_password" hover-class="none" class="input">
							{{$t(`点击修改密码`)}}<text class="iconfont icon-xiangyou"></text>
						</navigator>
					</view>
					<view class="item acea-row row-between-wrapper" @click="initData">
						<view>{{$t(`缓存大小`)}}</view>
						<view class="input">
							{{fileSizeString}}<text class="iconfont icon-xiangyou"></text>
						</view>
					</view>
					<view class="item acea-row row-between-wrapper" @click="updateApp">
						<view>{{$t(`当前版本`)}}</view>
						<view class="input">
							{{version}}<text class="iconfont icon-xiangyou"></text>
						</view>
					</view>
					<!-- #endif -->
					<view class="item acea-row row-between-wrapper" v-if="array.length">
						<view>{{$t(`语言切换`)}}</view>
						<view class="uni-list-cell-db">
							<picker @change="bindPickerChange" range-key="name" :value="setIndex" :range="array">
								<view class="uni-input input">{{array[setIndex].name}}<text
										class="iconfont icon-xiangyou"></text></view>
							</picker>
						</view>
					</view>
					<view class="item acea-row row-between-wrapper">
						<view>{{$t(`地址管理`)}}</view>
						<navigator url="/pages/users/user_address_list/index" hover-class="none" class="input">
							{{$t(`点击前往`)}}<text class="iconfont icon-xiangyou"></text>
						</navigator>
					</view>
					<view class="item acea-row row-between-wrapper" v-if="userInfo.invioce_func">
						<view>{{$t(`发票管理`)}}</view>
						<navigator url="/pages/users/user_invoice_list/index" hover-class="none" class="input">
							{{$t(`点击前往`)}}<text class="iconfont icon-xiangyou"></text>
						</navigator>
					</view>
					<view class="item acea-row row-between-wrapper">
						<view>{{$t(`账号注销`)}}</view>
						<navigator url="/pages/users/user_cancellation/index" hover-class="none" class="input">
							{{$t(`注销后无法恢复`)}}<text class="iconfont icon-xiangyou"></text>
						</navigator>
					</view>
					<view class="item acea-row row-between-wrapper">
						<view>{{$t(`用户协议`)}}</view>
						<navigator url="/pages/users/privacy/index?type=4" hover-class="none" class="input">
							{{$t(`点击查看`)}}<text class="iconfont icon-xiangyou"></text>
						</navigator>
					</view>
					<view class="item acea-row row-between-wrapper">
						<view>{{$t(`隐私协议`)}}</view>
						<navigator url="/pages/users/privacy/index?type=3" hover-class="none" class="input">
							{{$t(`点击查看`)}}<text class="iconfont icon-xiangyou"></text>
						</navigator>
					</view>

				</view>

				<button class='modifyBnt bg-color' formType="submit">{{$t(`保存修改`)}}</button>
				<!-- #ifdef H5 || APP-PLUS || MP -->
				<view class="logOut cartcolor acea-row row-center-wrapper" @click="outLogin">{{$t(`退出登录`)}}</view>
				<!-- #endif -->
				<!-- #ifdef APP-PLUS -->
				<app-update ref="appUpdate" :force="true" :tabbar="false" :getVer='true' @isNew="isNew"></app-update>
				<!-- #endif -->
			</view>
		</form>
		
		<!-- 性别选择弹窗 -->
		<view class="gender-picker-mask" v-if="showGenderPickerFlag" @click="hideGenderPicker"></view>
		<view class="gender-picker-panel" v-if="showGenderPickerFlag">
			<view class="gender-option" @click="selectGender(1)">男</view>
			<view class="gender-option" @click="selectGender(2)">女</view>
			<view class="gender-cancel" @click="hideGenderPicker">取消</view>
		</view>
		
		<!-- #ifdef MP -->
		<!-- <authorize @onLoadFun="onLoadFun" :isAuto="isAuto" :isShowAuth="isShowAuth" @authColse="authColse"></authorize> -->
		<!-- #endif -->
		<canvas canvas-id="canvas" v-if="canvasStatus"
			:style="{width: canvasWidth + 'px', height: canvasHeight + 'px',position: 'absolute',left:'-100000px',top:'-100000px'}"></canvas>
	</view>
</template>

<script>
	import {
		getUserInfo,
		userEdit,
		getLogout,
		getLangList,
		getLangJson,
		mpBindingPhone
	} from '@/api/user.js';
	import {
		switchH5Login,
	} from '@/api/api.js';
	import {
		toLogin
	} from '@/libs/login.js';
	import {
		mapGetters
	} from "vuex";
	import dayjs from "@/plugin/dayjs/dayjs.min.js";
	// #ifdef MP
	import authorize from '@/components/Authorize';
	import Routine from '@/libs/routine';
	// #endif
	import Cache from '@/utils/cache';
	import colors from '@/mixins/color.js';
	import appUpdate from "@/components/update/app-update.vue";
	export default {
		components: {
			// #ifdef APP-PLUS
			appUpdate
			// #endif
			// #ifdef MP
			authorize
			// #endif
		},
		mixins: [colors],
		data() {
			return {
				userInfo: {},
				loginType: 'h5', //app.globalData.loginType
				userIndex: 0,
				switchUserInfo: [],
				isAuto: false, //没有授权的不会自动授权
				isShowAuth: false, //是否隐藏授权
				canvasWidth: "",
				canvasHeight: "",
				canvasStatus: false,
				fileSizeString: '',
				version: '',
				array: [],
				setIndex: 0,
				mp_is_new: this.$Cache.get('MP_VERSION_ISNEW') || false,
				showGenderPickerFlag: false, // 是否显示性别选择器
			};
		},
		computed: mapGetters(['isLogin']),
		watch: {
			isLogin: {
				handler: function(newV, oldV) {
					if (newV) {
						this.getUserInfo();
					}
				},
				deep: true
			}
		},
		onLoad() {
			if (this.isLogin) {
				this.getUserInfo();
				this.getLangList()
				// #ifdef APP-PLUS
				this.formatSize()
				// 获取版本号
				plus.runtime.getProperty(plus.runtime.appid, (inf) => {
					this.version = inf.version;
				});
				// #endif 
			} else {
				toLogin();
			}
		},
		methods: {
			getLangList() {
				getLangList().then(res => {
					this.array = res.data
					this.setLang();
				})
			},
			isNew() {
				this.$util.Tips({
					title: this.$t(`当前为最新版本`)
				});
			},
			getphonenumber(e) {
				if (e.detail.errMsg == 'getPhoneNumber:ok') {
					Routine.getCode()
						.then(code => {
							let data = {
								code,
								iv: e.detail.iv,
								encryptedData: e.detail.encryptedData,
							}
							mpBindingPhone(data).then(res => {
								this.getUserInfo()
								this.$util.Tips({
									title: res.msg,
									icon: 'success'
								});
							}).catch(err => {
								return this.$util.Tips({
									title: err
								});
							})
						})
						.catch(error => {
							uni.hideLoading();
						});
				}
			},
			setLang() {
				this.array.map((item, i) => {
					if (this.$i18n.locale == item.value) {
						this.setIndex = i
					}
				})
			},
			bindPickerChange(e, item) {
				this.setIndex = e.detail.value
				Cache.set('locale', this.array[this.setIndex].value)
				getLangJson().then(res => {
					uni.setStorageSync('localeJson', res.data);
					this.$i18n.setLocaleMessage(this.array[this.setIndex].value, res.data[this.array[
						this.setIndex].value]);
					this.$nextTick(e => {
						this.$i18n.locale = this.array[this.setIndex].value;
					})
				})
			},

			updateApp() {
				this.$refs.appUpdate.update(); //调用子组件 检查更新
			},
			formatSize() {
				let that = this;
				plus.cache.calculate(function(size) {
					let sizeCache = parseInt(size);
					if (sizeCache == 0) {
						that.fileSizeString = "0B";
					} else if (sizeCache < 1024) {
						that.fileSizeString = sizeCache + "B";
					} else if (sizeCache < 1048576) {
						that.fileSizeString = (sizeCache / 1024).toFixed(2) + "KB";
					} else if (sizeCache < 1073741824) {
						that.fileSizeString = (sizeCache / 1048576).toFixed(2) + "MB";
					} else {
						that.fileSizeString = (sizeCache / 1073741824).toFixed(2) + "GB";
					}
				});
			},

			initData() {
				uni.showModal({
					title: this.$t(`清除缓存`),
					content: this.$t(`确定清楚本地缓存数据吗`),
					success: (res) => {
						if (res.confirm) {
							this.clearCache()
							this.formatSize()
						} else if (res.cancel) {
							return that.$util.Tips({
								title: that.$t(`取消`)
							});
						}
					}
				});
			},
			clearCache() {
				let that = this;
				let os = plus.os.name;
				if (os == 'Android') {
					let main = plus.android.runtimeMainActivity();
					let sdRoot = main.getCacheDir();
					let files = plus.android.invoke(sdRoot, "listFiles");
					let len = files.length;
					for (let i = 0; i < len; i++) {
						let filePath = '' + files[i]; // 没有找到合适的方法获取路径，这样写可以转成文件路径  
						plus.io.resolveLocalFileSystemURL(filePath, function(entry) {
							if (entry.isDirectory) {
								entry.removeRecursively(function(entry) { //递归删除其下的所有文件及子目录  
									uni.showToast({
										title: that.$t(`缓存清理完成`),
										duration: 2000
									});
									that.formatSize(); // 重新计算缓存  
								}, function(e) {
									console.log(e.message)
								});
							} else {
								entry.remove();
							}
						}, function(e) {});
					}
				} else { // ios暂时未找到清理缓存的方法，以下是官方提供的方法，但是无效，会报错  
					plus.cache.clear(function() {
						uni.showToast({
							title: that.$t(`缓存清理完成`),
							duration: 2000
						});
						that.formatSize();
					});
				}
			},
			/**
			 * 授权回调
			 */
			onLoadFun: function() {
				this.getUserInfo();
			},
			// 授权关闭
			authColse: function(e) {
				this.isShowAuth = e
			},
			/**
			 * 小程序设置
			 */
			Setting: function() {
				uni.openSetting({
					success: function(res) {}
				});
			},
			switchAccounts: function(index) {
				let userInfo = this.switchUserInfo[index],
					that = this;
				that.userIndex = index;
				if (that.switchUserInfo.length <= 1) return true;
				if (userInfo === undefined) return that.$util.Tips({
					title: that.$t(`切换的账号不存在`)
				});
				if (userInfo.user_type === 'h5') {
					uni.showLoading({
						title: that.$t(`正在切换中`)
					});
					switchH5Login().then(res => {
						uni.hideLoading();
						that.$store.commit("LOGIN", {
							'token': res.data.token,
							'time': this.$Cache.strTotime(res.data.expires_time) - this.$Cache.time()
						});
						that.getUserInfo();
					}).catch(err => {
						uni.hideLoading();
						return that.$util.Tips({
							title: err
						});
					})
				} else {
					that.$store.commit("LOGOUT");
					uni.showLoading({
						title: that.$t(`正在切换中`)
					});
					toLogin();
				}
			},
			/**
			 * 退出登录
			 * 
			 */
			outLogin: function() {
				let that = this;
				if (that.loginType == 'h5') {
					uni.showModal({
						title: that.$t(`提示`),
						content: that.$t(`确认退出登录`),
						success: function(res) {
							if (res.confirm) {
								getLogout()
									.then(res => {
										// uni.clearStorage()
										that.$store.commit("LOGOUT");
										uni.reLaunch({
											url: '/pages/index/index'
										})
									})
									.catch(err => {});
							} else if (res.cancel) {}
						}
					});
				}
			},
			/**
			 * 获取用户详情
			 */
			getUserInfo: function() {
				let that = this;
				getUserInfo().then(res => {
					that.$set(that, 'userInfo', res.data);
					let switchUserInfo = res.data.switchUserInfo || [];
					for (let i = 0; i < switchUserInfo.length; i++) {
						if (switchUserInfo[i].uid == that.userInfo.uid) that.userIndex = i;
						// 切割h5用户；user_type状态：h5、routine（小程序）、wechat（公众号）；注：只有h5未注册手机号时，h5才可和小程序或是公众号数据想通；
						//#ifdef H5
						if (
							!that.$wechat.isWeixin() &&
							switchUserInfo[i].user_type != "h5" &&
							switchUserInfo[i].phone === ""
						)
							switchUserInfo.splice(i, 1);
						//#endif
					}
					that.$set(that, "switchUserInfo", switchUserInfo);
				});
			},
			/**
			 * 上传文件
			 * 
			 */
			uploadpic: function() {
				let that = this;
				this.canvasStatus = true
				that.$util.uploadImageChange('upload/image', (res) => {
					let userInfo = that.switchUserInfo[that.userIndex];
					if (userInfo !== undefined) {
						that.userInfo.avatar = res.data.url;
					}
					that.switchUserInfo[that.userIndex] = userInfo;
					that.$set(that, 'switchUserInfo', that.switchUserInfo);
					this.canvasStatus = false
				}, (res) => {
					this.canvasStatus = false
				}, (res) => {
					this.canvasWidth = res.w
					this.canvasHeight = res.h
				});
			},
			// 微信头像获取
			onChooseAvatar(e) {
				const {
					avatarUrl
				} = e.detail
				this.$util.uploadImgs('upload/image', avatarUrl, (res) => {
					this.userInfo.avatar = res.data.url
				}, (err) => {
					console.log(err)
				})
			},
			/**
			 * 提交修改
			 */
			formSubmit: function(e) {
				let that = this,
					formData = e.detail.value;

				userEdit({
					nickname: formData.nickname
				}).then(res => {
					that.getUserInfo();
					that.$util.Tips({
						title: res.msg,
						icon: 'success'
					});
				}).catch(err => {
					that.$util.Tips({
						title: err
					});
				})
			},
			// 页面导航
			navigateTo(url) {
				uni.navigateTo({
					url
				});
			},
			
			// 返回上一页
			navigateBack() {
				uni.navigateBack();
			},
			
			// 显示性别选择器
			showGenderPicker() {
				this.showGenderPickerFlag = true;
			},
			
			// 隐藏性别选择器
			hideGenderPicker() {
				this.showGenderPickerFlag = false;
			},
			
			// 选择性别
			selectGender(gender) {
				this.userInfo.sex = gender;
				this.hideGenderPicker();
				
				// 保存性别设置
				userEdit({
					sex: gender
				}).then(res => {
					this.$util.Tips({
						title: '性别设置成功'
					});
				}).catch(err => {
					this.$util.Tips({
						title: err
					});
				});
			},
		}
	}
</script>

<style lang="scss" scoped>
.personal-data {
	background-color: #fff;
	min-height: 100vh;
}

.header {
	position: relative;
	height: 88rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	border-bottom: 1rpx solid #f5f5f5;
	
	.back-icon {
		position: absolute;
		left: 30rpx;
		font-size: 36rpx;
	}
	
	.page-title {
		font-size: 36rpx;
		font-weight: 500;
	}
}

.list {
	margin-top: 12rpx;
	
	.item {
		padding: 30rpx;
		border-bottom: 1rpx solid #f5f5f5;
		font-size: 30rpx;
		
		.right-content {
			display: flex;
			align-items: center;
			
			.avatar-img {
				width: 80rpx;
				height: 80rpx;
				border-radius: 50%;
				margin-right: 10rpx;
			}
			
			.value-text {
				color: #999;
				margin-right: 10rpx;
			}
			
			.right-arrow {
				color: #999;
				font-size: 24rpx;
			}
		}
	}
}

.modifyBnt {
	width: 690rpx;
	height: 90rpx;
	border-radius: 45rpx;
	margin: 60rpx auto 0 auto;
	text-align: center;
	line-height: 90rpx;
	color: #FFFFFF;
	font-size: 30rpx;
}

.logOut {
	padding: 20rpx 0;
	text-align: center;
	margin: 50rpx 0;
	color: var(--view-theme);
	font-size: 30rpx;
}

// 性别选择弹窗
.gender-picker-mask {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.5);
	z-index: 998;
}

.gender-picker-panel {
	position: fixed;
	left: 50%;
	bottom: 0;
	transform: translateX(-50%);
	width: 100%;
	background-color: #fff;
	z-index: 999;
	border-radius: 20rpx 20rpx 0 0;
	overflow: hidden;
	
	.gender-option {
		height: 100rpx;
		line-height: 100rpx;
		text-align: center;
		font-size: 32rpx;
		border-bottom: 1rpx solid #f5f5f5;
		color: #1989fa;
	}
	
	.gender-cancel {
		height: 100rpx;
		line-height: 100rpx;
		text-align: center;
		font-size: 32rpx;
		margin-top: 10rpx;
		color: #333;
	}
}
</style>
