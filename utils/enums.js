const http = require('./http')
const request = require('./request')

/**
 * 组队单状态枚举
 */
export const team_status = {
  0: '未开始',
  1: '组队中',
  2: '已成功',
  3: '已失败',
  4: '已废弃'
}

export function getEnums () {
  http.get(request.getEnums.url, null, false).then((res) => {
    // todo qisu 这个接口没数据
    console.log(res)
  })
}
