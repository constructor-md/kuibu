<template>
	<view class="layout">
		<view class="top">
			<view class="text">
				<view class="title"> {{ title }} </view>
				<view class="taskOngoing">8 个目标进行中 ... </view>
			</view>
		</view>
		<view class="middle">
			<view class="maxim">
				<view class="sentence"> {{ sentence }} </view>
				<view class="author"> {{ name }}：{{ origin }} </view>
				<view class="date">
					<text class="day">12</text>
					<text class="month">MAR</text>
				</view>
			</view>
		</view>
		<view class="notice">
			<view class="left">
				<image src="../../static/images/good.png" mode=""></image>
			</view>
			<view class="center">
				<swiper scroll-y="true" autoplay vertical circular>
					<swiper-item v-for="item in 5">
						文字内容文字内容文字内容文字内容文字内容文字内容文字内容文字内容文字内容
					</swiper-item>
				</swiper>
			</view>
		</view>
		<view class="content">
			<view class="review">
				回望
			</view>
			<view class="region">
				<view class="total">
					<view class="icon">
						<image src="../../static/images/step.png" mode=""></image>
					</view>
					<view class="text">
						<text class="step">30</text>
						步矣
					</view>
				</view>
				<view class="yesterday">
					<view class="icon">
						<image src="../../static/images/tag.png" mode=""></image>
					</view>
					<view class="text">
						<text class="step">8</text>
						欲行
					</view>
				</view>
				<view class="target" @click="addTask">
					<view class="icon">
						<image src="../../static/images/task.png" mode=""></image>
					</view>
					<view class="text">
						设定任务
					</view>
				</view>
				<view class="task" @click="startTask">
					<view class="icon">
						<image src="../../static/images/start.png" mode=""></image>
					</view>
					<view class="text">
						索性开始
					</view>
				</view>
			</view>
		</view>
	</view>

	<popup ref="popTask">
		<view class="popTitle">
			<text>任务设定</text>
		</view>
		<view class="popTaskContent">

			<view class="titleName">
				任务名
			</view>
			<view class="content">
				<input type="text" placeholder="请输入任务名" />
			</view>

			<view class="titleName">
				所属目标
			</view>
			<view class="content">
				<uni-data-select v-model="selectedTarget" :localdata="targets" :clear=false
					@change="handleTargetChange(selectedTarget)"></uni-data-select>
			</view>

			<view class="titleName">
				任务类型
			</view>
			<view class="content">
				<uni-data-select v-model="selectedTaskType" :localdata="taskTypes" :clear=false
					@change="handleTaskChange(selectedTaskType)"></uni-data-select>
			</view>

			<view class="titleName">
				任务目标
			</view>
			<view class="content">
				<input type="number" placeholder="请输入目标数量" />
			</view>

		</view>
		<view class="popFooter">
			<view class="btn" @click="closeTaskPopup">取消</view>
			<view class="btn" @click="submitTask">提交</view>
		</view>
	</popup>

</template>

<script setup>
	import {
		computed,
		ref
	} from 'vue';

	const popTask = ref(null);
	const addTask = () => {
		// 弹框中间
		popTask.value.show = true
	}
	const closeTaskPopup = function() {
		popTask.value.show = false;
		console.log("close");
	}
	const submitTask = function() {
		popTask.value.show = false;
	}
	const selectedTarget = ref("1");
	const targets = ref([
		{
			text: "目标1",
			value: "1"
		},
		{
			text: "目标2",
			value: "2"
		},
		{
			text: "目标3",
			value: "3"
		},
		{
			text: "目标4",
			value: "4"
		}
	]);
	const selectedTaskType = ref("number");
	const taskTypes = ref([
		{
			text: "数量",
			value: "number"
		},
		{
			text: "时间",
			value: "time"
		}
	]);

	const username = uni.getStorageSync("username") ? uni.getStorageSync("username") : "无名";
	const title = computed(() => {
		let now = new Date(); // 获取当前时间
		let hour = now.getHours(); // 获取当前小时数（0-23）
		let gretting = "该睡了，";
		if (hour >= 5 && hour < 12) {
			gretting = "早上好，"
		} else if (hour >= 12 && hour < 14) {
			gretting = "中午好，"
		} else if (hour >= 14 && hour < 18) {
			gretting = "下午好，"
		} else if (hour >= 18 && hour < 22) {
			gretting = "晚上好，"
		}
		return gretting + username;
	})

	const name = ref("")
	const origin = ref("")
	const sentence = ref("")
	uni.request({
		url: "https://api.xygeng.cn/one",
	}).then(res => {
		if (res.data.code === 200) {
			name.value = res.data.data.name
			origin.value = res.data.data.origin
			sentence.value = res.data.data.content
		}
	})
	
	const startTask = () => {
		uni.navigateTo({
			url:"/pages/task/task"
		})
	}
	
	
