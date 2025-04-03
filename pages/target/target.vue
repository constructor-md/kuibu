<template>
	<view class="layout">

		<view class="card">
			<view class="content">
				<view class="header">
					<text>心之所期</text>
					<view class="pageTurning">
						<view class="pageLeft" v-if="hasPre" @click="pageLeft">
							<image src="/static/images/arrow-left.png" mode=""></image>
						</view>
						<!-- 占位 -->
						<view class="pageLeft" v-else>
						</view>
						<view class="pageRight" v-if="hasNext" @click="pageRight">
							<image src="/static/images/arrow-right.png" mode=""></image>
						</view>
						<!-- 占位 -->
						<view class="pageRight" v-else>
						</view>
					</view>
				</view>
				<view class="target" v-for="target in data" :key="target.id">
					<view class="title" @click="show(target)">
						<text> {{ target.name }} </text>
						<view class="modify" @click="modifyTarget(target)">
							<image src="/static/images/modify.png" mode=""></image>
						</view>
						<view class="delete" @click="deleteTarget(target)">
							<image src="/static/images/delete.png" mode=""></image>
						</view>
					</view>
					<view class="task" v-for="task in target.tasks" :class="{ 'show': target.isShow }">
						<text class="taskText"> {{ task.name }} </text>
						<view class="modify" @click="modifyTask(target, task)">
							<image src="/static/images/modify.png" mode=""></image>
						</view>
						<view class="delete" @click="deleteTask(target, task)">
							<image src="/static/images/delete.png" mode=""></image>
						</view>
					</view>
					<view class="addTask" :class="{ 'show': target.isShow }" @click="addTask(target)">
						<view> + </view>
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
				<input v-model="inputTask.name" type="text" placeholder="请输入任务名" />
			</view>

			<view class="titleName">
				所属目标
			</view>
			<view class="content">
				<text> {{ selectedTarget.name }} </text>
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
					:disabled="dataSelectDisable"
					></uni-data-select>
			</view>

			<view class="titleName">
				任务目标
			</view>
			<view class="content">
				<input v-if="selectedTaskType === '2'" v-model="inputTask.amount" type="number" placeholder="请输入目标数量" />
				<view v-else class="operator" @click="openTimePicker">
					{{ time === '' ? '自定义' : time}}
				</view>
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
			<input v-model="inputTarget.name" type="text" placeholder="请输入目标名" />
		</view>
		<view class="popFooter">
			<view class="btn" @click="closeTargetPopup">取消</view>
			<view class="btn" @click="submitTarget">提交</view>
		</view>
	</popup>
	
	<uniHms ref="timePicker" :hmsval="time" @complete="completeTimeSelect" />
</template>


