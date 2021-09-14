const time = require('../../../utils/time.js')
const auth = require('../../../utils/auth')
const string = require('../../../utils/string')
const file = require('../../../utils/file')
const request = require('../../../utils/request')
const http = require('../../../utils/http')
import Toast from '../../../miniprogram_npm/@vant/weapp/toast/toast'

Component({
  data: {
    userInfo: {
      img: null,
      nickName: null,
      sex: '男',
      birthday: '1999-01-01',
      slogan: ''
    },
    showSexSheet: false,
    showBirthdaySheet: false,
    sexOptions: [{
        name: '男'
      },
      {
        name: '女'
      },
      {
        name: '保密'
      }
    ],
    minBirthday: new Date(1900, 0, 1).getTime(),
    maxBirthday: Date.now(),
    formatter(type, value) {
      if (type === 'year') {
        return `${value}年`;
      }
      if (type === 'month') {
        return `${value}月`;
      }
      return value;
    },
  },
  methods: {
    editSex() {
      this.setData({
        showSexSheet: true
      })
    },
    onSelectSex(event) {
      this.setData({
        'userInfo.sex': event.detail.name
      })
    },
    closeSex(event) {
      this.setData({
        showSexSheet: false
      })
    },
    editBirthday() {
      this.setData({
        showBirthdaySheet: true
      })
    },
    onSelectBirthday(event) {
      this.setData({
        'userInfo.birthday': time.dateFormat(new Date(event.detail)),
        showBirthdaySheet: false
      })
    },
    closeBirthday() {
      this.setData({
        showBirthdaySheet: false
      })
    },
    saveUserInfo() {
      const userInfo = this.data.userInfo
      http.post(request.updateUserInfo.url, {
        phone: getApp().globalData.userInfo.phone,
        wechatNum: getApp().globalData.userInfo.wechatNum,
        name: userInfo.nickName,
        birthday: userInfo.birthday,
        sex: userInfo.sex === '男' ? 1 : 0,
        avatar: userInfo.img,
        slogan: userInfo.slogan,
      }).then(res => {
        Toast.success('保存成功')
        const globalData = getApp().globalData
        globalData.userInfo.nickname = userInfo.nickName
        globalData.userInfo.birthday = userInfo.birthday
        globalData.userInfo.sex = userInfo.sex === '男' ? 1 : 0
        globalData.userInfo.avatar = userInfo.img
        globalData.userInfo.slogan = userInfo.slogan
        wx.navigateTo({
          url: '/pages/me/index',
        })
      })
    },
    getUserProfile () {
      wx.getUserProfile({
        success: (res) => {
          this.setData({
            'userInfo.nickName': res.userInfo.nickName,
            'userInfo.sex': getSexFromWechatGender(res.userInfo.gender),
            'userInfo.img': res.userInfo.avatarUrl,
          })
        }
      })
    },
    uploadImg() {
      wx.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: (res) => {
          const tempFilePaths = res.tempFilePaths[0]
          file.default.upload(tempFilePaths).then(key => {
            this.setData({
              'userInfo.img': file.default.getImgUrl(key)
            })
          })
        }
      })
    },
    onLoad: function (options) {
      auth.checkLogin()
      const app = getApp()
      const userInfo = {
        img: app.globalData.userInfo.avatar,
        nickName: app.globalData.userInfo.nickname,
        sex: getSexFromWechatGender(app.globalData.userInfo.sex),
        birthday: app.globalData.userInfo.birthday,
        slogan: app.globalData.userInfo.slogan
      }

      this.setData({userInfo: userInfo})
    },
  }
})

function getSexFromWechatGender(gender) {
  if(gender == 1) {
    return '男'
  }
  if(gender == 2) {
    return '女'
  }
  return '保密'
}