const http = require('./utils/http')
const request = require('./utils/request')
const string = require('./utils/string')
const image = require('./utils/image')

App({
  onLaunch() {
    // 进入小程序，就会校验登录态
    this.login()
  },
  login() {
    // 使用微信免登
    wx.login({
      success: res => {
        this.globalData.code = res.jsCode
        http.post(request.login.url, {
          jsCode: res.code
        }).then(res => {
          // 如果是新用户，引导到注册页面
          if (res.newUser) {
            this.goToLoginPage()
          } else {
            // 设置全局jwt
            this.globalData.authToken = res.token
            // 获取当前登录用户的个人信息
            http.get(request.getUserInfo.url).then(res => {
              if (res !== null && !string.isEmpty(res.phone)) {
                this.globalData.userInfo = {
                  id: res.id,
                  phone: res.phone,
                  wechatNum: res.wechatNum,
                  nickname: string.isEmpty(res.name) ? '' : res.name,
                  avatar: string.isEmpty(res.avatar) ? image.defaultAvatar : res.avatar,
                  sex: res.sex === null ? 1 : res.sex,
                  slogan: string.isEmpty(res.slogan) ? '' : res.slogan,
                  birthday: string.isEmpty(res.birthday) ? '1970-01-01' : res.birthday
                }
              } else {
                this.goToLoginPage()
              }
            }).catch(e => {
              this.goToLoginPage()
            })
          }
        })
      }
    })
  },
  goToLoginPage() {
    wx.navigateTo({
      url: `/pages/me/login/index`,
    })
  },
  globalData: {
    themes: {
      primary: '#33B4BC',
      second: '#D2CB1D',
      third: '#D21DAA'
    },
    // 微信code
    code: null,
    // 后段交互toekn
    authToken: null,
    userInfo: null
  }
})