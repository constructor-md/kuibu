<template>
	<view class="layout">
		<view class="header">
			<text class="title">行则必至</text>
			<uni-data-select class="data-select" v-model="selectedTargetId" :localdata="options" :clear=false
				@change="handleChange(selectedTargetId)"></uni-data-select>
		</view>
		<view class="scroll">
			<scroll-view scroll-x="true" scroll-with-animation class="scroll-tab">
				<template v-for="(item,index) in tabBars" :key="index">
					<view class="scroll-tab-item" :class="{'active': tabIndex==index}" @tap="toggleTab(index)">
						<view class="scroll-tab-line"></view>
						{{item.name}}
					</view>
				</template>
			</scroll-view>
		</view>
		<view class="columnChart">
			<qiun-data-charts class="chart" type="column" :opts="columnOpts" :chartData="columnChartData" />
		</view>
		<view class="barChart">
			<qiun-data-charts class="chart" type="bar" :opts="barOpts" :chartData="barChartData" />
		</view>
		<view class="suggestionAI">
			<view class="title">
				<view class="text">
					AI建议
				</view>
				<view class="loadingNotice" v-if="loading">
					生成中，请耐心等待...
				</view>
				<image src="../../static/images/refresh.png" :class="{'active': loading}" class="refresh"
					@click="reloadAI"></image>
			</view>
			<scroll-view scroll-y="true" class="scroll-Y" ref="textContainer">
				<text>{{streamText}}</text>
			</scroll-view>
		</view>
	</view>
	<view class="float">
		<view class="item" @click="openTask()">
			<image src="/static/images/plus.png" mode=""></image>
		</view>
	</view>
</template>

