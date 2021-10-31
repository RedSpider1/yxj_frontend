/**
 * 联系方式类型枚举
 */
export const contact_type = {
  0: '手机号',
  1: '微信号',
  2: 'QQ号',
  3: '邮箱'
}

export function getEnumByAlias(alias) {
  for (const item of getApp().globalData.enums) {
    if(item.enumAlias == alias) {
      return item
    }
  }
}