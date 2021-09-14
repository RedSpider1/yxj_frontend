const auth = require('../../../utils/auth')
const string = require('../../../utils/string')

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
    onLoad: function (options) {
      auth.checkLogin()

      const userInfo = getApp().globalData.userInfo
      const contacts = []
      contacts.push({
        id: 1,
        type: "手机号",
        value: userInfo.phone,
      })

      if (string.isNotEmpty(userInfo.wechatNum)) {
        contacts.push({
          id: 2,
          type: "微信号",
          value: userInfo.wechatNum,
        })
      }

      this.setData({contacts: contacts})
    },
  }
})