import {
	apiLogin,
	apiGetUserInfo
} from "./api.js"

export async function login() {

	// 获取微信登录code
	const loginRes = await uni.login({
		provider: 'weixin'
	})
	const result = await apiLogin(loginRes.code)
	
	const token = result.data
	uni.setStorageSync("token", token)
	
	// 登陆后获取用户信息
	await refreshUserinfo()
}

export async function mockLogin() {
	// uni.setStorageSync("token", "dfeaf5d7e397&&&@9@%%#&*Qchcsbusn")
	uni.setStorageSync("token", "112233dsadsfsfsdasdada")
	await refreshUserinfo()
}

export async function refreshUserinfo() {
	const userinfo = await apiGetUserInfo()
	const username = userinfo.data.username || '无名';
	const avatar = userinfo.data.avatar || '../../static/images/user.png';
	uni.setStorageSync("username", username)
	uni.setStorageSync("avatar", avatar)
}