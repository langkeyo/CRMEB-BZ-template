<template>
	<view class="user-info-page">
		<!-- 顶部导航栏 -->
		<view class="header">
			<view class="back-btn" @click="navigateBack">
				<image src="/static/icons/back-arrow.svg" class="back-icon" />
			</view>
			<view class="page-title">个人资料</view>
		</view>
		<view class="list">
			<!-- 头像 -->
			<view class="item" @click="navigateTo('/pages/users/user_avatar/index')">
				<view>头像</view>
				<view class="right-content">
					<image class="avatar-img" :src="userInfo.avatar"></image>
					<image class="arrow-icon" src="/static/common/icons/navigation/arrow_right.svg" />
				</view>
			</view>
			<view class="divider"></view>
			<!-- 昵称 -->
			<view class="item" @click="navigateTo('/pages/users/user_nickname/index')">
				<view>昵称</view>
				<view class="right-content">
					<text class="value-text">{{ userInfo.nickname || '加载中...' }}</text>
					<image class="arrow-icon" src="/static/common/icons/navigation/arrow_right.svg" />
				</view>
			</view>
			<view class="divider"></view>
			<!-- 性别（高亮） -->
			<view class="item highlight" @click="showGenderPickerFlag = true">
				<view>性别</view>
				<view class="right-content">
					<text class="value-text">{{ userInfo.sex == 1 ? '男' : (userInfo.sex == 2 ? '女' : '未设置') }}</text>
					<image class="arrow-icon" src="/static/common/icons/navigation/arrow_right.svg" />
				</view>
			</view>
			<view class="divider"></view>
			<!-- 生日 -->
			<view class="item" @click="showBirthdayPicker = true">
				<view>生日</view>
				<view class="right-content">
					<text class="value-text">{{ userInfo.birthday || '未设置' }}</text>
					<image class="arrow-icon" src="/static/common/icons/navigation/arrow_right.svg" />
				</view>
			</view>
		</view>
		<!-- 自定义底部性别选择弹窗（无动画，静态弹出） -->
		<view v-if="showGenderPickerFlag">
			<view class="popup-mask" @click="hideGenderPicker"></view>
			<view class="gender-popup-container">
				<!-- 选项弹窗 -->
				<view class="gender-popup-options">
					<view class="gender-option" @click="selectGender(1)">男</view>
					<view class="gender-divider"></view>
					<view class="gender-option" @click="selectGender(2)">女</view>
				</view>
				<!-- 取消按钮 -->
				<view class="gender-popup-cancel" @click="hideGenderPicker">取消</view>
			</view>
		</view>
		<!-- 生日底部弹窗 -->
		<view v-if="showBirthdayPicker">
			<view class="popup-mask" @click="hideBirthdayPicker"></view>
			<view class="birthday-popup-full">
				<view class="birthday-popup-title">生日</view>
				
				<!-- 简单的日期选择器 -->
				<view class="birthday-picker-container">
					<!-- 高亮背景条 -->
					<view class="picker-highlight-left"></view>
					<view class="picker-highlight-right"></view>
					
					<picker-view :value="[birthdayMonth-1, birthdayDay-1]" @change="onBirthdayChange" class="birthday-picker" :indicator-style="'height: 80rpx;'">
						<picker-view-column>
							<view class="picker-item" v-for="(m, i) in 12" :key="'m'+i">{{ (i+1) < 10 ? '0'+(i+1) : (i+1) }}月</view>
						</picker-view-column>
						<picker-view-column>
							<view class="picker-item" v-for="(d, i) in daysInMonth(birthdayMonth)" :key="'d'+i">{{ (i+1) < 10 ? '0'+(i+1) : (i+1) }}日</view>
						</picker-view-column>
					</picker-view>
				</view>
				
				<!-- 底部按钮 -->
				<view class="birthday-popup-btns-row">
					<view class="birthday-popup-btn-item cancel" @click="hideBirthdayPicker">取消</view>
					<view class="birthday-popup-btn-item confirm" @click="confirmBirthday">确定</view>
				</view>
			</view>
		</view>
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
				showBirthdayPicker: false,
				birthdayMonth: 1,
				birthdayDay: 1
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
			hideBirthdayPicker() {
				this.showBirthdayPicker = false;
			},
			daysInMonth(month) {
				const days = [31,28,31,30,31,30,31,31,30,31,30,31];
				return days[month-1];
			},
			onBirthdayChange(e) {
				const [m, d] = e.detail.value;
				this.birthdayMonth = m + 1;
				this.birthdayDay = d + 1;
			},
			confirmBirthday() {
				const birthday = `${this.birthdayMonth < 10 ? '0'+this.birthdayMonth : this.birthdayMonth}-${this.birthdayDay < 10 ? '0'+this.birthdayDay : this.birthdayDay}`;
				// 保存到后端
				this.$api.userEdit({ birthday }).then(() => {
					this.userInfo.birthday = birthday;
					this.hideBirthdayPicker();
					this.$util.Tips({ title: '生日设置成功', icon: 'success' });
				}).catch(err => {
					this.$util.Tips({ title: err || '生日设置失败' });
				});
			},
		}
	}
</script>

