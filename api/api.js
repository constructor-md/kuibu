import {
	request
} from "@/api/request.js"

const kuibu_prefix = "/api/kuibu"

// 微信登陆
export async function apiLogin(code) {
	return request({
		url: kuibu_prefix + "/user/login?code=" + code,
		method: "POST"
	})
}

// 获取用户信息
export async function apiGetUserInfo() {
	return request({
		url: kuibu_prefix + "/user/userinfo",
		method: "GET",
		header: {
			"token": uni.getStorageSync("token")
		}
	})
}

// 修改用户名
export async function apiEditUsername(username) {
	return request({
		url: kuibu_prefix + "/user/username?username=" + username,
		method: "PUT",
		header: {
			"token": uni.getStorageSync("token")
		}
	})
}

// 用户建议提交
export async function apiSubmitSuggestion(suggestion) {
	return request({
		url: kuibu_prefix + "/user/suggestion",
		method: "POST",
		data: {
			"text": suggestion
		},
		header: {
			"token": uni.getStorageSync("token")
		}
	})
}

// 获取进行中任务总数
export async function apiGetOngoingTaskCount() {
	return request({
		url: kuibu_prefix + "/task/ongoing/count",
		method: "GET",
		header: {
			"token": uni.getStorageSync("token")
		}
	})
}

// 获取已完成任务总数
export async function apiGetCompletedTaskCount() {
	return request({
		url: kuibu_prefix + "/task/completed/count",
		method: "GET",
		header: {
			"token": uni.getStorageSync("token")
		}
	})
}

// 获取进行中目标总数
export async function apiGetOngoingGoalCount() {
	return request({
		url: kuibu_prefix + "/goal/ongoing/count",
		method: "GET",
		header: {
			"token": uni.getStorageSync("token")
		}
	})
}

// 获取目标列表
export async function apiGetTargetList() {
	return request({
		url: kuibu_prefix + "/goal/list",
		method: "GET",
		header: {
			"token": uni.getStorageSync("token")
		}
	})
}

// 获取目标列表 - 分页
export async function apiGetTargetPage(currentPage) {
	return request({
		url: kuibu_prefix + "/goal/page",
		method: "POST",
		data: {
			current: currentPage,
			pageSize: 10
		},
		header: {
			"token": uni.getStorageSync("token")
		}
	})
}

// 新建目标
export async function apiAddTarget(name) {
	return request({
		url: kuibu_prefix + "/goal/info?name=" + name,
		method: "POST",
		header: {
			"token": uni.getStorageSync("token")
		}
	})
}

// 修改目标
export async function apiModifyTarget(target) {
	return request({
		url: kuibu_prefix + "/goal/info",
		method: "PUT",
		data: target,
		header: {
			"token": uni.getStorageSync("token")
		}
	})
}

// 删除目标
export async function apiDeleteTarget(id) {
	return request({
		url: kuibu_prefix + "/goal/info?id=" + id,
		method: "DELETE",
		header: {
			"token": uni.getStorageSync("token")
		}
	})
}

// 新建任务
export async function apiAddTask(task) {
	return request({
		url: kuibu_prefix + "/task/info",
		method: "POST",
		data: task,
		header: {
			"token": uni.getStorageSync("token")
		}
	})
}

// 编辑任务
export async function apiModifyTask(task) {
	return request({
		url: kuibu_prefix + "/task/info",
		method: "PUT",
		data: task,
		header: {
			"token": uni.getStorageSync("token")
		}
	})
}

// 删除任务
export async function apiDeleteTask(id) {
	return request({
		url: kuibu_prefix + "/task/info?id=" + id,
		method: "DELETE",
		header: {
			"token": uni.getStorageSync("token")
		}
	})
}

// 查询指定目标的任务列表
export async function apiGetTaskList(targetId) {
	return request({
		url: kuibu_prefix + "/task/list?id=" + targetId,
		method: "GET",
		header: {
			"token": uni.getStorageSync("token")
		}
	})
}

// 获取每日一句信息
export async function apiGetDailyWords() {
	return request({
		url: kuibu_prefix + "/sentence/one",
		method: "GET",
		header: {
			"token": uni.getStorageSync("token")
		}
	})
}

