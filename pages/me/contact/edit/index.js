import Toast from '../../../miniprogram_npm/@vant/weapp/toast/toast';

Component({
  data: {
    currentContact: {
      id: 0,
      type: "手机号",
      value: ""
    },
    contactTypes: [
      {
        text: '手机号',
        value: '手机号'
      },
      {
        text: '微信号',
        value: '微信号'
      },
      {
        text: 'QQ号',
        value: 'QQ号'
      },
      {
        text: '地址',
        value: '地址'
      },
    ]
  },
  methods: {
    saveContact() {
      this.toastAndBack('保存成功')
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