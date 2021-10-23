const auth = require('../../../utils/auth')
const http = require('../../../utils/http')
const enums = require('../../../utils/enums')


Component({
  data: {
    contacts: [],
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
      if (this.data.contacts[0].id == id) {
        return
      }
      wx.navigateTo({
        url: `/pages/me/contact/edit/index?id=${id}`,
        success: function (res) {
          res.eventChannel.emit('sendData', {
            data: e.currentTarget.dataset.item
          })
        }
      })
    },
    onLoad: function (options) {
      auth.checkLogin()

      const userInfo = getApp().globalData.userInfo
      const contacts = []
      http.get('pss/contactinformation/', null, false).then(res => {
        for (const contact of res) {
          contacts.push({
            id: contact.id,
            type: contact.type,
            typeStr: this.getContactStr(contact.type),
            value: contact.contactInformation,
          })
        }
        this.setData({
          contacts: contacts
        })
      })
    },
    getContactStr(type) {
      return enums.contact_type[type]
    }
  }
})