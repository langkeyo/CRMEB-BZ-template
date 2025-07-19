<template>
	<view class="empty-box">
		<image :src="image || imgHost + '/statics/images/empty-box.png'" mode="aspectFit"></image>
		<view class="txt">{{title || $t(`暂无记录`)}}</view>
	</view>
</template>

<script>
	import {HTTP_REQUEST_URL} from '@/config/app';
	export default{
		props: {
			title: {
				type: String,
				default: '',
			},
			image: {
				type: String,
				default: '',
			}
		},
		data(){
			return{
				imgHost:HTTP_REQUEST_URL
			}
		}
	}
	
</script>

<style lang="scss">
	.empty-box{
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding-top: 100rpx;
		image{
			width: 296rpx;
			height: 206rpx;
			margin-bottom: 20rpx;
		}
		.txt{
			font-size: 26rpx;
			color: #777777;
			font-family: 'PingFang SC';
			font-weight: 400;
		}
	}
</style>
