<template>
	<popup ref="pop">
		<view class="header">
			<text>建议提交</text>
		</view>
		<view class="content">
			<textarea maxlength="300" v-model="suggestion" placeholder="请输入您的宝贵建议或意见"></textarea>
		</view>
		<view class="footer">
			<view class="btn" @click="closePopup">取消</view>
			<view class="btn" @click="submit">提交</view>
		</view>
	</popup>
	<view class="layout">
		<view class="card">
			<view class="user">
				<image class="avatar" :src="avatar" mode=""></image>
				<view class="username">
					<template v-if="edit">
						<input class="data-input" type="text" v-model="updateUsername" placeholder="请输入用户名"  />
						<view class="icon"  @click="editUsernameOk()">
							<image src="/static/images/ok.png" mode=""></image>
						</view>
					</template>
					<template v-else>
						<text class="data">{{username}}</text>
						<view class="icon"  @click="editUsername()">
							<image src="/static/images/edit.png" mode=""></image>
						</view>
					</template>
				</view>
				
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
	import { apiEditUsername, apiSubmitSuggestion } from "@/api/api.js"
	import { refreshUserinfo } from "@/api/common.js"
	
	const username = ref(uni.getStorageSync("username"))
	const avatar = uni.getStorageSync("avatar")
	const edit = ref(false)
	const updateUsername = ref("")
	const editUsername = () => {
		edit.value = true;
	}
	
	const editUsernameOk = async () => {
		if(updateUsername.value.length <= 0) {
			uni.showToast({
				title: "用户名不可为空",
				icon: "error"
			})
		} else{
			await apiEditUsername(updateUsername.value);
			await refreshUserinfo();
			username.value = uni.getStorageSync("username")
			edit.value = false;
		}
	}
	
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
	const submit = async function() {
		await apiSubmitSuggestion(suggestion.value);
		console.log("submit", suggestion.value);
		pop.value.show = false;
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

				.avatar {
					width: 300rpx;
					height: 300rpx;
					border-radius: 50%;
					border: 1px solid #cd87ff;
					box-shadow: 2px 2px 5px rgba(128, 128, 128, 0.5);
				}

				.username {
					width: 100%;
					margin-top: 20rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					position: relative;
					.data{
						font-size: 40rpx;
						color: #cd87ff;
					}
					.data-input{
						width: 280rpx;
						font-size: 40rpx;
						color: #cd87ff;
						border: 1px solid #cd87ff;
					}
					.icon{
						width: 50rpx;
						height: 50rpx;
						border-radius: 50%;
						right: 0;
						margin-left: auto;
						position: absolute;
						image {
							width: 50rpx;
							height: 50rpx;
						}
					}
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