</script>

<style lang="scss" scoped>
	
	.popTitle {
		height: 15%;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #cd87ff;
		font-size: 40rpx;
	}
	
	.popTaskContent {
		height: 70%;
		background: #faf7fa;
		display: grid;
		grid-template-columns: auto auto auto auto auto auto;
		grid-template-rows: 25% 25% 25% 25%;
		place-items: center;
	
		.titleName {
			grid-column-start: 1;
			grid-column-end: 3;
			color: #cd87ff;
		}
	
		.content {
			grid-column-start: 3;
			grid-column-end: 7;
			height: 60rpx;
			border-radius: 50rpx;
			
			display: flex;
			align-items: center;
			justify-content: center;
	
			input {
				width: 260rpx;
			}
	
			.uni-select {
				width: 260rpx;
			}
		}
	
	}

	.popFooter {
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
		// background: #aaa;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;

		.top {
			width: 650rpx;
			height: 20vh;
			// background: pink;
			display: flex;
			/* 父元素使用 flex 布局 */
			flex-direction: column;
			/* 子元素垂直排列 */
			justify-content: flex-end;

			/* 子元素对齐到父元素的底部 */
			.text {
				margin-bottom: 10rpx;

				.title {
					font-size: 42rpx;
					letter-spacing: 0.1em;
				}

				.taskOngoing {
					font-size: 24rpx;
					letter-spacing: 0.1em;
					margin-top: 10rpx;
				}
			}
		}

		.middle {
			width: 680rpx;
			height: 20vh;
			margin-top: 10rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			flex-direction: column;

			.maxim {
				width: 650rpx;
				height: 300rpx;
				background: linear-gradient(to right, #a56aff, #dc94ff);
				box-shadow: 2px 2px 5px rgba(128, 128, 128, 0.5);
				border-radius: 50rpx;
				position: relative;

				.sentence {
					position: absolute;
					width: 430rpx;
					height: 180rpx;
					margin-top: 30rpx;
					margin-left: 30rpx;
					font-size: 32rpx;
					color: #eee;
					letter-spacing: 0.15em;
					// 显示不全的变成隐藏 后面应该限制字数
					overflow: hidden;
				}

				.author {
					position: absolute;
					width: 450rpx;
					height: 50rpx;
					margin-top: 210rpx;
					margin-left: 35rpx;
					font-size: 25rpx;
					color: #eee;
					letter-spacing: 0.15em;
					/* 设置字间距为字体大小的15% */
				}

				.date {
					position: absolute;
					width: 120rpx;
					height: 120rpx;
					border: 5rpx solid #fff;
					margin-top: 40rpx;
					margin-left: 490rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					flex-direction: column;

					.day {
						font-size: 55rpx;
						color: #fff;
					}

					.month {
						font-size: 28rpx;
						color: #fff;
					}
				}
			}
		}
		
		.notice {
			width: 630rpx;
			height: 6vh;
			display: flex;
			margin-top: 10rpx;
			.left {
				width: 80rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				image {
					width: 50rpx;
					height: 50rpx;
				}
			}
			.center{
				width: 480rpx;
				// flex:1;
				display: flex;
				align-items: center;
				justify-content: center;
				swiper{
					display: flex;
					align-items: center;
					justify-content: center;
					swiper-item{
						// 显示不全的变成...
						overflow: hidden;
						white-space: nowrap;
						text-overflow: ellipsis;
						font-size: 30rpx;
						margin-top: 7rpx;
					}
					width: 500rpx;
					height: 50rpx;
				}
			}
			
		}

		.content {
			width: 680rpx;
			height: 60vh;
			margin-top: 10rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			flex-direction: column;

			.review {
				width: 100%;
				height: 5%;
				
				margin-left: 30rpx;
				margin-top: 10rpx;
				font-size: 38rpx;
				letter-spacing: 0.15em;
			}

			.region {
				width: 100%;
				height: 95%;
				margin-top: 50rpx;
				position: relative;

				.total {
					width: 370rpx;
					height: 330rpx;
					background: #fff;
					border-radius: 50rpx;
					position: absolute;
					box-shadow: 2px 2px 5px rgba(128, 128, 128, 0.5);
					display: flex;
					align-items: center;
					justify-content: center;
					flex-direction: column;
					.icon{
						width: 110rpx;
						height: 110rpx;
						background: #faf7fa;
						border-radius: 30rpx;
						display: flex;
						align-items: center;
						justify-content: center;
						image{
							width: 66rpx;
							height: 66rpx;
						}
					}
					.text{
						margin-top: 10rpx;
						color: #cd87ff;
						font-size: 25rpx;
						.step{
							font-size: 50rpx;
						}
					}
					
				}

				.yesterday {
					width: 280rpx;
					height: 365rpx;
					background: #fff;
					border-radius: 50rpx;
					position: absolute;
					margin-left: 400rpx;
					box-shadow: 2px 2px 5px rgba(128, 128, 128, 0.5);
					display: flex;
					align-items: center;
					justify-content: center;
					flex-direction: column;
					.icon{
						width: 110rpx;
						height: 110rpx;
						background: #faf7fa;
						border-radius: 30rpx;
						display: flex;
						align-items: center;
						justify-content: center;
						image{
							width: 66rpx;
							height: 66rpx;
						}
					}
					.text{
						margin-top: 10rpx;
						color: #cd87ff;
						font-size: 25rpx;
						.step{
							font-size: 50rpx;
						}
					}
				}

				.target {
					width: 370rpx;
					height: 250rpx;
					background: #fff;
					border-radius: 50rpx;
					position: absolute;
					margin-top: 370rpx;
					box-shadow: 2px 2px 5px rgba(128, 128, 128, 0.5);
					display: flex;
					align-items: center;
					justify-content: center;
					flex-direction: column;
					.icon{
						width: 110rpx;
						height: 110rpx;
						background: #faf7fa;
						border-radius: 30rpx;
						display: flex;
						align-items: center;
						justify-content: center;
						image{
							width: 66rpx;
							height: 66rpx;
						}
					}
					.text{
						margin-top: 10rpx;
						color: #cd87ff;
						font-size: 30rpx;
					}
				}

				.task {
					width: 280rpx;
					height: 220rpx;
					background: #fff;
					border-radius: 50rpx;
					margin-left: 400rpx;
					margin-top: 400rpx;
					box-shadow: 2px 2px 5px rgba(128, 128, 128, 0.5);
					display: flex;
					align-items: center;
					justify-content: center;
					flex-direction: column;
					.icon{
						width: 110rpx;
						height: 110rpx;
						background: #faf7fa;
						border-radius: 30rpx;
						display: flex;
						align-items: center;
						justify-content: center;
						image{
							width: 66rpx;
							height: 66rpx;
						}
					}
					.text{
						margin-top: 10rpx;
						color: #cd87ff;
						font-size: 30rpx;
					}
				}

			}

		}
	}
</style>