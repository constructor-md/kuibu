<template>
	<view class="layout">

		<view class="card">
			<view class="content">
				<view class="header">
					<text>心之所期</text>
				</view>
				<view class="target" v-for="target in data" :key="target.id">
					<view class="title" @click="show(target)">
						<text> {{ target.name }} </text>
					</view>
					<view class="task" v-for="task in target.tasks" :class="{ 'show': target.isShow }">
						<text class="taskText"> {{ task.name }} </text>
					</view>
					<view class="task" :class="{ 'show': target.isShow }">
						<view @click="addTask" class="addTask"> + </view>
					</view>
				</view>
				<view class="addTarget" @click="addTarget">
					+
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

	<popup ref="popTarget">
		<view class="popTitle">
			<text>目标设定</text>
		</view>
		<view class="popTargetContent">
			<input type="text" placeholder="请输入目标名" />
		</view>
		<view class="popFooter">
			<view class="btn" @click="closeTargetPopup">取消</view>
			<view class="btn" @click="submitTarget">提交</view>
		</view>
	</popup>
</template>


<script setup>
	const popTask = ref(null);
	const popTarget = ref(null);
	const addTask = () => {
		// 弹框中间
		popTask.value.show = true
	}
	const addTarget = () => {
		// 弹框中间
		popTarget.value.show = true
	}
	const closeTaskPopup = function() {
		popTask.value.show = false;
		console.log("close");
	}
	const submitTask = function() {
		popTask.value.show = false;
	}
	const closeTargetPopup = function() {
		popTarget.value.show = false;
		console.log("close");
	}
	const submitTarget = function() {
		popTarget.value.show = false;
	}
	const show = function(target) {
		target.isShow = !target.isShow;
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
	
	// 处理选中事件
	const handleTargetChange = (value) => {
		console.log("target选中的值：", value);
	};
	const handleTaskChange = (value) => {
		console.log("task选中的值：", value);
	};
	
	const data = ref([{
			id: 1,
			name: "目标1",
			tasks: [{
					id: 11,
					name: "任务11"
				},
				{
					id: 12,
					name: "任务12"
				},
				{
					id: 13,
					name: "任务13"
				},
				{
					id: 14,
					name: "任务14"
				},
				{
					id: 15,
					name: "任务15"
				},
				{
					id: 16,
					name: "任务16"
				},
				{
					id: 17,
					name: "任务17"
				},
			]
		},
		{
			id: 2,
			name: "目标2",
			tasks: [{
					id: 21,
					name: "任务21"
				},
				{
					id: 22,
					name: "任务22"
				},
			]
		},
		{
			id: 3,
			name: "目标3",
			tasks: [{
					id: 31,
					name: "任务31"
				},
				{
					id: 32,
					name: "任务32"
				},
			]
		},
		{
			id: 4,
			name: "目标4",
			tasks: [{
					id: 41,
					name: "任务41"
				},
				{
					id: 42,
					name: "任务42"
				},
			]
		},
		{
			id: 5,
			name: "目标5",
			tasks: [{
					id: 51,
					name: "任务51"
				},
				{
					id: 52,
					name: "任务52"
				},
			]
		},
		{
			id: 6,
			name: "目标5",
			tasks: [{
					id: 51,
					name: "任务51"
				},
				{
					id: 52,
					name: "任务52"
				},
			]
		},

		{
			id: 6,
			name: "目标5",
			tasks: [{
					id: 51,
					name: "任务51"
				},
				{
					id: 52,
					name: "任务52"
				},
			]
		},
		{
			id: 7,
			name: "目标5",
			tasks: [{
					id: 51,
					name: "任务51"
				},
				{
					id: 52,
					name: "任务52"
				},
			]
		},
		{
			id: 8,
			name: "目标5",
			tasks: [{
					id: 51,
					name: "任务51"
				},
				{
					id: 52,
					name: "任务52"
				},
			]
		},
		{
			id: 9,
			name: "目标5",
			tasks: [{
					id: 51,
					name: "任务51"
				},
				{
					id: 52,
					name: "任务52"
				},
			]
		},
	])
</script>

<style lang="scss">
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


	.popTargetContent {
		height: 70%;
		background: #faf7fa;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;

		input {
			border: 1px solid #a56aff;
			border-radius: 50rpx;
			height: 80rpx;
			width: 400rpx;
			text-align: center;
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
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;



		.content {
			width: 90vw;
			min-height: 80vh;
			display: flex;
			align-items: center;
			flex-direction: column;
			border-radius: 50rpx;
			box-shadow: 2px 2px 5px rgba(128, 128, 128, 0.5);
			margin-bottom: 150rpx;

			.header {
				width: 90vw;
				height: 5vh;
				font-size: 34rpx;
				letter-spacing: 0.1em;
				margin-bottom: 10rpx;
				padding-top: 120rpx;

				text {
					padding-left: 40rpx;
				}
			}

			.target {
				width: 600rpx;
				min-height: 100rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				flex-direction: column;
				margin-bottom: 10rpx;

				.title {
					width: 100%;
					height: 100rpx;
					display: flex;
					align-items: center;
					border-radius: 50rpx;
					background: linear-gradient(to right, #a56aff, #dc94ff);
					box-shadow: 2px 2px 5px rgba(128, 128, 128, 0.5);
					color: #eee;

					text {
						margin-left: 80rpx;
					}
				}

				.task {
					display: none;
				}

				.task.show {
					width: 80%;
					height: 80rpx;
					box-shadow: 2px 2px 5px rgba(128, 128, 128, 0.5);
					border-radius: 50rpx;
					display: flex;
					align-items: center;
					transition: opacity 0.5s ease-in-out, transform 0.5s ease-in-out;

					.taskText {
						margin-left: 80rpx;
					}

					.addTask {
						width: 100%;
						height: 100%;
						display: flex;
						align-items: center;
						justify-content: center;
						font-size: 40rpx;
					}
				}
			}

			.addTarget {
				width: 600rpx;
				height: 100rpx;
				background: linear-gradient(to right, #a56aff, #dc94ff);
				border-radius: 50rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				font-size: 50rpx;
				box-shadow: 2px 2px 5px rgba(128, 128, 128, 0.5);
				margin-bottom: 30rpx;
				color: #eee;
			}
		}

	}
</style>