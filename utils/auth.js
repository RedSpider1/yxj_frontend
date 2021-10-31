const string = require('./string')
const http = require('./http')
const request = require('./request')
const image = require('./image')

/**
 * 登出
 */
export function logout() {
  const app = getApp()
  app.globalData.authToken = null
  app.globalData.userInfo = null
}

/**
 * 微信免登
 * @param {*} app 微信小程序app
 */
export function freeLogin(app) {
  return new Promise((resolve, reject) => {
    // 使用微信免登
    wx.login({
      success: res => {
        http.post('/wx/freeLogin', {
          jsCode: res.code
        }, false).then(res => {
          if(res) {
            app.globalData.authToken = res
            getCurrentUser(app)
            resolve()
          } else {
            goToLoginPage(app)
          }
        })
      }
    })
  })
}

/**
 * 鉴权，执行回调函数
 * @param {*} app 微信小程序app
 * @param  {...any} callback 回调函数
 */
export function doCheckAuthAndExecCallback(app, callback) {
  if (string.isEmpty(app.globalData.authToken)) {
    freeLogin(app).then(() => {
      execCallback(callback)
    })
  } else {
    execCallback(callback)
  }
}

/**
 * 鉴权，执行回调函数
 * @param  {...any} callback 回调函数
 */
export function checkAuthAndExecCallback(callback) {
  let app = getApp()
  doCheckAuthAndExecCallback(app, callback)
}

/**
 * 串行执行回调函数
 * @param  {...any} callback 回调函数
 */
function execCallback(callback) {
  if (typeof callback === 'function') {
    callback()
  }
}

/**
 * 获取当前登录用户的个人信息并设置到globalData
 * @param {*} app 微信小程序app
 */
export function getCurrentUser(app) {
  http.get(request.getUserInfo.url, false).then(res => {
    if (res !== null && !string.isEmpty(res.phone)) {
      app.globalData.userInfo = {
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
      goToLoginPage()
    }
  }).catch(e => {
    goToLoginPage()
  })
}

/**
 * 跳转登录页
 */
function goToLoginPage() {
  wx.reLaunch({
    url: `/pages/me/login/index`,
  })
}