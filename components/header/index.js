// components/header-default/index.js
Component({
  options: {
    addGlobalClass: true
  },

  /**
   * 组件的属性列表
   */
  properties: {
    title: {
      type: String,
      value: '友小聚'
    },
    needReturn: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    color: getApp().globalData.curThemeStyle
  },

  /**
   * 组件的方法列表
   */
  methods: {
    back: function () {
      let pages = getCurrentPages()
      if (pages.length === 1) {
        wx.navigateTo({
          url: '/pages/index/index',
        })
        return
      }

      wx.navigateBack({delta: 1})
    }
  }
})