<script setup>
	import {
		ref,
		watchEffect
	} from "vue"
	import {
		apiGetTargetList,
		apiGetTaskList,
		apiGetVerticalBarChart,
		apiGetHorizotalBarchart,
		apiGetAiSuggestion,
		apiGetAiSuggestionRefresh
	} from "@/api/api.js"

	const openTask = () => {
		uni.navigateTo({
			url: "/pages/task/task"
		})
	}

	const loading = ref(false)
	const reloadAI = async () => {
		if(loading.value) {
			// 上次未结束，不可重复请求
			return;
		}
		loading.value = true
		try {
			await startStreaming();
		} catch (error) {
			console.error('AI 建议请求出错:', error);
		}
		loading.value = false
	}
	const {
		streamText,
		textContainer,
		startStreaming
	} = apiGetAiSuggestionRefresh();
	
	const getAiSuggestion = async () => {
		let result = await apiGetAiSuggestion()
		streamText.value = result.data
	}

	// 初始化下拉框
	const refreshTargetList = async () => {
		let result = await apiGetTargetList()
		// 1. 如果没有目标，展示什么  
		// 无下拉，不请求Bar、图表
		// 目标图表展示未指定目标，全空数据
		// 任务图表展示未指定任务，最近一周任务全为0
		// 2. 如果没有任务 展示什么
		// 目标图表展示指定目标
		// 任务图表未指定任务，最近一周任务全为0
		if (result.data.length === 0) {
			options.value = []
			// 无目标 标志为selectedTargetId.value = ''
			selectedTargetId.value = '';
		} else {
			options.value = result.data.map(target => ({
				text: target.name,
				value: target.id
			}))
			selectedTargetId.value = options.value[0].value
		}

	}

	// 下拉框选中值
	const selectedTargetId = ref(''); // 初始值为空
	const currentTarget = ref({})
	// 下拉框选项
	const options = ref([]);
	// 选中目标
	const handleChange = async (value) => {
		// 刷新任务
		await refreshTaskList()
		// 刷新任务柱状图
		await getColumnChartData()
		// 刷新任务条形图
		await getBarChartData()
	};


	// 刷新tabBar
	const refreshTaskList = async () => {
		let result = []
		// 无目标直接不请求
		if (selectedTargetId.value !== '') {
			let res = await apiGetTaskList(selectedTargetId.value)
			result = res.data
		}

		if (result.length === 0) {
			tabBars.value = []
			// 无任务 标志为 currentTask.value = {}
			taskData.value = []
			currentTask.value = {}
		} else {
			tabBars.value = result.map(task => ({
				name: task.name,
				id: task.id
			}))
			taskData.value = result
			setCurrentTask()
		}

	}

	const currentTask = ref({})
	const taskData = ref([])
	const setCurrentTask = () => {
		currentTask.value = taskData.value[tabIndex.value]
	}

	// 横向滚动标签选中项目 默认为第一项
	const tabIndex = ref(0)
	// 点击标签切换选中项
	const toggleTab = async (index) => {
		tabIndex.value = index;
		setCurrentTask()
		await getColumnChartData()
	}
	// 横向滚动标签内容
	const tabBars = ref([])

	// 柱状图数据
	const columnChartData = ref({})
	const getLastSevenDays = () => {
		const dates = [];
		const today = new Date();

		for (let i = 0; i < 7; i++) {
			const currentDate = new Date(today);
			currentDate.setDate(today.getDate() - i);

			const month = String(currentDate.getMonth() + 1).padStart(2, '0');
			const day = String(currentDate.getDate()).padStart(2, '0');

			dates.push(`${month}-${day}`);
		}

		return dates;
	}
	const getColumnChartData = async () => {
		if (!currentTask.value.id) {
			// 未指定任务 生成近七天为0数据
			let dates = getLastSevenDays()
			let res = {
				categories: dates,
				series: [{
					name: "未指定任务",
					data: [0, 0, 0, 0, 0, 0, 0]
				}]
			};
			columnChartData.value = res;
		} else {
			let result = await apiGetVerticalBarChart(currentTask.value.id)
			let res = {
				categories: result.data.items,
				series: [{
					name: currentTask.value.type === 1 ? currentTask.value.name + " 的完成秒数" :
						currentTask.value.name + " 的完成次数",
					data: result.data.values
				}]
			};
			columnChartData.value = res;
		}

	}


	const columnOpts = ref({
		color: ["#dc94ff"],
		padding: [15, 15, 0, 5],
		enableScroll: false,
		legend: {},
		xAxis: {
			disableGrid: true
		},
		yAxis: {
			data: [{
				min: 0
			}]
		},
		extra: {
			column: {
				type: "group",
				width: 30,
				activeBgColor: "#000000",
				activeBgOpacity: 0.08,
				linearOpacity: 0.8,
				linearType: "custom",
				customColor: ["#a56aff"],
				colorStop: 0.2,
			}
		}
	})

	// 条形图
	const barChartData = ref({})
	const getBarChartData = async () => {
		// 无目标直接不请求
		if (selectedTargetId.value !== '') {
			let result = await apiGetHorizotalBarchart(selectedTargetId.value);
			let currentTarget = options.value.filter(option => option.value === selectedTargetId.value)
			let res = {
				categories: result.data.items,
				series: [{
					name: currentTarget[0].text + ' 的整体进度',
					data: result.data.values
				}]
			};
			barChartData.value = res;
		} else {
			let res = {
				categories: [],
				series: [{
					name: '未指定目标',
					data: []
				}]
			};
			barChartData.value = res;
		}

	}

	const barOpts = ref({
		color: ["#a56aff"],
		padding: [15, 30, 0, 5],
		enableScroll: false,
		legend: {},
		xAxis: {
			boundaryGap: "justify",
			disableGrid: false,
			min: 0,
			axisLine: false,
			max: 100
		},
		yAxis: {},
		extra: {
			bar: {
				type: "group",
				width: 30,
				barBorderCircle: true,
				categoryGap: 2,
				linearType: "custom",
				customColor: ["#dc94ff"],
				colorStop: 0.2,
			}
		}
	})

	onShow(async () => {
		await refreshTargetList()
		await refreshTaskList()
		await getColumnChartData()
		await getBarChartData()
		await getAiSuggestion()
	})
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

			.data-select {
				width: 40%;
				position: absolute;
				margin-top: 15rpx;
				margin-left: 240rpx;

				.uni-select {
					border-radius: 50rpx;
				}

			}

		}

		.scroll {
			width: 95%;
			height: 80rpx;
			background: linear-gradient(to right, #a56aff, #dc94ff);
			display: flex;
			justify-content: center;
			border-radius: 20rpx;

			.scroll-tab {
				white-space: nowrap;
				text-align: center;
				color: #eee;

				.scroll-tab-item {
					display: inline-block;
					margin: 20rpx 30rpx 0 30rpx;
					width: 150rpx;
					overflow: hidden;
					/* 隐藏超出容器的内容 */
					white-space: nowrap;
					/* 防止文本换行 */
					text-overflow: ellipsis;
					/* 设置溢出内容显示为省略号 */
				}

				.active .scroll-tab-line {
					border-bottom: 5rpx solid #ccc;
					width: 150rpx;
				}
			}
		}

		.columnChart {
			width: 95%;
			height: 500rpx;
			margin-top: 15rpx;
			border-radius: 20rpx;
			box-shadow: 2px 2px 5px rgba(128, 128, 128, 0.5);
			display: flex;
			justify-content: center;
			align-items: center;

			.chart {
				width: 90%; // 修改为百分比，让图表自适应父元素宽度
				height: 100%; // 修改为百分比，让图表自适应父元素高度
			}
		}

		.barChart {
			width: 95%;
			min-height: 500rpx;
			margin-top: 15rpx;
			border-radius: 20rpx;
			box-shadow: 2px 2px 5px rgba(128, 128, 128, 0.5);
			display: flex;
			justify-content: center;
			align-items: center;

			.chart {
				width: 90%; // 修改为百分比，让图表自适应父元素宽度
				height: 100%; // 修改为百分比，让图表自适应父元素高度
			}
		}

		.suggestionAI {
			width: 95%;
			height: 600rpx;
			margin-top: 15rpx;
			margin-bottom: 80rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			flex-direction: column;
			box-shadow: 2px 2px 5px rgba(128, 128, 128, 0.5);
			border-radius: 20rpx;

			.scroll-Y {
				width: 95%;
				height: 80%;

				text {
					width: 100%;
					height: 100%;
					word-wrap: break-word; // 自动换行
				}
			}

			.title {
				display: flex;
				align-items: center;
				justify-content: space-between;
				width: 90%;
				height: 10%;

				.text {
					width: 100rpx;
					height: 50rpx;
					font-size: 32rpx;
				}

				.loadingNotice {
					width: 480rpx;
					height: 50rpx;
					font-size: 22rpx;

					display: flex;
					align-items: center;
					color: #b9b9b9;
				}

				.refresh {
					width: 50rpx;
					height: 50rpx;
					z-index: 1;
				}

				.active {
					animation: rotate 1s linear infinite;
				}

				@keyframes rotate {
					0% {
						transform: rotateZ(0deg);
						/*从0度开始*/
					}

					100% {
						transform: rotateZ(360deg);
						/*360度结束*/
					}
				}
			}


		}

	}

	.float {
		position: fixed;
		right: 30rpx;
		bottom: 80rpx;
		// css 底部安全区高度环境变量 每个设备不同 避免被设备下方栏位遮住
		padding-bottom: env(safe-area-inset-bottom);

		.item {
			width: 90rpx;
			height: 90rpx;
			background: linear-gradient(to right, #a56aff, #dc94ff);
			color: #eee;
			border-radius: 50%;
			margin-bottom: 20rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			border: 1px solid #eee;

			image {
				width: 60rpx;
				height: 60rpx;
			}
		}
	}
</style>