/**
 * 时间日期格式化
 * @param date 日期对象
 * @param fmt 格式化模板字符串，默认为'yyyy-MM-dd'
 * @returns {string} 格式化后的字符串
 * 使用Demo： dateFormat(new Date(), "yyyy-MM-dd hh:mm:ss")
 */
export const dateFormat = function (date, fmt = 'yyyy-MM-dd') {
  let o = {
    "M+": date.getMonth() + 1, //月份
    "d+": date.getDate(), //日
    "h+": date.getHours(), //小时
    "m+": date.getMinutes(), //分
    "s+": date.getSeconds(), //秒
    "q+": Math.floor((date.getMonth() + 3) / 3), //季度
    "S": date.getMilliseconds() //毫秒
  }
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length))
  for (let k in o)
    if (new RegExp("(" + k + ")").test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)))
    }
  return fmt
}

export function timestap2Str (timestap, fmt='yyyy-MM-dd hh:mm:ss') {
  // return new Date(timestap).toISOString().replace('T', ' ').replace('.000Z', '')
  return dateFormat(new Date(timestap), fmt)
}

export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}