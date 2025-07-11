// +----------------------------------------------------------------------
// | CRMEB [ CRMEB赋能开发者，助力企业发展 ]
// +----------------------------------------------------------------------
// | Copyright (c) 2016~2024 https://www.crmeb.com All rights reserved.
// +----------------------------------------------------------------------
// | Licensed CRMEB并不是自由软件，未经许可不能去掉CRMEB相关版权
// +----------------------------------------------------------------------
// | Author: CRMEB Team <admin@crmeb.com>
// +----------------------------------------------------------------------

import request from "@/utils/request.js";
import wechat from "@/libs/wechat.js";

/**
 * 获取微信sdk配置
 * @returns {*}
 */
export function getWechatConfig() {
	return request.get("wechat/config", { url: wechat.signLink() });
}

/**
 * 获取微信sdk配置
 * @returns {*}
 */
export function wechatAuth(code, spread, login_type) {
	return request.get(
		"wechat/auth?code=" + code + "&spread=" + spread + "&login_type=" + login_type
	);
}

/**
 * 获取登录授权login
 * 
 */
export function getLogo() {
	return request.get('wechat/get_logo', {}, { noAuth: true });
}

/**
 * 小程序用户登录
 * @param data object 小程序用户登陆信息
 */
export function login(data) {
	return request.post("wechat/mp_auth", data, { noAuth: true });
}

/**
 * 静默授权
 * @param {Object} data
 */
export function silenceAuth(data) {
	//#ifdef MP
	return request.get("v2/wechat/silence_auth", data, {
		noAuth: true
	});
	//#endif
	//#ifdef H5
	return request.get("v2/wechat/auth_type", data, {
		noAuth: true
	});
	//#endif
}

/**
 * 分享
 * @returns {*}
 */
export function getShare() {
	return request.get("share", {}, { noAuth: true });
}

/**
 * 公众号登录
 * @returns {*}
 */
export function wechatAuthLogin(data) {
	return request.get("v2/wechat/auth_login", data, {
		noAuth: true
	});
}

/**
 * 获取关注海报
 * @returns {*}
 */
export function follow() {
	return request.get("wechat/follow", {}, { noAuth: true });
}

/**
 * code生成用户
 * @returns {*}
 */
export function authType(data) {
	return request.get("v2/routine/auth_type", data, {
		noAuth: true
	});
}

/**
 * 授权登录
 * @returns {*}
 */
export function authLogin(data) {
	return request.get("v2/routine/auth_login", data, {
		noAuth: true
	});
}

/**
 * 获取图片base64
 * @retins {*}
 * */
export function imageBase64(image, code) {
	return request.post(
		"image_base64",
		{ image: image, code: code },
		{ noAuth: true }
	);
}

/**
 * 自动复制口令功能
 * @returns {*}
 */
export function copyWords() {
	return request.get("copy_words", {}, { noAuth: true });
}

/**
 * 获取商城是否强制绑定手机号
 * @returns {*}
 */
export function getShopConfig() {
	return request.get("v2/bind_status", {}, { noAuth: true });
}

/**
 * 小程序绑定手机号
 * @param {Object} data
 */
export function routineBindingPhone(data) {
	return request.post('v2/routine/auth_binding_phone', data, {
		noAuth: true
	});
}

/**
 * 小程序绑定手机号
 * @param {Object} data
 */
export function wechatBindingPhone(data) {
	return request.post('v2/wechat/auth_binding_phone', data, {
		noAuth: true
	});
}

/**
 * 小程序手机号登录
 * @param {Object} data
 */
export function phoneLogin(data) {
	return request.post('v2/routine/phone_login', data, {
		noAuth: true
	});
}

/**
 * 小程序用户登录
 * @param data object 小程序用户登陆信息
 */
export function routineLogin(data) {
	return request.get("v2/wechat/routine_auth", data, {
		noAuth: true
	});
}

/**
 * 获取微信sdk配置
 * @returns {*}
 */
export function wechatAuthV2(code, spread) {
	return request.get(
		"v2/wechat/auth", {
			code,
			spread
		}, {
			noAuth: true
		}
	);
}

