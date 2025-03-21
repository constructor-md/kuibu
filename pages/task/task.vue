<template>
	<view class="layout">
		<view class="header">
			<text class="title">行则必至</text>
			<uni-data-select class="target-select" v-model="selectedTarget" :localdata="targets" :clear=false
				@change="handleTargetChange(selectedTarget)"></uni-data-select>
			<uni-data-select class="task-select" v-model="selectedTask" :localdata="tasks" :clear=false
				@change="handleTaskChange(selectedTask)"></uni-data-select>
		</view>
		<view class="content">
			<template v-if="currentTask.type === 'number'">
				<view class="title">
					计数类任务
				</view>
				<view class="plusNumber" @click="plus(8)">
					+ 8
				</view>
				<view class="plusNumber"@click="plus(12)">
					+ 12
				</view>
				<view class="plusNumber" @click="plus(20)">
					+ 20
				</view>
				<view class="plusNumber" @click="plus(50)">
					+ 50
				</view>
				<view class="plusNumber">
					<input type="number" placeholder="请输入数量" v-model="inputValue" maxlength=5 />
					<view @click="plus(inputValue)" class="plusBtn"> + </view>
				</view>
			</template>
			<template v-else>
				<view class="title">
					计时类任务
				</view>
				<view class="time">
					<view class="stopwatch">
						{{ formattedTime }}
					</view>
					<view class="operator" >
						<view class="operatorIn" @click="start" v-if="init">
							<image src="/static/images/time/start.png" class="timeIcon"></image>
							开始
						</view>
						<view class="operatorIn" @click="pause" v-else-if="running">
							<image src="/static/images/time/pause.png" class="timeIcon"></image>
							暂停
						</view>
						<template v-else>
							<view class="operatorIn" @click="reset">
								<image src="/static/images/time/complete.png" class="timeIcon"></image>
								结束
							</view>
							<view class="operatorIn" @click="resume">
								<image src="/static/images/time/start.png" class="timeIcon"></image>
								继续
							</view>
						</template>
					</view>

					<view class="operator" @click="openTimePicker">
						自定义
					</view>
				</view>
			</template>
		</view>
	</view>
	<uniHms ref="timePicker" :hmsval="time" @complete="completeTimeSelect" />
</template>

