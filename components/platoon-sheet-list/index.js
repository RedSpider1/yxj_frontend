Component({
  /**
   * 组件的属性列表
   * 
   * items:
   *  id
   *  title
   *  introduce
   *  subtitle
   *  person
   *  status
   */
  properties: {
    items: {
      type: Array,
      value: []
    },
    height: {
      type: Number,
      value: 0
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
  },

  /**
   * 组件的方法列表
   */
  methods: {
    list () {
      this.triggerEvent('list')
    },
    jmp (event) {
      let id = event.currentTarget.dataset.id
      wx.navigateTo({
        url: `/pages/home/platoon-detail/index?id=${id}`,
      })
    }
  },
})
