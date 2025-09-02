<template>
	<view class="content">
		<jyf-parser :html="content" ref="article" :tag-style="tagStyle"></jyf-parser>
	</view>
</template>

<script>
	import parser from "@/components/jyf-parser/jyf-parser";
	import {
		getUserAgreement,
	} from '@/api/user.js';
	export default {
		components: {
			"jyf-parser": parser
		},
		data() {
			return {
				tagStyle: {
					img: 'width:100%;display:block;',
					table: 'width:100%',
					video: 'width:100%',
					p: 'font-size:28rpx;line-height:1.6;margin:16rpx 0;color:#333333;',
					div: 'font-size:28rpx;line-height:1.6;color:#333333;',
					h1: 'font-size:36rpx;font-weight:600;margin:24rpx 0 16rpx 0;color:#222222;',
					h2: 'font-size:32rpx;font-weight:600;margin:20rpx 0 12rpx 0;color:#222222;',
					h3: 'font-size:30rpx;font-weight:600;margin:16rpx 0 8rpx 0;color:#222222;',
					li: 'font-size:28rpx;line-height:1.6;margin:8rpx 0;color:#333333;',
					span: 'font-size:28rpx;color:#333333;'
				},
				content: ``
			}
		},
		onLoad(options) {
			getUserAgreement(options.type).then(res => {
				this.content = res.data.content
				uni.setNavigationBarTitle({
					title: res.data.title
				});
			}).catch(err => {
				that.$util.Tips({
					title: err
				});
			})
		}
		
	}
</script>

<style scoped>
	page {
		background-color: #fff;
	}

	.content {
		padding: 40rpx 30rpx;
		font-size: 28rpx;
		line-height: 1.6;
		color: #333333;
		word-break: break-all;
		word-wrap: break-word;
	}

	/* 针对解析器内容的全局样式优化 */
	.content /deep/ * {
		max-width: 100% !important;
		box-sizing: border-box;
	}

	.content /deep/ p {
		margin: 16rpx 0 !important;
	}

	.content /deep/ h1,
	.content /deep/ h2,
	.content /deep/ h3,
	.content /deep/ h4,
	.content /deep/ h5,
	.content /deep/ h6 {
		margin: 24rpx 0 12rpx 0 !important;
		font-weight: 600 !important;
	}
</style>
