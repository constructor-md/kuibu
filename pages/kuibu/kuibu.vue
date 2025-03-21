<template>
	<view class="layout">
		<view class="header">
			<text class="title">行则必至</text>
			<uni-data-select class="data-select" v-model="selectedValue" :localdata="options" :clear=false
				@change="handleChange(selectedValue)"></uni-data-select>
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
		<view class="columnChart" >
			<canvas canvas-id="verticalChart" class="chart" />
			<view v-if="selectedBar" class="tooltip">
				值：{{ selectedBar.value }} {{ yAxisUnit }}
			</view>
		</view>
		<view class="barChart">
			<canvas canvas-id="horizontalChart" class="chart" />
		</view>
		<view class="suggestionAI" >
			<view class="title">
				<view class="text">
					AI建议
				</view>
				<image src="../../static/images/refresh.png" :class="{'active': loading}" class="refresh" @click="reloadAI"></image>
			</view>
			<scroll-view scroll-y="true" class="scroll-Y">
				<text>{{aiResultContent}}</text>
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
	
	const openTask = () => {
		uni.navigateTo({
			url:"/pages/task/task"
		})
	}
	
	const loading = ref(false)
	const reloadAI = () => {
		loading.value = !loading.value
		console.log("reload");
	}
	const aiResultContent = ref("# Markdown 测试文档QQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQ \n ## 1. 标题 \n# 一级标题 \n## 二级标题 \n### 三级标题 \n#### 四级标题 \n##### 五级标题 \n###### 六级标题 \n # Markdown 测试文档 \n ## 1. 标题 \n# 一级标题 \n## 二级标题 \n### 三级标题 \n#### 四级标题 \n##### 五级标题 \n###### 六级标题")

	// 下拉框选中值
	const selectedValue = ref("1"); // 初始值为空
	// 下拉框选项
	const options = ref([{
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
	const handleChange = (value) => {
		console.log("选中的值：", value);
	};
	// 横向滚动标签选中项目 默认为第一项
	const tabIndex = ref(0)
	// 点击标签切换选中项
	const toggleTab = (index) => {
		tabIndex.value = index;
		console.log("点击切换到：", index);
	}
	// 横向滚动标签内容
	const tabBars = ref([{
			name: '关注',
			id: 'guanzhu'
		},
		{
			name: '推荐',
			id: 'tuijian'
		},
		{
			name: '热点',
			id: 'redian'
		},
		{
			name: '体育',
			id: 'tiyu'
		},
		{
			name: '财经',
			id: 'caijing'
		},
		{
			name: '娱乐',
			id: 'yule'
		},
		{
			name: '娱乐',
			id: 'yule'
		},
		{
			name: '娱乐',
			id: 'yule'
		}
	])

	// Canvas 上下文
	let verticalCtx = null;
	let horizontalCtx = null;
	// 单位切换
	const yAxisUnit = ref('次数');
	const selectedBar = ref(null);
	// 图表尺寸
	const chartSize = ref({
		width: 300,
		height: 300,
		margin: {
			top: 30,
			right: 20,
			bottom: 40,
			left: 40
		}
	});
	// 纵向图表数据
	const verticalData = ref({
		dates: ['2023-01', '2023-02', '2023-03', '2023-04', '2023-01', '2023-02', '2023-03', '2023-04'],
		values: [15, 40, 25, 35, 15, 40, 25, 35],
		maxValue: 50,
		colors: ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#5470c6', '#91cc75', '#fac858', '#ee6666']
	});

	// 横向图表数据
	const horizontalData = ref({
		items: ['项目A', '项目B', '项目C', '项目D', '项目A', '项目B', '项目C', '项目D', '项目A', '项目B', '项目C', '项目D', '项目A', '项目B', '项目C', '项目D'],
		percentages: [45, 70, 80, 60, 45, 70, 80, 100],
		colors: ['#5470c6', '#91cc75', '#fac858', '#ee6666']
	});
	// 初始化 Canvas
	onMounted(() => {
		uni.getSystemInfo({
			success: (res) => {
				chartSize.value.width = res.windowWidth * 0.9;
				initCanvases();
			}
		});
	});

	const initCanvases = () => {
		verticalCtx = uni.createCanvasContext('verticalChart', this);
		horizontalCtx = uni.createCanvasContext('horizontalChart', this);
		drawVerticalChart();
		drawHorizontalChart();
	};

	// 绘制纵向柱状图
	const drawVerticalChart = () => {
		const {
			width,
			height,
			margin
		} = chartSize.value;
		const chartWidth = width - margin.left - margin.right;
		const chartHeight = height - margin.top - margin.bottom;

		// 清空画布
		verticalCtx.clearRect(0, 0, width, height);

		// 绘制坐标轴
		drawVerticalAxis(verticalCtx);



		// 绘制柱状图
		verticalData.value.values.forEach((value, index) => {
			const barWidth = chartWidth / verticalData.value.dates.length * 0.6;
			const x = margin.left + index * (chartWidth / verticalData.value.dates.length) + barWidth * 0.2;
			const y = margin.top + chartHeight - (value / verticalData.value.maxValue) * chartHeight;
			const barHeight = (value / verticalData.value.maxValue) * chartHeight;

			verticalCtx.setFillStyle(verticalData.value.colors[index % 2]);
			verticalCtx.fillRect(x, y, barWidth, barHeight);

			// 绘制数值标签
			verticalCtx.setFontSize(12);
			verticalCtx.setFillStyle('#333');
			verticalCtx.fillText(value.toString(), x + barWidth / 2 - 8, y - 5);
		});

		verticalCtx.draw();
	};

	// 绘制纵向坐标轴
	const drawVerticalAxis = (ctx) => {
		const {
			width,
			height,
			margin
		} = chartSize.value;

		// Y轴
		ctx.beginPath();
		ctx.moveTo(margin.left, margin.top);
		ctx.lineTo(margin.left, height - margin.bottom);

		// X轴
		ctx.moveTo(margin.left, height - margin.bottom);
		ctx.lineTo(width - margin.right, height - margin.bottom);

		ctx.setStrokeStyle('#666');
		ctx.stroke();

		// 绘制Y轴标签
		ctx.setFontSize(12);
		ctx.setFillStyle('#666');
		ctx.fillText(yAxisUnit.value, margin.left - 30, margin.top - 10);

		// 绘制X轴标签
		verticalData.value.dates.forEach((date, index) => {
			const x = margin.left + index * (width - margin.left - margin.right) / verticalData.value.dates
				.length +
				(width - margin.left - margin.right) / verticalData.value.dates.length / 2;
			ctx.fillText(date, x - 15, height - margin.bottom + 20);
		});
		
	};

	// 绘制横向柱状图
	const drawHorizontalChart = () => {
		const {
			width,
			height,
			margin
		} = chartSize.value;
		const chartHeight = height - margin.top - margin.bottom;
		const barHeight = chartHeight / horizontalData.value.items.length * 0.6;

		horizontalCtx.clearRect(0, 0, width, height);

		// 绘制坐标轴
		drawHorizontalAxis(horizontalCtx);

		horizontalData.value.percentages.forEach((percent, index) => {
			const barWidth = (percent / 100) * (width - margin.left - margin.right);
			const y = margin.top + index * (chartHeight / horizontalData.value.items.length) + barHeight * 0.2;

			horizontalCtx.setFillStyle(horizontalData.value.colors[index % 4]);
			horizontalCtx.fillRect(margin.left, y, barWidth, barHeight);

			// 绘制百分比标签
			horizontalCtx.setFontSize(12);
			horizontalCtx.setFillStyle('#333');
			horizontalCtx.fillText(`${percent}%`, margin.left + barWidth + 5, y + barHeight / 2 + 4);
			
		});

		horizontalCtx.draw();
	};

	// 绘制横向坐标轴
	const drawHorizontalAxis = (ctx) => {
		const {
			width,
			height,
			margin
		} = chartSize.value;

		// Y轴（项目名称）
		ctx.beginPath();
		ctx.moveTo(margin.left, margin.top);
		ctx.lineTo(margin.left, height - margin.bottom);

		// X轴（百分比）
		ctx.moveTo(margin.left, height - margin.bottom);
		ctx.lineTo(width - margin.right, height - margin.bottom);

		ctx.setStrokeStyle('#666');
		ctx.stroke();

		// 绘制项目名称
		ctx.setFontSize(12);
		ctx.setFillStyle('#666');
		horizontalData.value.items.forEach((item, index) => {
			const y = margin.top + index * (height - margin.top - margin.bottom) / horizontalData.value.items
				.length +
				(height - margin.top - margin.bottom) / horizontalData.value.items.length / 2;
			ctx.fillText(item, margin.left - 35, y + 5);
		});
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
					width: 70rpx;
				}

				.active .scroll-tab-line {
					border-bottom: 5rpx solid #ccc;
					
				}
			}
		}

		.columnChart {
			width: 95%;
			height: 500rpx;
			margin-top: 15rpx;
			border-radius: 20rpx;
			box-shadow: 2px 2px 5px rgba(128, 128, 128, 0.5);
			.chart {
				width: 100%;
				height: 400px;
			}
		}

		.barChart {
			width: 95%;
			height: 500rpx;
			margin-top: 15rpx;
			border-radius: 20rpx;
			box-shadow: 2px 2px 5px rgba(128, 128, 128, 0.5);
			.chart {
				width: 100%;
				height: 400px;
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
				
				text{
					width: 100%;
					height: 100%;
				}
			}
			.title {
				display: flex;
				align-items: center;
				justify-content: space-between;
				width: 90%;
				height: 10%;
				.text {
					width: 200rpx;
					height: 50rpx;
					font-size: 32rpx;
				}
				.refresh{
					width: 50rpx;
					height: 50rpx;
					z-index: 1;
				}
				.active{
					animation: rotate 1s linear infinite;
				}
				@keyframes rotate{
					0%{
						transform: rotateZ(0deg);/*从0度开始*/
					}
					100%{
						transform: rotateZ(360deg);/*360度结束*/
					}
				}
			}
			
			
		}

	}

	.float{
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