<script setup>
import { ref } from 'vue';

	const init = ref(true)
	const running = ref(false)
	const startTime = ref(0); // 开始时间
	const elapsedTime = ref(0); // 经过的时间（毫秒）
	const intervalId = ref(null); // 定时器ID
	console.log(555 / 2);
	// 格式化时间
	const formattedTime = computed(() => {
		const totalSeconds = Math.floor(elapsedTime.value / 1000);
		const milliseconds = Math.floor((elapsedTime.value % 1000) / 10);
		const hours = Math.floor(totalSeconds / 3600);
		const minutes = Math.floor((totalSeconds % 3600) / 60);
		const seconds = totalSeconds % 60;

		return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}.${pad(milliseconds, 2)}`;
	});

	// 补零函数
	function pad(value, length = 2) {
		return value.toString().padStart(length, '0');
	}

	// 开始计时
	function start() {
		init.value = false;
		running.value = true;
		startTime.value = Date.now() - elapsedTime.value; // 修正开始时间
		intervalId.value = setInterval(() => {
			elapsedTime.value = Date.now() - startTime.value;
		}, 10); // 更新频率为10ms
	}

	// 暂停计时
	function pause() {
		clearInterval(intervalId.value);
		running.value = false;
	}

	// 继续计时
	function resume() {
		running.value = true;
		startTime.value = Date.now() - elapsedTime.value;
		intervalId.value = setInterval(() => {
			elapsedTime.value = Date.now() - startTime.value;
		}, 10); // 更新频率为10ms
	}

	// 重置计时器
	function reset() {
		uni.showModal({
			title:"是否提交？",
			success: (res) => {
				if(res.confirm) {
					clearInterval(intervalId.value);
					init.value = true;
					elapsedTime.value = 0;
					uni.showToast({
						title:"数据已提交",
						icon:"success"
					})
				}
			}
		})
	}

	// 清理定时器
	onUnmounted(() => {
		clearInterval(intervalId.value);
	});


	const timePicker = ref(null)
	const openTimePicker = () => {
		timePicker.value.show()
	}
	const time = ref("21:20:00")
	const completeTimeSelect = (diyTime) => {
		console.log("diyTime", diyTime);
		console.log("time", time.value);
	}
	// 下拉框选中值
	const selectedTarget = ref("1");
	const selectedTask = ref("1");
	const currentTask = ref({
		id: 1,
		name: "任务1",
		type: "number"
	})
	console.log("currentTask.value.type", currentTask.value.type);
	// 下拉框选项
	const targets = ref([{
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
	const tasks = ref([{
			text: "任务1",
			value: "1"
		},
		{
			text: "任务2",
			value: "2"
		},
		{
			text: "任务3",
			value: "3"
		},
		{
			text: "任务4",
			value: "4"
		}
	]);
	// 处理选中事件
	const handleTargetChange = (value) => {
		console.log("target选中的值：", value);
	};
	const handleTaskChange = (value) => {
		console.log("task选中的值：", value);
	};
	
	const inputValue = ref(0)
	const plus = (num) => {
		console.log("plus", num);
	}
</script>

<style lang="scss">
	.layout {
		width: 100vw;
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;

		.header {
			width: 100%;
			height: 90rpx;
			margin-top: 100rpx;
			position: relative;
			// background: pink;

			.title {
				font-size: 34rpx;
				position: absolute;
				margin-top: 20rpx;
				margin-left: 40rpx;
			}

			.target-select {
				width: 30%;
				position: absolute;
				margin-top: 15rpx;
				margin-left: 220rpx;

				.uni-select {
					border-radius: 50rpx;
				}

			}

			.task-select {
				width: 30%;
				position: absolute;
				margin-top: 15rpx;
				margin-left: 480rpx;

				.uni-select {
					border-radius: 50rpx;
				}

			}
		}

		.content {
			width: 95%;
			height: 80vh;
			display: flex;
			align-items: center;
			justify-content: center;
			flex-direction: column;
			border-radius: 20rpx;
			box-shadow: 2px 2px 5px rgba(128, 128, 128, 0.5);
			margin-top: 20rpx;

			.title {
				color: #cd87ff;
				font-size: 50rpx;
				letter-spacing: 0.3rem;
				margin-bottom: 50rpx;
			}

			.plusNumber {
				height: 100rpx;
				width: 600rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				background: linear-gradient(to right, #a56aff, #dc94ff);
				border-radius: 50rpx;
				margin-top: 50rpx;
				color: #eee;
				font-size: 32rpx;
				box-shadow: 2px 2px 5px rgba(128, 128, 128, 0.5);
				
				input {
					margin-left: 100rpx;
					width: 300rpx;
				}
				.plusBtn{
					height: 80rpx;
					width: 100rpx;
					display: flex;
					align-items: center;
					justify-content: center;
				}
			}

			.time {

				display: flex;
				align-items: center;
				justify-content: center;
				flex-direction: column;

				.stopwatch {
					height: 100rpx;
					width: 600rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					font-size: 100rpx;
					color: #cd87ff;
					margin-top: 50rpx;
					margin-bottom: 50rpx;
				}

				.operator {
					height: 100rpx;
					width: 600rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					gap: 70rpx;
					margin-top: 50rpx;
					color: #cd87ff;

					.operatorIn {
						height: 100rpx;
						width: 150rpx;
						display: flex;
						align-items: center;
						justify-content: center;
						border-radius: 30rpx;
						box-shadow: 2px 2px 5px rgba(128, 128, 128, 0.5);
						
					}

					.timeIcon {
						height: 50rpx;
						width: 50rpx;
						margin-right: 10rpx;
					}
				}
			}
		}
	}
</style>