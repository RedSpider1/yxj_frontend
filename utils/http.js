/**
 * 请求相关的封装
 */
let baseUrl = "https://mobile.youxiaoju.com/api/"

/**
 * 封装请求
 */
function fetch(options) {
  if (options.loading) {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
  }
  return new Promise((resolve, reject) => {
    let header = {}
    if (options.method === 'POST') {
      let app = getApp()
      header = {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + app.token
      }
    }

    wx.request({
      url: baseUrl + options.url,
      data: options.data,
      header: header,
      method: options.method,
      success: function(res) {
        if (options.loading) {
          wx.hideLoading()
        }
       
        if (res.data.code != 200) {
          wx.showToast({
            title: res.errMsg,
            mask: "true",
            icon: 'none',
            duration: 3000
          })
          reject(res.data)
        }
        resolve(res.data.data)
      },
      fail: function(err) {
        if (options.loading) {
          wx.hideLoading()
        }
        wx.showToast({
          title: "网络连接超时",
          icon: 'none',
          duration: 3000,
        })
        reject(res.data)
      }
    })
  })
}

/**
 * POST 请求
 */
export function post(url, params, loading = true) {
  var option = {
    url: url,
    data: params,
    method: 'POST',
    loading
  }
  return fetch(option)
}

/**
 * GET请求
 */
export function get(urls, params, loading = true) {
  var option = {
    url: urls,
    data: params,
    method: 'GET',
    loading
  }
  return fetch(option)
}