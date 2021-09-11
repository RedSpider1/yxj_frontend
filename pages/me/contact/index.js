const time = require('../../../utils/time.js')
import Toast from '../../../miniprogram_npm/@vant/weapp/toast/toast';

Component({
  data: {
    contacts: [{
        id: 1,
        type: "手机号",
        value: "12345678"
      },
      {
        id: 2,
        type: "微信号",
        value: "wechatNum"
      },
      {
        id: 3,
        type: "地址",
        value: "南天门"
      },
    ]
  },
  methods: {
    addContact() {
      wx.navigateTo({
        url: '/pages/me/contact/edit/index',
        success: (e2) => {
          e2.eventChannel.emit("contact", {
            id: 0,
            type: "手机号",
            value: ""
          })
        }
      })
    },
    editContact(e) {
      // 这里要判断下是不是第一个联系方式，如果是第一个，不能编辑的 直接return
      let id = e.currentTarget.dataset.item.id
      if(this.data.contacts[0].id == id) {
        return
      }
      wx.navigateTo({
        url: `/pages/me/contact/edit/index?id=${id}`
      })
    },
    onLoad: function (options) {},
    onPullDownRefresh: function () {
      // 下拉刷新时执行
    },
    // 事件响应函数
    viewTap: function () {
      // ...
    }
  }
})