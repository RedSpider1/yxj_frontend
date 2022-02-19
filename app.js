const auth = require('./utils/auth')
const enums = require('./utils/enums')

App({
  onLaunch() {
  },
  globalData: {
    themes: {
      primary: '#33B4BC',
      second: '#00CC66',
      third: '#D21DAA'
    },
    windowHeightWithoutHeader: 812,
    windowHeightWithoutHeaderAndFooter: 700,
    systemInfo: {},
    // 后段交互toekn
    authToken: null,
    userInfo: null,
    enums: [],
    labels: [],
    labelName2LabelInfoMap: {},
    initDone: false,
  }
})