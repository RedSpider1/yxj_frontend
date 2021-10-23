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

/**
 * 联系方式类型枚举
 */
export const contact_type = {
  0: '手机号',
  1: '微信号',
  2: 'QQ号',
  3: '邮箱'
}

export function getEnums () {
  http.get(request.getEnums.url, null, false).then((res) => {
    // todo qisu 这个接口没数据
    console.log(res)
  })
}
