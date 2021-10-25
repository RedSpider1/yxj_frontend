const computedBehavior = require("../../miniprogram_npm/miniprogram-computed/index").behavior;
const enums = require("../../utils/enums")
const time = require('../../utils/time')

Component({
  behaviors: [computedBehavior],
  options: {
    addGlobalClass: true
  },
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
      value: [],
    },
    height: {
      type: Number,
      value: 0
    },
  },
  computed: {
    wrapperItems(data) {
      for(let item of data.items) {
        let status = item.teamStatus
        item.statusLabel = enums.team_status[status]
        var statusTagType = 'primary'
          if(status == 1) {
            statusTagType =  'primary'
          }
          if(status == 2) {
            statusTagType = 'success'
          }
          if(status == 3) {
            statusTagType = 'warning'
          }
        item.statusTagType = statusTagType
        item.circleValue = (1 - item.currentJoinNum * 1.0 / item.needNum) * 100
        item.startTime = new Date(item.startTime).toISOString()
      }
      return data.items
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
    list() {
      this.triggerEvent('list')
    },
    getStatus(item) {
      console.log(item)
    },
    jmp (event) {
      let id = event.currentTarget.dataset.id
      wx.navigateTo({
        url: `/pages/home/platoon-detail/index?id=${id}`,
      })
    }
  },
})
