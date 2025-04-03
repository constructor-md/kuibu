<template>
	<view class="layout">
		<view class="top">
			<view class="text">
				<view class="title"> {{ title }} </view>
				<view class="taskOngoing">{{ongoingTaskCount}} 个任务进行中 ... </view>
			</view>
		</view>
		<view class="middle">
			<view class="maxim">
				<view class="sentence"> {{ sentence }} </view>
				<view class="author"> {{ name }}：{{ origin }} </view>
				<view class="date">
					<text class="day">{{dayOfMonth}}</text>
					<text class="month">{{month}}</text>
				</view>
			</view>
		</view>
		<view class="notice">
			<view class="left">
				<image src="../../static/images/good.png" mode=""></image>
			</view>
			<view class="center">
				<swiper scroll-y="true" autoplay vertical circular>
					<swiper-item v-for="item in noticeList">
						{{item}}
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
						<text class="step">{{completedTaskCount}}</text>
						步矣
					</view>
				</view>
				<view class="yesterday">
					<view class="icon">
						<image src="../../static/images/tag.png" mode=""></image>
					</view>
					<view class="text">
						<text class="step">{{ongoingGoalCount}}</text>
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
				<input v-model="inputTaskName" type="text" placeholder="请输入任务名" />
			</view>

			<view class="titleName">
				所属目标
			</view>
			<view class="content">
				<uni-data-select 
					class="select" 
					v-model="selectedTarget" 
					:localdata="targets" 
					:clear=false
					emptyTips="请创建目标"
					></uni-data-select>
			</view>

			<view class="titleName">
				任务类型
			</view>
			<view class="content">
				<uni-data-select 
					class="select" 
					v-model="selectedTaskType" 
					:localdata="taskTypes" 
					:clear="false"
					></uni-data-select>
			</view>

			<view class="titleName">
				任务目标
			</view>
			<view class="content">
				<input v-model="inputTaskCount" type="number" placeholder="请输入目标数量" />
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
		refreshUserinfo
	} from "@/api/common.js"
	import {
		apiGetOngoingTaskCount,
		apiGetCompletedTaskCount,
		apiGetOngoingGoalCount,
		apiGetTargetList,
		apiAddTask,
		apiGetDailyWords,
		apiGetNotice
	} from "@/api/api.js"


	const username = ref(uni.getStorageSync("username"))
	const refreshUserInfo = async () => {
		await refreshUserinfo()
		username.value = uni.getStorageSync("username")
	}
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
		return gretting + username.value;
	})

	const now = ref(new Date());
	const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", 
	                          "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
	const month = monthNames[now.value.getMonth()]
	const dayOfMonth = now.value.getDate()

	const startTask = () => {
		uni.navigateTo({
			url: "/pages/task/task"
		})
	}


	const ongoingTaskCount = ref(0);
	const completedTaskCount = ref(0);
	const ongoingGoalCount = ref(0);
	const refreshAnalysisCount = async () => {
		let result;
		result = await apiGetOngoingTaskCount()
		ongoingTaskCount.value = result.data
		result = await apiGetCompletedTaskCount()
		completedTaskCount.value = result.data
		result = await apiGetOngoingGoalCount()
		ongoingGoalCount.value = result.data
	}
	onShow(() => {
		refreshUserInfo()
		refreshAnalysisCount()
		refreshDailySentence()
		getSentences()
	})
	
	
	const name = ref("")
	const origin = ref("")
	const sentence = ref("")
	const refreshDailySentence = async () => {
		let result = await apiGetDailyWords()
		name.value = result.data.author
		origin.value = result.data.source
		sentence.value = result.data.sentence
	}

	const popTask = ref(null);
	const addTask = () => {
		// 弹框中间
		popTask.value.show = true
		refreshTargetList()
	}
	const inputTaskName  = ref("")
	const inputTaskCount = ref(0)
	const closeTaskPopup = function() {
		popTask.value.show = false;
		// 清除数据
		inputTaskName.value = ""
		inputTaskCount.value = 0
	}
	const submitTask = async function() {
		if(inputTaskName.value.trim().length === 0) {
			uni.showToast({
				title:"任务名称不可没有内容",
				icon:"error"
			})
			return
		}
		if(inputTaskCount.value <= 0) {
			uni.showToast({
				title:"任务目标不可小于等于0",
				icon:"error"
			})
			return
		}
		const result = await apiAddTask({
			name: inputTaskName.value,
			type: selectedTaskType.value,
			goalId: selectedTarget.value,
			amount: inputTaskCount.value
		})
		
		popTask.value.show = false;
		// 清除数据
		inputTaskName.value = ""
		inputTaskCount.value = 0
	}
	const selectedTarget = ref(null);
	const targets = ref([]);
	const refreshTargetList = async () => {
		let result = await apiGetTargetList()
		targets.value = result.data.map(item => ({
			text: item.name,
			value: item.id,
		}))
	}
	
	const selectedTaskType = ref("2");
	const taskTypes = ref([{
			text: "数量",
			value: "2"
		},
		{
			text: "时间",
			value: "1"
		}
	]);
	
	
	const formatTimeAgo = (createTime) => {
	    const now = new Date();
	    const create = new Date(createTime);
	    const diff = now - create;
	    const seconds = Math.floor(diff / 1000);
	    const minutes = Math.floor(seconds / 60);
	    const hours = Math.floor(minutes / 60);
	    const days = Math.floor(hours / 24);
	
	    if (days > 0) {
	        return `${days}天前`;
	    } else if (hours > 0) {
	        return `${hours}小时前`;
	    } else if (minutes > 0) {
	        return `${minutes}分钟前`;
	    } else {
	        return `${seconds}秒前`;
	    }
	}
	
	const formatCount = (taskType, count) => {
	    if (taskType === 2) {
	        return `${count}次`;
	    } else if (taskType === 1) {
	        const totalSeconds = Math.floor(count / 1000);
	        const hours = Math.floor(totalSeconds / 3600);
	        const minutes = Math.floor((totalSeconds % 3600) / 60);
	        const seconds = totalSeconds % 60;
	
	        if (hours > 0) {
	            return `${hours}小时${minutes}分${seconds}秒`;
	        } else if (minutes > 0) {
	            return `${minutes}分${seconds}秒`;
	        } else {
	            return `${seconds}秒`;
	        }
	    }
	}
	
	const noticeList = ref([])
	const getSentences = async () => {
		let result = await apiGetNotice()
		
		noticeList.value = result.data.map(item => {
		    const timeAgo = formatTimeAgo(item.createTime);
		    const formattedCount = formatCount(item.taskType, item.count);
		    return `${item.taskName} ${timeAgo} 完成${formattedCount}`;
		});
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

			.select {
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

			.center {
				width: 500rpx;
				display: flex;
				align-items: center;
				justify-content: center;

				swiper {
					display: flex;
					align-items: center;
					justify-content: center;

					swiper-item {
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

					.icon {
						width: 110rpx;
						height: 110rpx;
						background: #faf7fa;
						border-radius: 30rpx;
						display: flex;
						align-items: center;
						justify-content: center;

						image {
							width: 66rpx;
							height: 66rpx;
						}
					}

					.text {
						margin-top: 10rpx;
						color: #cd87ff;
						font-size: 25rpx;

						.step {
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

					.icon {
						width: 110rpx;
						height: 110rpx;
						background: #faf7fa;
						border-radius: 30rpx;
						display: flex;
						align-items: center;
						justify-content: center;

						image {
							width: 66rpx;
							height: 66rpx;
						}
					}

					.text {
						margin-top: 10rpx;
						color: #cd87ff;
						font-size: 25rpx;

						.step {
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

					.icon {
						width: 110rpx;
						height: 110rpx;
						background: #faf7fa;
						border-radius: 30rpx;
						display: flex;
						align-items: center;
						justify-content: center;

						image {
							width: 66rpx;
							height: 66rpx;
						}
					}

					.text {
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

					.icon {
						width: 110rpx;
						height: 110rpx;
						background: #faf7fa;
						border-radius: 30rpx;
						display: flex;
						align-items: center;
						justify-content: center;

						image {
							width: 66rpx;
							height: 66rpx;
						}
					}

					.text {
						margin-top: 10rpx;
						color: #cd87ff;
						font-size: 30rpx;
					}
				}

			}

		}
	}
</style>