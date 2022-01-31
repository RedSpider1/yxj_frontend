const computedBehavior = require("../../miniprogram_npm/miniprogram-computed/index").behavior;
const enums = require("../../utils/enums")
const time = require('../../utils/time')
const color = require('../../utils/color')

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
    loading: {
      type: Boolean,
      value: false,
    },
    hasNoMore: {
      type: Boolean,
      value: false,
    }
  },
  computed: {
    wrapperItems(data) {
      for (let item of data.items) {
        let status = item.status
        item.statusLabel = getStatusLabel(status)
        let statusTagType = 'primary'
        if (status == 30) {
          statusTagType = 'success'
        }
        if (status == 40) {
          statusTagType = 'warning'
        }
        item.statusTagType = statusTagType
        item.startTimeStr = time.timestap2Str(item.startTime, 'yyyy-MM-dd hh:mm')

        let labelArray = []
        for (let label of item.labels) {
          for (const v of getApp().globalData.labels) {
            if (label == v.id.toString()) {
              labelArray.push({
                color: v.color,
                name: v.name,
                id: v.id,
              })
            }
          }
        }
        item.labelArray = labelArray
      }
      return data.items
    },
  },
  /**
   * 组件的初始数据
   */
  data: {},

  /**
   * 组件的方法列表
   */
  methods: {
    list() {
      this.triggerEvent('list')
    },
    jmp(event) {
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
    if (item.code == status) {
      return item.description
    }
  }
}