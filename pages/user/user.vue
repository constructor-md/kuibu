<template>
	<popup ref="pop">
		<view class="header">
			<text>建议提交</text>
		</view>
		<view class="content">
			<textarea v-model="suggestion" placeholder="请输入您的宝贵建议或意见"></textarea>
		</view>
		<view class="footer">
			<view class="btn" @click="closePopup">取消</view>
			<view class="btn" @click="submit">提交</view>
		</view>
	</popup>
	<view class="layout">
		<view class="card">
			<view class="user">
				<image class="avatar" src="../../static/images/user.png" mode=""></image>
				<text class="username">无名</text>
			</view>
			<view class="operator">
				<view class="data" @click="clearData()">清除全部数据</view>
				<view class="suggestion" @click="suggest">提出建议</view>
				<view class="advertisement">休息一下</view>
			</view>
		</view>
	</view>

</template>

<script setup>
	const clearData = function() {
		uni.showModal({
			title: "是否清除全部数据？",
			content: "清除的数据不可恢复，请谨慎操作",
			confirmText: "清除",
			success: (res) => {
				if (res.confirm) {
					console.log("确认清除数据");

					uni.showToast({
						title: "数据已清除",
						icon: "success"
					})
				}
			}
		})
	}

	const pop = ref(null)
	const suggest = function() {
		pop.value.show = true
	}
	
	const suggestion = ref("")
	const closePopup = function() {
		pop.value.show = false;
		console.log("close");
	}
	const submit = function() {
		pop.value.show = false;
		console.log("submit", suggestion.value);
		suggestion.value = ""
	}
</script>

<style lang="scss">
	.header {
		height: 15%;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #cd87ff;
		font-size: 40rpx;
	}

	.content {
		height: 70%;
		background: #faf7fa;
		display: flex;
		align-items: center;
		justify-content: center;

		textarea {
			width: 95%;
			height: 95%;
			font-size: 32rpx;
		}
	}

	.footer {
		display: flex;
		height: 15%;

		.btn {
			color: #cd87ff;
			width: 50%;
			display: flex;
			align-items: center;
			justify-content: center;
		}
	}

	.layout {
		width: 100vw;
		height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;

		.card {
			margin-top: 80rpx;
			width: 90vw;
			height: 80vh;
			display: flex;
			align-items: center;
			justify-content: center;
			flex-direction: column;
			border-radius: 50rpx;
			box-shadow: 2px 2px 5px rgba(128, 128, 128, 0.5);

			.user {
				width: 60%;
				height: 30%;
				display: flex;
				align-items: center;
				justify-content: center;
				flex-direction: column;

				image {
					width: 300rpx;
					height: 300rpx;
					border-radius: 50%;
					border: 1px solid #cd87ff;
					box-shadow: 2px 2px 5px rgba(128, 128, 128, 0.5);
				}

				.username {
					margin-top: 20rpx;
					font-size: 40rpx;
					color: #cd87ff;
				}
			}

			.operator {
				width: 60%;
				height: 30%;
				margin-top: 50rpx;

				.data {
					height: 30%;
					font-size: 40rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					background: #fff;
					border-radius: 50rpx;
					box-shadow: 2px 2px 5px rgba(128, 128, 128, 0.5);
					color: #cd87ff;
				}

				.suggestion {
					margin-top: 20rpx;
					height: 30%;
					font-size: 40rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					background: #fff;
					border-radius: 50rpx;
					box-shadow: 2px 2px 5px rgba(128, 128, 128, 0.5);
					color: #cd87ff;
				}

				.advertisement {
					margin-top: 20rpx;
					height: 30%;
					display: flex;
					align-items: center;
					justify-content: center;
					font-size: 40rpx;
					background: #fff;
					border-radius: 50rpx;
					box-shadow: 2px 2px 5px rgba(128, 128, 128, 0.5);
					color: #cd87ff;
				}
			}
		}
	}
</style>