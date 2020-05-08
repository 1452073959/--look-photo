<template>
	<form class='loginView' @submit="login">
		<view class="input-view">
			<view class="label-view">
				<text class="label">账号 </text>
			</view>
			<input class="input" type="text" placeholder="请输入用户名" name="nameValue" />
		</view>
		<view class="input-view">
			<view class="label-view">
				<text class="label">密码</text>
			</view>
			<input class="input" type="password" placeholder="请输入密码" name="passwordValue" />
		</view>

		<view class="button-view">
			<button class="" @click="login">微信登录</button>
			<button class="" @click="checkLogin">微信登录检测</button>
			<button class="" @click="openSetting">微信设置</button>
			<button class='bottom' type='primary' open-type="getUserInfo" withCredentials="true" lang="zh_CN" @getuserinfo="wxGetUserInfo">
				授权登录
			</button>
			<button type="default" class="login" hover-class="hover" formType="submit">登录</button>
			<button type="default" class="register" hover-class="hover" @click="register">免费注册</button>
		</view>
	</form>
</template>

<script>
	export default {
		data() {
			return {
				SessionKey: '',
				OpenId: '',
				userInfo: null,
				isCanUse: uni.getStorageSync('isCanUse') || true //默认为true
			};
		},
		methods: {
			login(e) {
				console.log("得到账号:" + e.detail.value.nameValue + ';得到密码:' + e.detail.value.passwordValue)
			},
			register() {
				console.log("前往注册页面")
			},
			//判断是否登录
			checkLogin: function() {
				var that = this;
				  uni.checkSession({
					success() {
						// session_key 未过期，并且在本生命周期一直有效
						console.log('ok');
					},
					fail() {
						// session_key 已经失效，需要重新执行登录流程
						that.login() // 重新登录
						console.log('expire');
					}
				})
			},
			//
			openSetting() {
				wx.openSetting()
			},
			//第一授权获取用户信息===》按钮触发
			wxGetUserInfo() {
				let _this = this;
				uni.getUserInfo({
					provider: 'weixin',
					success: function(infoRes) {
						let nickName = infoRes.userInfo.nickName; //昵称
						let avatarUrl = infoRes.userInfo.avatarUrl; //头像
						_this.login();
					},
					fail(res) {

					}
				});
			},
			//登录
			login() {
				let _this = this;
				uni.showLoading({
					title: '登录中...'
				});

				// 1.wx获取登录用户code
				uni.login({
					provider: 'weixin',
					success: function(loginRes) {
						let code = loginRes.code;
						//2.将用户登录code传递到后台置换用户SessionKey、OpenId等信息
						uni.request({
							url: _this.$loginUrl + '/api/weixin/code',
							data: {
								code: code,
							},
							method: 'GET',
							header: {
								'content-type': 'application/json'
							},
							success: (res) => {
								console.log(res);
								_this.OpenId = res.data.openid
								getApp().globalData.token = res.data.session_key
								try {
									uni.setStorageSync('storage_key', res.data.session_key);
								} catch (e) {
									// error
								}

								//openId、或SessionKdy存储//隐藏loading
								uni.hideLoading();
							}
						});

						uni.getSetting({
							success(res) {
								if (res.authSetting['scope.userInfo']) {
									// 已经授权，可以直接调用 getUserInfo 获取头像昵称
									//非第一次授权获取用户信息
									wx.getUserInfo({
										success: function(res) {
											_this.userInfo = res.userInfo
											getApp().globalData.userInfo = res.userInfo
											_this.updateUserInfo();

										},
									})
								} else {
									console.log('用户未授权')
								}
							}
						})
					},
				});
			},

			// 向后台更新信息
			updateUserInfo() {
				let _this = this;
				uni.request({
					url: _this.$loginUrl + '/api/weixin/updateUserInfo', //服务器端地址
					data: {
						openid: _this.OpenId,
						nickName: _this.userInfo.nickName,
						avatarUrl: _this.userInfo.avatarUrl,
					},
					method: 'POST',
					header: {
						'content-type': 'application/json'
					},
					success: (res) => {
						uni.reLaunch({ //信息更新成功后跳转到小程序首页
							url: '/pages/center/center'
						});
					}

				});
			},
			onLoad() {
				this.checkLogin();
			}
		}
	}
</script>

<style>

</style>