<style lang="scss" scoped>
.user-info-page {
	min-height: 100vh;
	background: #fff;
}
.header {
	display: flex;
	align-items: center;
	justify-content: center;
	height: 100rpx;
	background: #fff;
	position: relative;
	border-bottom: 1rpx solid #F2F2F2;
}
.back-btn {
	position: absolute;
	left: 20rpx;
	display: flex;
	align-items: center;
	height: 100%;
}
.back-icon {
	width: 32rpx;
	height: 32rpx;
}
.page-title {
	font-size: 36rpx;
	color: #1A1A1A;
	font-weight: 400;
	text-align: center;
}
.list {
	background: #fff;
}
.item {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0 30rpx;
	height: 100rpx;
	background: #fff;
	position: relative;
}
.item.highlight {
	border: none;
	border-radius: 0;
	box-sizing: border-box;
}
.right-content {
	display: flex;
	align-items: center;
}
.avatar-img {
	width: 60rpx;
	height: 60rpx;
	border-radius: 50%;
	margin-right: 10rpx;
}
.value-text {
	color: #B3B3B3;
	font-size: 25rpx;
	margin-right: 10rpx;
}
.item > view:first-child {
	font-size: 32rpx;
}
.arrow-icon {
	width: 20rpx;
	height: 20rpx;
	opacity: 0.5;
}
.divider {
	height: 1rpx;
	background: #F2F2F2;
	margin-left: 30rpx;
}
.popup-mask {
	position: fixed;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	background: rgba(0,0,0,0.5);
	z-index: 998;
}
.gender-popup-container {
	position: fixed;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 999;
	padding: 16rpx 24rpx 40rpx 24rpx;
	display: flex;
	flex-direction: column;
	gap: 16rpx;
}
.gender-popup-options {
	background: #fff;
	border-radius: 16rpx;
	overflow: hidden;
}
.gender-option {
	font-size: 32rpx;
	color: #2196f3;
	text-align: center;
	padding: 32rpx 0;
}
.gender-divider {
	height: 1rpx;
	background: #eee;
}
.gender-popup-cancel {
	font-size: 32rpx;
	color: #2196f3;
	text-align: center;
	padding: 32rpx 0;
	background: #fff;
	border-radius: 16rpx;
}
.birthday-popup {
	position: fixed;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 999;
	display: flex;
	justify-content: center;
	align-items: flex-end;
}
.birthday-popup-content {
	width: 96%;
	background: #fff;
	border-radius: 16rpx;
	padding: 0 0 24rpx 0;
	box-sizing: border-box;
	margin-bottom: 24rpx;
}
.birthday-picker-row {
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 32rpx 0 16rpx 0;
}
.birthday-picker {
	width: 100%;
	height: 300rpx;
}
.birthday-picker-item {
	text-align: center;
	font-size: 32rpx;
	line-height: 80rpx;
	color: #333;
}
.birthday-popup-divider {
	height: 1rpx;
	background: #eee;
	margin: 0 24rpx;
}
.birthday-popup-btns {
	display: flex;
	flex-direction: column;
	gap: 16rpx;
	margin-top: 16rpx;
	padding: 0 24rpx;
}
.birthday-popup-btn {
	background: #fff;
	color: #2196f3;
	font-size: 32rpx;
	text-align: center;
	padding: 32rpx 0;
	border-radius: 12rpx;
}
.birthday-popup-btn.confirm {
	background: #f7f7f7;
	margin-top: 0;
}
.birthday-popup-full {
	position: fixed;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 999;
	background: #fff;
	border-radius: 16rpx 16rpx 0 0;
	box-sizing: border-box;
	padding: 30rpx;
}
.birthday-popup-title {
	text-align: center;
	font-size: 32rpx;
	font-weight: 500;
	margin-bottom: 30rpx;
}
.birthday-empty-space {
	height: 240rpx;
	width: 100%;
	margin-bottom: 30rpx;
}
.birthday-picker-container {
	position: relative;
	height: 240rpx;
	margin-bottom: 30rpx;
}
.picker-highlight-left, .picker-highlight-right {
	position: absolute;
	width: 44%;
	height: 80rpx;
	background-color: #f5f5f5;
	border-radius: 12rpx;
	top: 50%;
	transform: translateY(-50%);
	z-index: 1;
	pointer-events: none;
}
.picker-highlight-left {
	left: 3%;
}
.picker-highlight-right {
	right: 3%;
}
.birthday-picker {
	height: 240rpx;
	width: 100%;
	z-index: 2;
}
.picker-item {
	line-height: 80rpx;
	text-align: center;
	font-size: 32rpx;
	color: #999;
}
.birthday-popup-btns-row {
	display: flex;
	justify-content: space-between;
	gap: 20rpx;
}
.birthday-popup-btn-item {
	flex: 1;
	height: 80rpx;
	line-height: 80rpx;
	text-align: center;
	font-size: 32rpx;
	border-radius: 40rpx;
	background: #f5f5f5;
}
.birthday-popup-btn-item.cancel {
	color: #333;
}
.birthday-popup-btn-item.confirm {
	color: #ff9500;
}
.birthday-picker-row-flex {
	display: flex;
	justify-content: center;
	align-items: flex-start;
	gap: 32rpx;
	margin-bottom: 24rpx;
}
.birthday-picker-flex {
	display: flex;
	width: 100vw;
	height: 180rpx;
	background: none;
}
.birthday-picker-item-flex {
	width: 160rpx;
	height: 48rpx;
	line-height: 48rpx;
	text-align: center;
	font-size: 28rpx;
	color: #bbb;
	margin: 8rpx auto;
	border-radius: 12rpx;
	background: none;
	font-weight: normal;
}
.birthday-picker-item-flex.active {
	background: #f5f5f5;
	color: #111;
	font-weight: bold;
}
.birthday-popup-btns-flex {
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: 24rpx;
	margin: 0 24rpx;
}
.birthday-popup-btn-flex {
	flex: 1;
	height: 48rpx;
	line-height: 48rpx;
	text-align: center;
	font-size: 28rpx;
	border-radius: 24rpx;
	background: #f5f5f5;
	color: #999;
}
.birthday-popup-btn-flex.confirm {
	color: #ff9500;
	font-weight: 500;
}
.birthday-popup-btn-flex.cancel {
	color: #999;
}
</style>
