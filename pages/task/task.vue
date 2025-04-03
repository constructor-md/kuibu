<template>
	<view class="layout">
		<view class="header">
			<text class="title">行则必至</text>
			<uni-data-select class="target-select" v-model="selectedTargetId" :localdata="targets" :clear=false
				@change="handleTargetChange(selectedTargetId)"></uni-data-select>
			<uni-data-select class="task-select" v-model="selectedTaskId" :localdata="tasks" :clear=false
				@change="handleTaskChange(selectedTaskId)"></uni-data-select>
		</view>
		<view class="content">
			<template v-if="currentTask.type === 2">
				<view class="title">
					计数类任务
				</view>
				<view class="plusNumber" @click="plus(8)">
					+ 8
				</view>
				<view class="plusNumber" @click="plus(12)">
					+ 12
				</view>
				<view class="plusNumber" @click="plus(20)">
					+ 20
				</view>
				<view class="plusNumber" @click="plus(50)">
					+ 50
				</view>
				<view class="plusNumberBar" :class="{active: isActive}">
					<input type="number" placeholder="请输入数量" v-model="inputValue" maxlength=5 />
					<view 
						@click="plus(inputValue)" 
						class="plusBtn"
						@mousedown="handleMouseDown"
						@mouseup="handleMouseUp"
						> + </view>
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
	import {
		apiGetTargetList,
		apiGetTaskList,
		apiAddKuibuInfo,
	} from "@/api/api.js"
	const init = ref(true)
	const running = ref(false)
	const startTime = ref(0); // 开始时间
	const elapsedTime = ref(0); // 经过的时间（毫秒）
	const intervalId = ref(null); // 定时器ID
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
			success: async (res) => {
				if(res.confirm) {
					init.value = true;
					await apiAddKuibuInfo({
						taskId: currentTask.value.id,
						type: currentTask.value.type,
						count: elapsedTime.value
					})
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
	const time = ref("")
	const completeTimeSelect = (diyTime) => {
		time.value = diyTime
		let [hours, minutes, seconds] = time.value.split(":").map(Number);
		elapsedTime.value = (hours * 3600 + minutes * 60 + seconds) * 1000;
		init.value = false;
		running.value = false;
	}
	// 下拉框选中值
	const selectedTargetId = ref("xxx");
	const selectedTaskId = ref("xxx");
	const currentTask = ref({})
	
	onShow(async () => {
		// 初始化下拉框
		await refreshTargetList();
		await refreshTaskList()
	})
	
	const refreshTargetList = async () => {
		let result = await apiGetTargetList()
		targets.value = result.data.map(target => ({
			text: target.name,
			value: target.id
		}))
		selectedTargetId.value = targets.value[0].value
	}
	
	const refreshTaskList = async () => {
		let result = await apiGetTaskList(selectedTargetId.value)
		tasks.value = result.data.map(task => ({
			text: task.name,
			value: task.id
		}))
		// 查询后选中值默认为第一项
		selectedTaskId.value = tasks.value[0].value
		taskData.value = result.data
		setCurrentTask()
	}
	
	const taskData = ref([])
	const setCurrentTask = () => {
		currentTask.value = taskData.value
									.find(task => task.id === selectedTaskId.value)
	}
	
	// 下拉框选项
	const targets = ref([]);
	const tasks = ref([]);
	// 选中目标
	const handleTargetChange = async (value) => {
		await refreshTaskList()
	};
	const handleTaskChange = (value) => {
		setCurrentTask()
	};
	const inputValue = ref()
	const plus = async (num) => {
		if(num > 0) {
			await apiAddKuibuInfo({
				taskId: currentTask.value.id,
				type: currentTask.value.type,
				count: num
			})
		}
	}
	
	const isActive = ref(false)
	const isMouseDown = ref(false)
	const handleMouseDown = () => {
	  isActive.value = true;
	  const mouseUpHandler = () => {
	    isActive.value = false;
	    document.removeEventListener('mouseup', mouseUpHandler);
	  };
	  document.addEventListener('mouseup', mouseUpHandler);
	};
	
	const handleMouseUp = () => {
	  isActive.value = false;
	};
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
				transition: transform 0.3s ease, background-color 0.3s ease;
			}
			
			.plusNumber:active {
			  transform: scale(0.95);
			}
			
			.plusNumberBar {
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
				transition: transform 0.3s ease, background-color 0.3s ease;
				input {
					text-align: center;
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
			
			.plusNumberBar.active {
				// 缩放 95%
			  transform: scale(0.95);
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