/**
 * 获取组件底部菜单
 * @param data object 获取组件底部菜单
 */
export function getNavigation(data) {
	return request.get("navigation", data, {
		noAuth: true
	});
}

export function getSubscribe() {
	return request.get("subscribe", {}, {
		noAuth: true
	});
}

/**
 * 获取版本信息
 * @param 系统类型
 */
export function getUpdateInfo(type) {
	return request.get("get_new_app/" + type, {}, {
		noAuth: true
	});
}

/**
 * 获取首页DIY数据版本号
 * 
 */
export function getVersion(name) {
	return request.get(`v2/diy/get_version/${name}`, {}, {
		noAuth: true
	});
}

/**
 * 获取商品分类版本号
 * 
 */
export function getCategoryVersion(name) {
	return request.get(`category_version`, {}, {
		noAuth: true
	});
}

/**
 * 配置信息
 * 
 */
export function basicConfig(name) {
	return request.get(`basic_config`, {}, {
		noAuth: true
	});
}

/**
 * 后台版本信息
 * 
 */
export function getSystemVersion() {
	return request.get(`version`, {}, {
		noAuth: true
	});
}

/**
 * iframe登录
 * 
 */
export function remoteRegister(data) {
	return request.get(`remote_register`, data, {
		noAuth: true
	});
}

/**
 * 获取商城配置
 * @returns {*}
 */
export function getConfig() {
	return request.get("config", {}, { noAuth: true });
}

/**
 * 获取商城配置
 * @returns {*}
 */
export function getThemeConfig() {
	return request.get("v2/get_theme_config", {}, { noAuth: true });
}

/**
 * 获取商城全局配置
 * @returns {*}
 */
export function getAppConfig() {
	return request.get("v2/get_app_config", {}, { noAuth: true });
}

/**
 * 获取版权信息
 * @returns {*}
 */
export function getCrmebInfo() {
	return request.get("copyright", {}, { noAuth: true });
}

/**
 * 获取商城全局配置
 * @returns {*}
 */
export function getSystemConfig() {
	return request.get("v2/get_system_config", {}, { noAuth: true });
}

/**
 * 获取首页DIY；
 * @param data
 * @returns {*}
 */
export function getDiy(data) {
	return request.get("v2/diy/get_diy", data, { noAuth: true });
}

/**
 * 获取公告列表
 * @returns {*}
 */
export function getNoticeList(data) {
	return request.get("v2/get_notice_list", data, { noAuth: true });
}

/**
 * 获取公告详情
 * @returns {*}
 */
export function getNoticeInfo(id) {
	return request.get("v2/get_notice_info/" + id, {}, { noAuth: true });
}

/**
 * 获取搜索关键字
 * @returns {*}
 */
export function getSearchKeyword() {
	return request.get("v2/search/keyword", {}, { noAuth: true });
}

/**
 * 获取地理位置
 * @returns {*}
 */
export function getCity() {
	return request.get("city_list", {}, { noAuth: true });
}

/**
 * 获取可用优惠券列表
 * @param {Object} data - 请求参数，包含页码、每页数量、搜索关键词等
 */
export function getAvailableCoupons(data) {
	return request.get('group/coupons/available/list', data);
}

/**
 * 获取优惠券详情
 * @param {Number|String} id - 优惠券ID
 */
export function getCouponDetail(id) {
	return request.get(`group/coupons/detail/${id}`);
}

/**
 * 获取我的优惠券列表
 * @param {Object} data - 请求参数，包含状态筛选、页码、每页数量等
 */
export function getMyCoupons(data) {
	return request.get('group/coupons/my/list', data);
}

/**
 * 获取订单可用优惠券
 * @param {Object} data - 请求参数，包含订单金额等
 */
export function getOrderAvailableCoupons(data) {
	return request.get('group/coupons/order/available', data);
}

/**
 * 领取优惠券
 * @param {Object} data - 请求参数，包含优惠券ID
 */
export function receiveCoupon(data) {
	return request.post('group/coupons/receive', data);
}
