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
    contacts: [],

    // 标题
    title: null,

    // 人数操作信息
    // 包含我：
    //  1.包含我如果为false，则最小人数为0。
    //  2.包含我如果为true，则最小人数为1。
    // 用户选择的人数必须大于等于最小人数
    personOpInfo: {
      // 用户选择的人数，默认为0，不小于最小人数
      inputPerson: 2,

      // 最小人数
      minPerson: 1,

      // 包含我
      containMe: false
    },

    // 用户输入的描述
    inputIntroduce: null,
    // 描述操作信息
    introduceOpInfo: {
      // 文本域的大小
      autosize: {
        maxHeight: 100,
        minHeight: 0
      },
      // 描述的边框展示
      border: true
    },

    // 图片操作信息
    pictureOpInfo: {
      // 用户选择的照片
      choosePictures: []
    },

    // 截止时间操作信息
    endTime: new Date().getTime() + 1000 * 60 * 60 * 24, // 默认是1天后
    endTimeStr: time.timestap2Str(new Date().getTime() + 1000 * 60 * 60 * 24),
    expireTimeOpInfo: {
      // 是否展示时间弹窗
      displayExpireTimePopUps: false
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
    formatter(type, value) {
      if (type === 'year') {
        return `${value}年`;
      }
      if (type === 'month') {
        return `${value}月`;
      }
      if (type === 'day') {
        return `${value}日`;
      }
      if (type === 'hour') {
        return `${value}时`;
      }
      if (type === 'minute') {
        return `${value}分`;
      }
      return value;
    },
  },

  /**
   * 包含我按钮事件监听
   * @param {*} event 事件
   */
  changeContainMe(event) {
    let inputPerson = this.data.personOpInfo.inputPerson
    this.setData({
      'personOpInfo.containMe': event.detail,
      'personOpInfo.minPerson': event.detail ? 2 : 1,
    })
    if (event.detail && inputPerson == 1) {
      this.setData({
        'personOpInfo.inputPerson': 2
      })
    }
  },
  quickSelectOneDay() {
    this.setData({
      endTime: new Date().getTime() + 1000 * 60 * 60 * 24, // 默认是1天后
      endTimeStr: time.timestap2Str(new Date().getTime() + 1000 * 60 * 60 * 24),
    })
  },
  quickSelectOneWeek() {
    this.setData({
      endTime: new Date().getTime() + 1000 * 60 * 60 * 24 * 7, 
      endTimeStr: time.timestap2Str(new Date().getTime() + 1000 * 60 * 60 * 24 * 7),
    })
  },
  quickSelectOneMonth() {
    this.setData({
      endTime: new Date().getTime() + 1000 * 60 * 60 * 24 * 30, 
      endTimeStr: time.timestap2Str(new Date().getTime() + 1000 * 60 * 60 * 24 * 30),
    })
  },

  /**
   * 修改人数事件监听
   * @param {*} event 事件
   */
  changeInputPerson(event) {
    this.setData({
      'personOpInfo.inputPerson': event.detail
    })
  },

  /**
   * 选择照片之后，做的上传操作
   * @param {*} event 事件
   */
  afterReadPicture(event) {
    const {
      file
    } = event.detail
    fileOp.default.upload(file.url).then((data) => {
      let {
        key,
        id
      } = data
      let choosePictures = this.data.pictureOpInfo.choosePictures
      choosePictures.push({
        ...file,
        url: fileOp.default.getImgUrl(key),
        resourceId: id
      })
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
  openShowExpireDate() {
    this.setData({
      'expireTimeOpInfo.displayExpireTimePopUps': true
    })
  },

  /**
   * 不展示选择截止日期的弹窗
   */
  closeShowExpireDate() {
    this.setData({
      'expireTimeOpInfo.displayExpireTimePopUps': false
    })
  },


  /**
   * 不展示选择截止时间的弹窗
   */
  closeShowExpireTime() {
    this.setData({
      'expireTimeOpInfo.displayExpireTimePopUps': false
    })
  },

  /**
   * 确认选择的时间
   * @param {*} event 事件
   */
  confirmShowExpireTime(event) {
    this.setData({
      endTime: event.detail,
      endTimeStr: time.timestap2Str(event.detail),
      'expireTimeOpInfo.displayExpireTimePopUps': false
    })
  },

  /**
   * 开启标签弹窗
   */
  openShowTag() {
    this.setData({
      'labelOpInfo.displayLabelPopUps': true
    })
  },

  /**
   * 关闭标签弹窗
   */
  closeShowTag() {
    this.setData({
      'labelOpInfo.displayLabelPopUps': false
    })
  },

  /**
   * 选择照片之前，过滤非照片的文件
   * @param {*} event 事件
   */
  beforeReadPicture(event) {
    const {
      file,
      callback
    } = event.detail
    callback(file.type === 'image')
  },

  save() {
    let data = this.data
    if (string.isEmpty(data.title)) {
      wx.showToast({
        title: '标题为空',
        icon: 'error',
        duration: 1000
      })
      return
    }
    if (data.personOpInfo.inputPerson <= 0) {
      wx.showToast({
        title: '人数必须大于0',
        icon: 'error',
        duration: 1000
      })
      return
    }

    if (data.endTime == 0) {
      data.endTime = new Date().getTime()
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
      containMe: data.personOpInfo.containMe ? 1 : 0,
      endTime: data.endTime,
      // id: 0,
      introduction: data.inputIntroduce,
      labels: data.labelOpInfo.chooseLabelInfos.map(x => x.name),
      ownerId: userInfo.id,
      resourceList: data.pictureOpInfo.choosePictures.map(x => x.resourceId),
      startTime: new Date().getTime(),
      title: data.title
    }).then(id => {
      wx.reLaunch({
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
   * 加载标签信息
   */
  loadLabelData: (that) => {
    let allLabels = []
    for (const label of getApp().globalData.labels) {
      allLabels.push(label)
    }
    that.setData({
      'labelOpInfo.unchooseLabelInfos': allLabels,
      'labelOpInfo.labelName2LabelInfoMap': getApp().globalData.labelName2LabelInfoMap
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 校验用户是否登录并执行
    this.init()
  },

  /**
   * 初始化
   */
  init() {
    // 2.填充地址信息
    // this.fillAddressInfo(this)

    // 3.填充全局标签信息
    this.loadLabelData(this)

    // 4. 拿我的联系方式(联系方式的选择，抽成公共组件)
    http.get('pss/contactinformation/', null, false).then(res => {
      console.log(res)
    })

  },

  /**
   * 选择选中的标签
   * @param {*} event 事件
   */
  chooseTag(event) {
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
  closeTag(event) {
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