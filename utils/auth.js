//filter.js
const string = require('./string')
const http = require('./http')
const request = require('./request')
const image = require('./image')

function login(tryLogin) {
  const app = getApp()
  const pages = getCurrentPages()
  const sourceRoute = pages[pages.length - 1].route
  // 有无token来进行处理
  if (string.isEmpty(app.globalData.authToken)) {
    wx.login({
      success: res => {
        app.globalData.code = res.code
        http.post(request.login.url, {
          jsCode: res.code
        }).then(res => {
          if(!string.isEmpty(res.token)) {}
          app.globalData.authToken = res.token
          if (!tryLogin) {
            wx.navigateTo({
              url: `/pages/me/login/index?sourceRoute=${sourceRoute}`,
            })
          }
        })
      }
    })
  } else if (string.isEmpty(app.globalData.userInfo.phone) && !tryLogin) {
    wx.navigateTo({
      url: `/pages/me/login/index?sourceRoute=${sourceRoute}`,
    })
  }
}

/**
 * 尝试登录
 */
export const tryLogin = function () {
  const app = getApp()
  if (string.isEmpty(app.globalData.authToken) || string.isEmpty(app.globalData.userInfo.phone)) {
    login(true)
  }
}

/**
 * 登录校验
 */
export const checkLogin = function () {
  const app = getApp()
  if (string.isEmpty(app.globalData.authToken) || string.isEmpty(app.globalData.userInfo.phone)) {
    login(false)
  }
}

export function logout() {
  const app = getApp()
  app.globalData.authToken = null
  app.globalData.userInfo = null
}

// 微信免登
export function freeLogin(app) {
  // 使用微信免登
  wx.login({
    success: res => {
      http.post(request.freeLogin.url, {
        jsCode: res.code
      }).then(res => {
        if(res) {
          app.globalData.authToken = res
          getCurrentUser(app)
        } else {
          goToLoginPage(app)
        }
      })
    }
  })
}


// 获取当前登录用户的个人信息并设置到globalData
export function getCurrentUser(app) {
  http.get(request.getUserInfo.url).then(res => {
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

function goToLoginPage() {
  wx.reLaunch({
    url: `/pages/me/login/index`,
  })
}