// 新增跬步
export async function apiAddKuibuInfo(data) {
	return request({
		url: kuibu_prefix + "/kuibu/info",
		method: "POST",
		data: data,
		header: {
			"token": uni.getStorageSync("token")
		}
	})
}

// 获取纵向柱状图
export async function apiGetVerticalBarChart(taskId) {
	return request({
		url: kuibu_prefix + "/kuibu/histogram/task?id=" + taskId,
		method: "GET",
		header: {
			"token": uni.getStorageSync("token")
		}
	})
}

// 获取横向柱状图
export async function apiGetHorizotalBarchart(goalId) {
	return request({
		url: kuibu_prefix + "/kuibu/histogram/goal?id=" + goalId,
		method: "GET",
		header: {
			"token": uni.getStorageSync("token")
		}
	})
}

// 获取公告数据
export async function apiGetNotice() {
	return request({
		url: kuibu_prefix + "/task/notice",
		method: "GET",
		header: {
			"token": uni.getStorageSync("token")
		}
	})
}

// 获取缓存的AI建议
export async function apiGetAiSuggestion() {
	return request({
		url: kuibu_prefix + "/ai/suggestion",
		method: "GET",
		header: {
			"token": uni.getStorageSync("token")
		}
	})
}

// 获取实时流式AI建议
export function apiGetAiSuggestionRefresh() {
	const streamText = ref('');
	const textContainer = ref(null);
	let abortController;

	const startStreaming = () => {
		return new Promise((resolve, reject) => {
			streamText.value = ''
			const url = "http://localhost:8123" + kuibu_prefix + "/ai/suggestion/refresh";
			const headers = {
				"token": uni.getStorageSync("token"),
				'Content-Type': 'text/event-stream',
				'Cache-Control': 'no-cache, no-store, must-revalidate',
				'Pragma': 'no-cache',
				'Expires': '0'
			};

			const requestTask = wx.request({
				url: url,
				method: 'GET',
				// 设置超时时间为 6000000 毫秒（即 6000 秒 十分钟）
				timeout: 6000000,
				enableChunked: true, // 开启流式传输模式
				responseType: 'text',
				header: headers,
				success: (res) => {
					resolve();
				},
				fail: (err) => {
					console.log("请求失败", err);
					reject(err);
				},
				complete: () => {}
			});

			// 缓冲区
			const buffer = ref('')
			// 监听数据分块接收事件
			requestTask.onChunkReceived((response) => {
				// 当前块数据
				const arrayBuffer = response.data;
				// 解码器
				const decoder = new TextDecoder('utf-8');
				// 解码文本
				const text = decoder.decode(arrayBuffer);
				// 判断是否是报错信息
				try {
					const regexJson = "\{.*?\}"
					const resultJsonText = text.match(regexJson);
					if (resultJsonText) {
						const resultJsonObject = JSON.parse(resultJsonText);
						if (resultJsonObject.code === 600504) {
							uni.showToast({
								title: "请求频率限制",
								content: "每十分钟可以调用一次AI建议刷新",
								showCancel: false
							})
							return;
						}
					}
				} catch(error) {
					// do nothing
				}

				console.log("每次接收到的块数据", text);
				// 无条件将文本拼接到buffer
				buffer.value += text;

				// 尝试通过正则找到所有 data:JSON(单层括号) 格式的数据
				// 找到就解析否则就跳过
				const regex = /data:(\{.*?\})/g;
				let match;
				while ((match = regex.exec(buffer.value)) !== null) {
					const jsonText = match[1];
					try {
						const jsonObject = JSON.parse(jsonText);
						streamText.value += jsonObject.data;
						if (textContainer.value) {
							textContainer.value.scrollTop = textContainer.value.scrollHeight;
						}
					} catch (error) {
						console.error('JSON解析错误:', error);
					}
				}

				// 移除解析过的数据
				let lastMatchEnd = 0;
				regex.lastIndex = 0;
				while ((match = regex.exec(buffer.value)) !== null) {
					lastMatchEnd = regex.lastIndex;
				}
				buffer.value = buffer.value.slice(lastMatchEnd);
			});

		});
	};

	return {
		streamText,
		textContainer,
		startStreaming
	};
}