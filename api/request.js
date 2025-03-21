const BASE_URL = "http://localhost:8123";


export function request(config = {}) {
	let {
		url,
		method="GET",
		header={},
		data={}
	} = config
	url = BASE_URL + url
	header['token'] = uni.getStorageSync("token")
	
	return new Promise((resolve, reject) => {
		uni.request({
			url,
			method,
			header,
			data,
			success:res => {
				if(res.data.code === 200) {
					resolve(res.data)
				} else {
					uni.showToast({
						title:"请求错误",
						content: res.data.msg,
						showCancel:false
					})
					reject(res.data)
				}
			},
			fail: err => {
				reject(err)
			}
		})
	})
}