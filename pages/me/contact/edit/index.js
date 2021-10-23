import Toast from '../../../miniprogram_npm/@vant/weapp/toast/toast';
const http = require('../../../../utils/http')

Component({
  data: {
    currentContact: {
      id: 0,
      type: 1,
      userId: '',
      contactInformation: ""
    },
    contactTypes: [
      {
        text: '手机号',
        value: 0
      },
      {
        text: '微信号',
        value: 1
      }
    ]
  },
  methods: {
    saveContact() {
      http.post('pss/contactinformation', this.data.currentContact).then(res => {
        this.toastAndBack('保存成功')
      })
    },
    deleteContact() {
      this.toastAndBack('删除成功')
    },
    toastAndBack(msg) {
      Toast({
        type: 'success',
        message: msg,
        forbidClick: true,
        duration: 1000,
        onClose: () => {
          wx.navigateTo({
            url: '/pages/me/contact/index',
          })
        },
      });
    },
    onLoad: function (options) {
      this.setData({'currentContact.userId': getApp().globalData.userInfo.id})
      if(options.id != 0) {
        // todo 这里通过id从后台拿联系方式，然后设值
        this.setData({
          // currentContact: { ...data }
        })
      }
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