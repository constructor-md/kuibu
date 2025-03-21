<script>
	import { login } from "@/api/common.js"
	
	export default {
		onLaunch: function() {
			console.log('App Launch')
			login()
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	
	
	// 页面通用
	page {
		// 统一背景色
		background-color: #faf7fa;
	}
	
	
	// tab 样式
	.uni-tabbar {
		// 背景色
		background-color: #fdfdfd !important;
		// tabbar圆角
		// border-radius: 50rpx;
		// box-shadow: 10rpx 10rpx 50rpx #e6e4e6;
	}
	
	
	
	
</style>
