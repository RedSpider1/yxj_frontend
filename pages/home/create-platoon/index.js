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
    // 地址信息
    addressInfo: {
      latitude: null,
      longitude: null
    },

    // 标题
    title: null,

    // 人数操作信息
    // 包含我：
    //  1.包含我如果为false，则最小人数为0。
    //  2.包含我如果为true，则最小人数为1。
    // 用户选择的人数必须大于等于最小人数
    personOpInfo: {
      // 用户选择的人数，默认为0，不小于最小人数
      inputPerson: 0,

      // 最小人数
      minPerson: 0,

      // 包含我
      containMe: false
    },

    // 用户输入的描述
    inputIntroduce: null,
    // 描述操作信息
    introduceOpInfo: {
      // 文本域的大小
      autosize: {maxHeight: 100, minHeight: 0},
      // 描述的边框展示
      border: true
    },

    // 图片操作信息
    pictureOpInfo: {
      // 用户选择的照片
      choosePictures: []
    },

    // 截止时间操作信息
    expireTimeOpInfo: {
      // 用户选择的日期
      chooseExpireDate: null,
      // 是否展示日期弹窗
      displayExpireDatePopUps: false,
      // 用户选择的时间
      chooseExpireTime: null,
      // 是否展示时间弹窗
      displayExpireTimePopUps: false,
      // 最终给后端的时间，包含日期+时间
      finalExpireTime: null,
    },

    // 标签操作信息
    labelOpInfo: {
      // 所有的标签信息
      unchooseLabelInfos: [],
      // 标签Name => 标签信息
      labelName2LabelInfoMap: {},
      // 是否展示标签弹窗
      displayLabelPopUps: false,
      // 用户选择的标签
      chooseLabelInfos: []
    },
  },

  /**
   * 包含我按钮事件监听
   * @param {*} event 事件
   */
  changeContainMe (event) {
    let inputPerson = this.data.personOpInfo.inputPerson
    this.setData({
      'personOpInfo.containMe': event.detail,
      'personOpInfo.minPerson': event.detail ? 1 : 0,
      'personOpInfo.inputPerson': event.detail ? inputPerson + 1 : inputPerson - 1
    })
  },

  /**
   * 修改人数事件监听
   * @param {*} event 事件
   */
  changeInputPerson (event) {
    this.setData({
      'personOpInfo.inputPerson': event.detail
    })
  },

  /**
   * 选择照片之后，做的上传操作
   * @param {*} event 事件
   */
  afterReadPicture (event) {
    const {file} = event.detail
    fileOp.default.upload(file.url).then(key => {
      const choosePictures = this.data.pictureOpInfo.choosePictures
      choosePictures.push({ ...file, url: fileOp.default.getImgUrl(key) })
      this.setData({
        'pictureOpInfo.choosePictures': choosePictures
      })
    })
  },

  /**
   * 选择照片之后，删除操作
   * @param {*} e 事件
   */
  deletePicture(e) {
    const choosePictures = this.data.pictureOpInfo.choosePictures
    choosePictures.splice(e.detail.index, 1)
    this.setData({
      'pictureOpInfo.choosePictures': choosePictures
    })
  },

  /**
   * 展示选择截止日期的弹窗
   */
  openShowExpireDate () {
    this.setData({
      'expireTimeOpInfo.displayExpireDatePopUps': true
    })
  },

    /**
   * 不展示选择截止日期的弹窗
   */
  closeShowExpireDate () {
    this.setData({
      'expireTimeOpInfo.displayExpireDatePopUps': false
    })
  },

  /**
   * 确认选择的日期
   * @param {*} event 事件
   */
  confirmShowExpireDate (event) {
    let chooseExpireDate = time.dateFormat(event.detail, 'yyyy-MM-dd')
    this.setData({
      'expireTimeOpInfo.displayExpireTimePopUps': true, 
      'expireTimeOpInfo.chooseExpireDate': chooseExpireDate, 
      'expireTimeOpInfo.displayExpireDatePopUps': false,
    })
    this.setData({'expireTimeOpInfo.finalExpireTime': this.consistTime()})
  },

  /**
   * 不展示选择截止时间的弹窗
   */
  closeShowExpireTime () {
    this.setData({'expireTimeOpInfo.displayExpireTimePopUps': false})
  },

  /**
   * 拼接最终传递给后端的时间
   */
  consistTime () {
    let time = ''
    let expireTimeOpInfo = this.data.expireTimeOpInfo
    if (expireTimeOpInfo.chooseExpireDate != null) {
      time += expireTimeOpInfo.chooseExpireDate + ' '
    }
    if (expireTimeOpInfo.chooseExpireTime != null) {
      time += expireTimeOpInfo.chooseExpireTime
    } else {
      time += '00:00'
    }
    time += ':00'
    return time
  },

  /**
   * 确认选择的时间
   * @param {*} event 事件
   */
  confirmShowExpireTime (event) {
    this.setData({
      'expireTimeOpInfo.chooseExpireTime': event.detail, 
      'expireTimeOpInfo.displayExpireTimePopUps': false
    })
    this.setData({'expireTimeOpInfo.finalExpireTime': this.consistTime()})
  },

  /**
   * 开启标签弹窗
   */
  openShowTag () {
    this.setData({
      'labelOpInfo.displayLabelPopUps': true
    })
  },

  /**
   * 关闭标签弹窗
   */
  closeShowTag () {
    this.setData({
      'labelOpInfo.displayLabelPopUps': false
    })
  },

  /**
   * 选择照片之前，过滤非照片的文件
   * @param {*} event 事件
   */
  beforeReadPicture(event) {
    const {file, callback} = event.detail
    callback(file.type === 'image')
  },

  save () {
    let data = this.data
    if (string.isEmpty(data.title)) {
      wx.showToast({
        title: '标题为空',
        type: 'warn',
        duration: 1000
      })      
      return
    }
    if (data.personOpInfo.inputPerson <= 0) {
      wx.showToast({
        title: '人数必须大于0',
        type: 'warn',
        duration: 1000
      })      
      return
    }

    if (data.expireTimeOpInfo.finalExpireTime === null) {
      data.expireTimeOpInfo.finalExpireTime = new Date().getTime()
    }

    let userInfo = getApp().globalData.userInfo
    http.post('/pss/group', {
      // addressId: 0,
      // auditId: 0,
      // auditType: 0,
      // bizType: "string",
      condition: {
        maxTeamSize: data.personOpInfo.inputPerson,
        minTeamSize: data.personOpInfo.inputPerson
      },
      // contactInfo: "string",
      // contactType: 0,
      containMe: data.personOpInfo.containMe ? 0 : 1,
      endTime: new Date(data.expireTimeOpInfo.finalExpireTime).getTime(),
      // id: 0,
      introduction: data.inputIntroduce,
      labels: data.labelOpInfo.chooseLabelInfos.map(x => x.id),
      ownerId: userInfo.id,
      resourceList: data.pictureOpInfo.choosePictures.map(x => x.url),
      startTime: new Date().getTime(),
      title: data.title
    }).then(id => {
      wx.redirectTo({
        url: `/pages/home/platoon-detail/index?id=${id}`,
      })
    })
  },

  /**
   * 填充地址信息
   */
  fillAddressInfo: (that) => {
    wx.getLocation({
      type: 'wgs84',
      success: (res) => {
        that.setData({
          'addressInfo.latitude': res.latitude,
          'addressInfo.longitude': res.longitude
        })
      }
    })
  },

  /**
   * 校验用户是否登录
   */
  checkUserIsLogin: () => {
    auth.checkLogin()
  },

  /**
   * 加载标签信息
   */
  loadLabelData: (that) => {
    http.get(request.labelList.url).then(res => {
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
      that.setData({
        'labelOpInfo.unchooseLabelInfos': labelInfos, 
        'labelOpInfo.labelName2LabelInfoMap': labelName2LabelInfoMap
      })
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 1.校验用户是否登录
    this.checkUserIsLogin(this)

    // 2.填充地址信息
    this.fillAddressInfo(this)

    // 3.填充全局标签信息
    this.loadLabelData(this)
  },

  /**
   * 选择选中的标签
   * @param {*} event 事件
   */
  chooseTag (event) {
    let item = event.currentTarget.dataset.item
    let unchooseLabelInfos = this.data.labelOpInfo.unchooseLabelInfos
    let chooseLabelInfos = this.data.labelOpInfo.chooseLabelInfos

    let index = 0
    for (let label of unchooseLabelInfos) {
      if (label.id === item.id) {
        break
      }
      index++
    }

    chooseLabelInfos.push(item)
    unchooseLabelInfos.splice(index, 1)

    this.setData({
      'labelOpInfo.unchooseLabelInfos': unchooseLabelInfos,
      'labelOpInfo.chooseLabelInfos': chooseLabelInfos
    })
  },

  /**
   * 取消选择的标签
   * @param {*} event 事件
   */
  closeTag (event) {
    let item = event.currentTarget.dataset.item
    let unchooseLabelInfos = this.data.labelOpInfo.unchooseLabelInfos
    let chooseLabelInfos = this.data.labelOpInfo.chooseLabelInfos

    let index = 0
    for (let label of chooseLabelInfos) {
      if (label.id === item.id) {
        break
      }
      index++
    }

    unchooseLabelInfos.push(item)
    chooseLabelInfos.splice(index, 1)

    this.setData({
      'labelOpInfo.unchooseLabelInfos': unchooseLabelInfos,
      'labelOpInfo.chooseLabelInfos': chooseLabelInfos
    })
  },
})