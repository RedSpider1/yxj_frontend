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
      Toast.success('保存成功');
      wx.navigateTo({
        url: '/pages/me/contact/index',
      })
    },
    deleteContact() {
      Toast.success('删除成功');
      wx.navigateTo({
        url: '/pages/me/contact/index',
      })
    },
    onLoad: function (options) {
      this.getOpenerEventChannel().on("contact", (data) => {
        // todo 这里可以找一下api或者抽一个公共函数，复制对象属性
        this.setData({
          'currentContact.id': data.id,
          'currentContact.type': data.type,
          'currentContact.value': data.value,
        })
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