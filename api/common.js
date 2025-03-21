import {
	apiWxLogin
} from "./api.js"

export async function login() {

	// 获取微信登录code
	const loginRes = await uni.login({
		provider: 'weixin'
	})
	console.log("code", loginRes.code);
	const result = await apiWxLogin(loginRes.code)
	
	const token = result.data
	uni.setStorageSync("token", token)
}