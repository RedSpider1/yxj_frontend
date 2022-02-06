const auth = require('../utils/auth')
const http = require('../utils/http')
const request = require('../utils/request')
const color = require('../utils/color')

Page({
  /**
   * 页面的初始数据
   */
  data: {
    containerHeight: 0,
    loading: true,
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: async function () {
    const systemInfo = wx.getSystemInfoSync()
    let containerHeight = systemInfo.windowHeight
    this.setData({
      containerHeight: containerHeight
    })

    http.get('pss/label/list', null, false).then( res => {
      let labelInfos = []
      let labelName2LabelInfoMap = {}
      for (let row of res) {
        labelInfos.push({
          id: row.id,
          name: row.labelName,
          color: color.randomColor()
        })
        labelName2LabelInfoMap[row.labelName] = labelInfos[labelInfos.length - 1]
      }
      getApp().globalData.labels = labelInfos
      getApp().globalData.labelName2LabelInfoMap = labelName2LabelInfoMap
    })

    http.get(request.getEnums.url, null, false).then((res) => {
      getApp().globalData.enums = res
      console.log(res)
    }).then( () => {
      auth.freeLogin(getApp())
    }).then( () => {
      getApp().globalData.initDone = true
      wx.reLaunch({
        url: `/pages/home/index`,
      })
    })
  },
})