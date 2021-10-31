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
        let status = item.status
        item.statusLabel = getStatusLabel(status)
        let statusTagType = 'primary'
        if(status === 'SUCCESS') {
          statusTagType = 'success'
        }
        if(status === 'FAIL' || status === 'CANCEL') {
          statusTagType = 'warning'
        }
        item.statusTagType = statusTagType
        item.circleValue = (1 - item.condition.currentTeamSize * 1.0 / item.condition.minTeamSize) * 100
        item.startTimeStr = time.timestap2Str(item.startTime)
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
    getStatusLabel(status) {
      statusList = enums.getEnumByAlias('组队单状态')
      console.log(statusList)
    },
    list() {
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

function getStatusLabel(status) {
  const statusList = enums.getEnumByAlias('组队单状态').enumDescriptionVOS
  for (const item of statusList) {
    if (item.code = status) {
      return item.description
    }
  }
}
