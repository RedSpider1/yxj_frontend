const fileOp = require('../../../utils/file')
const auth = require('../../../utils/auth')
const time = require('../../../utils/time')
const request = require('../../../utils/request')
const http = require('../../../utils/http')
const color = require('../../../utils/color')
const string = require('../../../utils/string')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    submitData: {
      minTeamSize: 1, // 最小人数
      expireTime: '', // 截止日期
      labelArr: [], // 标签选择
    },
    title: '', // 标题
    introduce: '', // 描述
    pictureUrlArray: [],
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
    const that = this
    fileOp.default.upload(file.url).then(key => {
      const sPictureUrlArray = that.data.pictureUrlArray
      sPictureUrlArray.push({ ...file, url: fileOp.default.getImgUrl(key) })
      that.setData({
        pictureUrlArray: sPictureUrlArray
      })
    })
  },
  deletePicture(e) {
    const picArr = this.data.pictureUrlArray
    picArr.splice(e.detail.index, 1)
    this.setData({
      pictureUrlArray: picArr
    })
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
      time += '00:00'
    }
    time += ':00'
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
  save () {
    if (string.isEmpty(this.data.title)) {
      wx.showToast({
        title: '标题为空',
        type: 'warn',
        duration: 2000
      })      
      return
    }
    if (string.isEmpty(this.data.submitData.expireTime)) {
      wx.showToast({
        title: '截止时间为空',
        type: 'warn',
        duration: 2000
      })      
      return
    }
    // 这里要看一下，存的是url还是path。path的话，需要在这个对象里面单独搞一个字段。
    const picArr = this.data.pictureUrlArray.map(x => x.url)
    http.post(request.groupTeamSaveTeam.url, {
      area: null,
      city: null,
      confirmStatus: 0,
      containMe: this.data.containMe ? 1 : 0,
      expireTime: string.isEmpty(this.data.submitData.expireTime) ? null : this.data.submitData.expireTime + '',
      // "id": 0,
      introduce: this.data.introduce,
      labelIdArray: this.data.submitData.labelArr,
      lat: null,
      lon: null,
      maxTeamSize: this.data.submitData.minTeamSize,
      minTeamSize: this.data.submitData.minTeamSize,
      pictureUrlArray: picArr,
      place: null,
      province: null,
      releaseStatus: 1,
      title: this.data.title
    }).then(id => {
      wx.redirectTo({
        url: `/pages/home/platoon-detail/index?id=${id}`,
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    auth.checkLogin()
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
})