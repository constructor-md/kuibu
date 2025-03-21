<template>
	<view class="mask" v-if="show" @click="closePopup">
		<view class="box" @click.stop>
			<slot></slot>
		</view>
	</view>
</template>

<script setup>
	const show = ref(false);
	const closePopup = function() {
		show.value = false;
		console.log("close");
	}
	defineExpose({
		show:show
	})
</script>

<style lang="scss" scoped>
	.mask {
		// 绝对定位使其脱离文档流，显示后占据页面中 不挤压其他组件空间
		position: fixed;
		top: 0;
		left: 0;
		
		width: 100vw;
		height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		animation: fadeIn 0.3s ease;
		z-index: 1;
		.box {
			background: #fff;
			width: 80%;
			height: 40%;
			border-radius: 50rpx;
			box-shadow: 2px 2px 5px rgba(128, 128, 128, 0.5);
		}

	}
</style>