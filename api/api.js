import {request} from "@/api/request.js"

const kuibu_prefix = "/api/kuibu"

// 微信登陆
export function apiWxLogin(code) {
	return request({
		url: kuibu_prefix + "/user/login?code=" + code,
		method:"POST"
	})
}