<script setup>
	import {
		// apiGetTargetList,
		apiGetTargetPage,
		apiAddTarget,
		apiModifyTarget,
		apiDeleteTarget,
		apiAddTask,
		apiGetTaskList,
		apiModifyTask,
		apiDeleteTask
	} from "@/api/api.js"

	onShow(() => {
		refreshTargetList()
	})
	const currentPage = ref(1)
	const pageCount = ref(0)
	const hasNext = computed(() => {
		return currentPage.value < pageCount.value
	})
	const hasPre = computed(() => {
		return currentPage.value > 1
	})
	const refreshTargetList = async () => {
		let result = await apiGetTargetPage(currentPage.value)
		data.value = result.data.records
		pageCount.value = result.data.pages
		currentPage.value = result.data.current
	}
	const pageLeft = async () => {
		currentPage.value = currentPage.value - 1
		await refreshTargetList()
	}
	const pageRight = async () => {
		currentPage.value = currentPage.value + 1
		await refreshTargetList()
	}
	const refreshTaskList = async (target) => {
		let result = await apiGetTaskList(target.id)
		target.tasks = result.data
	}


	const popTask = ref(null);
	const popTarget = ref(null);
	const addTask = (target) => {
		// 弹框中间
		popTask.value.show = true
		selectedTarget.value = target
		inputTask.value = {id:0}
	}
	const modifyTask = (target, task) => {
		dataSelectDisable.value = true
		popTask.value.show = true
		inputTask.value = task
		selectedTarget.value = target
		event.stopPropagation(); // 阻止事件冒泡
	} 
	const deleteTask = (target, task) => {
		event.stopPropagation(); // 阻止事件冒泡
		uni.showModal({
			title: "是否删除任务：" + task.name,
			content: "删除后任务对应的跬步数据也会删除，请谨慎操作",
			confirmText: "删除",
			success: async (res) => {
				if (res.confirm) {
					await apiDeleteTask(task.id)
		
					uni.showToast({
						title: "删除成功",
						icon: "success"
					})
					await refreshTaskList(target)
				}
			}
		})
	}
	const timePicker = ref(null)
	const openTimePicker = () => {
		timePicker.value.show()
	}
	const time = ref("")
	const completeTimeSelect = (diyTime) => {
		time.value = diyTime
		console.log("time", time.value);
	}
	const addTarget = () => {
		// 弹框中间
		popTarget.value.show = true
		inputTarget.value = {id: 0}
	}
	const modifyTarget = (target) => {
		popTarget.value.show = true
		inputTarget.value = target
		event.stopPropagation(); // 阻止事件冒泡
	} 
	const deleteTarget = (target) => {
		event.stopPropagation(); // 阻止事件冒泡
		uni.showModal({
			title: "是否删除目标：" + target.name,
			content: "删除后下属任务也会一并删除，请谨慎操作！",
			confirmText: "删除",
			success: async (res) => {
				if (res.confirm) {
					await apiDeleteTarget(target.id)
		
					uni.showToast({
						title: "删除成功",
						icon: "success"
					})
					await refreshTargetList()
				}
			}
		})
	}
	const inputTask = ref({
		name:"",
		amount:0
	})
	const closeTaskPopup = function() {
		popTask.value.show = false;
		// 清除数据
		inputTask.value = {}
		time.value = ''
		// 恢复类型可选
		dataSelectDisable.value = false
	}
	const submitTask = async () => {
		if(!inputTask.value.name || inputTask.value.name.trim().length === 0) {
			uni.showToast({
				title:"任务名称不可没有内容",
				icon:"error"
			})
			return
		}
		if(selectedTaskType.value === '2') {
			if(!inputTask.value.amount || inputTask.value.amount <= 0) {
				uni.showToast({
					title:"任务目标不可小于等于0",
					icon:"error"
				})
				return
			}
		} else {
			if(!time.value || time.value.trim().length === 0) {
				uni.showToast({
					title:"任务目标时间不可为空",
					icon:"error"
				})
				return
			}
			if(time.value === '00:00:00') {
				uni.showToast({
					title:"任务目标时间不可为0",
					icon:"error"
				})
				return
			}
			// 将时间数值转换为amount时间戳
			let [hours, minutes, seconds] = time.value.split(":").map(Number);
			inputTask.value.amount = (hours * 3600 + minutes * 60 + seconds) * 1000;
			
			console.log("inputTask.value.amount", inputTask.value.amount);
		}
		
		
		if(inputTask.value.id === 0) {
			const result = await apiAddTask({
				name: inputTask.value.name,
				type: selectedTaskType.value,
				goalId: selectedTarget.value.id,
				amount: inputTask.value.amount
			})
		} else {
			const result = await apiModifyTask({
				id:inputTask.value.id,
				name: inputTask.value.name,
				type: selectedTaskType.value,
				goalId: selectedTarget.value.id,
				amount: inputTask.value.amount
			})
		}
		// 刷新当前任务列表
		await refreshTaskList(selectedTarget.value)
		
		popTask.value.show = false;
	}
	const closeTargetPopup = function() {
		popTarget.value.show = false;
		inputTarget.value = {}
	}
	const inputTarget = ref({})
	const submitTarget = async () => {
		if(inputTarget.value.name.trim().length === 0) {
			uni.showToast({
				title:"目标名称不可没有内容",
				icon:"error"
			})
			return
		}
		if(inputTarget.value.id === 0) {
			await apiAddTarget(inputTarget.value.name)
		} else {
			await apiModifyTarget(inputTarget.value)
		}
		await refreshTargetList()
		popTarget.value.show = false;
	}
	const show = async function(target) {
		// 关闭其他
		data.value.forEach(t => {
			if(t.id !== target.id) {
				t.isShow = false;
			}
		})
		// 如果置反后需要展示 就查询数据
		if (!target.isShow) {
			await refreshTaskList(target)
		}
		// 置反当前
		target.isShow = !target.isShow;
	}

	const selectedTaskType = ref("2");
	const dataSelectDisable = ref(false)
	const taskTypes = ref([
		{
			text: "数量",
			value: "2"
		},
		{
			text: "时间",
			value: "1"
		}
	]);
	const selectedTarget = ref({});
	const data = ref([])
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

			.select {
				width: 260rpx;
			}
			
			text {
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
				
				display: grid;
				grid-template-columns: 20% 20% 20% 20% 20%;
				grid-template-rows: 100%;
				place-items: center;
				text {
					grid-column-start: 1;
					grid-column-end: 3;
					// padding-left: 40rpx;
				}
				
				.pageTurning{
					width: 160rpx;
					height: 100%;
					grid-column-start: 4;
					grid-column-end: 6;
					display: flex;
					.pageLeft {
						width: 50%;
						height: 100%;
						image {
							width: 90%;
							height: 100%;
						}
					}
					.pageRight {
						width: 50%;
						height: 100%;
						image {
							width: 90%;
							height: 100%;
						}
					}
					
				}
			}

			.target {
				width: 600rpx;
				min-height: 100rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				flex-direction: column;

				.title {
					width: 100%;
					height: 100rpx;
					border-radius: 50rpx;
					background: linear-gradient(to right, #a56aff, #dc94ff);
					box-shadow: 2px 2px 5px rgba(128, 128, 128, 0.5);
					color: #eee;
					margin-bottom: 10rpx;

					display: grid;
					grid-template-columns: 10% 10% 10% 10% 10% 10% 10% 10% 10% 10% ;
					grid-template-rows: 100%;
					text {
						grid-column-start: 2;
						grid-column-end: 6;
						display: flex;
						align-items: center;
						justify-content: center;
					}
					
					.modify {
						grid-column-start: 7;
						grid-column-end: 9;
						display: flex;
						align-items: center;
						justify-content: center;
						z-index: 1;
						image {
							width: 50rpx;
							height: 50rpx;
						}
					}
					
					.delete {
						grid-column-start: 9;
						grid-column-end: 11;
						display: flex;
						align-items: center;
						justify-content: center;
						z-index: 1;
						image {
							width: 50rpx;
							height: 50rpx;
						}
					}
					
					
				}

				.task {
					width: 80%;
					height: 0;
					overflow: hidden;
					opacity: 0;
					box-shadow: 2px 2px 5px rgba(128, 128, 128, 0.5);
					border-radius: 50rpx;
					transition: height 0.3s ease-in-out, opacity 0.1s ease-in-out;
					margin-bottom: 10rpx;
					display: grid;
					grid-template-columns: 10% 10% 10% 10% 10% 10% 10% 10% 10% 10% ;
					grid-template-rows: 100%;
					
					.taskText {
						grid-column-start: 2;
						grid-column-end: 6;
						display: flex;
						align-items: center;
						justify-content: center;
					}
					
					.modify {
						grid-column-start: 7;
						grid-column-end: 9;
						display: flex;
						align-items: center;
						justify-content: center;
						z-index: 1;
						image {
							width: 50rpx;
							height: 50rpx;
						}
					}
					
					.delete {
						grid-column-start: 9;
						grid-column-end: 11;
						display: flex;
						align-items: center;
						justify-content: center;
						z-index: 1;
						image {
							width: 50rpx;
							height: 50rpx;
						}
					}
				}
				
				
				.addTask {
					width: 80%;
					height: 0;
					overflow: hidden;
					opacity: 0;
					box-shadow: 2px 2px 5px rgba(128, 128, 128, 0.5);
					border-radius: 50rpx;
					transition: height 0.3s ease-in-out, opacity 0.1s ease-in-out;
					margin-bottom: 10rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					font-size: 40rpx;
				}

				.task.show {
					height: 80rpx;
					opacity: 1;
				}
				
				
				.addTask.show {
					height: 80rpx;
					opacity: 1;
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