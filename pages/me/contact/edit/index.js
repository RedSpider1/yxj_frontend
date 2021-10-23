import Toast from '../../../miniprogram_npm/@vant/weapp/toast/toast';
import Dialog from '../../../miniprogram_npm/@vant/weapp/dialog/dialog';
const http = require('../../../../utils/http')
const enums = require('../../../../utils/enums')

Component({
  data: {
    currentContact: {
      id: 0,
      type: 1,
      userId: '',
      contactInformation: "",
      verificationCode: ""
    },
    contactTypes: [
      
    ]
  },
  methods: {
    saveContact() {
      if(this.data.currentContact.id == 0) {
        http.post('pss/contactinformation', this.data.currentContact).then(res => {
          this.toastAndBack('创建成功')
        })
      } else {
        http.put(`pss/contactinformation/id/${this.data.currentContact.id}`, this.data.currentContact).then(res => {
          this.toastAndBack('修改成功')
        })
      }
    },
    onTypeChange(e) {
      this.setData({
        'currentContact.type': e.detail
      })
    },
    changeInfo(e) {
      this.setData({
        'currentContact.contactInformation': e.detail
      })
    },
    deleteContact() {
      Dialog.confirm({
        title: '确定删除此联系方式？',
        message: '删除后该联系将不可用，确定删除？',
      }).then(() => {
        http.del(`pss/contactinformation/delete/${this.data.currentContact.id}`).then(res => {
          this.toastAndBack('删除成功')
        })
      })
      .catch(() => {});
    },
    toastAndBack(msg) {
      Toast({
        type: 'success',
        message: msg,
        forbidClick: true,
        duration: 1000,
        onClose: () => {
          wx.redirectTo({
            url: '/pages/me/contact/index',
          })
        },
      });
    },
    onLoad: function (options) {
      this.setData({'currentContact.userId': getApp().globalData.userInfo.id})
      const contactTypes = []
      for (const i in enums.contact_type) {
        contactTypes.push({
          value: parseInt(i),
          text: enums.contact_type[i]
        })
      }
      this.setData({contactTypes: contactTypes})

      const eventChannel = this.getOpenerEventChannel()
      eventChannel.on('sendData', data => {
        this.setData({
          'currentContact.id': data.data.id,
          'currentContact.type': data.data.type,
          'currentContact.contactInformation': data.data.value
        })
        console.log(this.data.currentContact)
        console.log(this.data.contactTypes)
      })
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