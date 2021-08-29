const time = require('../../../utils/time.js')
import Toast from '../../../miniprogram_npm/@vant/weapp/toast/toast';

Component({
  data: {
    text: "This is page data.",
    userInfo: {
      img: 'https://img.yzcdn.cn/vant/cat.jpeg',
      nickName: '叮当猫',
      phoneNum: '13112345678',
      wechatNum: 'mywechat',
      sex: '男',
      birthday: '1999-01-01',
      slogan: '个性签名限制50字'
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
    useWechatInfo() {
      wx.getUserInfo({
        success: (res => {

        })
      });
    },
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
      // todo 回调
      Toast.success('保存成功');
    },
    bindGetUserInfo (e) {
      const userInfo = e.detail.userInfo
      this.setData({
        'userInfo.img': userInfo.avatarUrl,
        'userInfo.nickName': userInfo.nickName,
        'userInfo.sex': userInfo.gender,
      })
    },

    onLoad: function (options) {
    },
    onPullDownRefresh: function () {
      // 下拉刷新时执行
    },
    // 事件响应函数
    viewTap: function () {
      // ...
    }
  }
})