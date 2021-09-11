let fileOp = require('../../../utils/file')
let time = require('../../../utils/time')
let request = require('../../../utils/request')
let http = require('../../../utils/http')
let color = require('../../../utils/color')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    submitData: {
      title: '', // 标题
      minTeamSize: 1, // 最小人数
      introduce: '', // 描述
      pictureUrlArray: [], // 图片
      expireTime: '', // 截止日期
      labelArr: [], // 标签选择
    },
    minTeamSize: 0,
    containMe: false,
    autosize: {maxHeight: 100, minHeight: 0},
    showExpireDate: false, // 显示截止日期
    expireDate: null, // 显示截止日期
    expireTime: null, // 时间到分
    showExpireTime: false, // 显示截止时间
    expireTimeFormatter: function (type, value) {
      if (type === 'hour') {
        return `${value}时`
      } 
      if (type === 'minute') {
        return `${value}分`
      }
      return value
    }, // 显示截止时间中文
    showTag: false, // 展示标签
    labelArr: [], // 标签集合
    chooseLabelArr: [], // 已选择标签集合
  },
  changeContainMe (event) {
    let submitData = this.data.submitData
    submitData.minTeamSize = event.detail ? submitData.minTeamSize + 1 : submitData.minTeamSize - 1
    let minTeamSize = this.data.minTeamSize
    minTeamSize = event.detail ? 1 : 0
    this.setData({containMe: event.detail, minTeamSize: minTeamSize, submitData: submitData})
  },
  afterReadPicture (event) {
    const {file} = event.detail
    console.log(file)
    fileOp.default.upload(file)
  },
  openShowExpireDate () {
    this.setData({showExpireDate: true})
  },
  closeShowExpireDate () {
    this.setData({showExpireDate: false})
  },
  confirmShowExpireDate (event) {
    let expireDate = time.dateFormat(event.detail, 'yyyy-MM-dd')
    this.setData({showExpireDate: false, expireDate: expireDate, showExpireTime: true})
    let submitData = this.data.submitData
    submitData.expireTime = this.consistTime()
    this.setData({submitData: submitData})
  },
  closeShowExpireTime () {
    this.setData({showExpireTime: false})
  },
  consistTime () {
    let time = ''
    if (this.data.expireDate != null) {
      time += this.data.expireDate + ' '
    }
    if (this.data.expireTime != null) {
      time += this.data.expireTime
    } else {
      time += '00: 00'
    }
    return time
  },
  confirmShowExpireTime (event) {
    this.setData({expireTime: event.detail, showExpireTime: false})
    let submitData = this.data.submitData
    submitData.expireTime = this.consistTime()
    this.setData({submitData: submitData})
  },
  openShowTag () {
    this.setData({showTag: true})
  },
  closeShowTag () {
    this.setData({showTag: false})
  },
  beforeReadPicture(event) {
    const { file, callback } = event.detail;
    callback(file.type === 'image');
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    http.get(request.labelList.url).then(res => {
      let labelArr = []
      for (let row of res) {
        labelArr.push({
          id: row.id,
          name: row.labelName,
          color: color.randomColor()
        })
      }
      that.setData({labelArr: labelArr})
    })
  },
  chooseTag (event) {
    let item = event.currentTarget.dataset.item
    let labelArr = this.data.labelArr
    let chooseLabelArr = this.data.chooseLabelArr
    let submitData = this.data.submitData
    let index = 0
    for (let label of labelArr) {
      if (label.id === item.id) {
        break
      }
      index++
    }
    chooseLabelArr.push(item)
    submitData.labelArr.push(item.id)
    labelArr.splice(index, 1)
    this.setData({labelArr: labelArr, chooseLabelArr: chooseLabelArr, submitData: submitData})
  },
  closeTag (event) {
    let item = event.currentTarget.dataset.item
    let labelArr = this.data.labelArr
    let chooseLabelArr = this.data.chooseLabelArr
    let submitData = this.data.submitData
    let index = 0
    for (let label of chooseLabelArr) {
      if (label.id === item.id) {
        break
      }
      index++
    }
    labelArr.push(item)
    chooseLabelArr.splice(index, 1)
    submitData.labelArr.splice(index, 1)
    this.setData({labelArr: labelArr, chooseLabelArr: chooseLabelArr, submitData: submitData})
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.selectComponent('#footer').load()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})