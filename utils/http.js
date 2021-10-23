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
      
      header = {
        'ContentType': 'application/json'
      }
    }

    const app = getApp()
    if (app && app.globalData.authToken !== null) {
      header.Authorization = 'Bearer ' + app.globalData.authToken
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
          console.log(options.url)
          wx.showToast({
            title: res.data.message,
            mask: "true",
            icon: 'error',
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
 * DELETE 请求
 */
export function del(url, params, loading = true) {
  var option = {
    url: url,
    data: params,
    method: 'DELETE',
    loading
  }
  return fetch(option)
}

/**
 * PUT 请求
 */
export function put(url, params, loading = true) {
  var option = {
    url: url,
    data: params,
    method: 'PUT',
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