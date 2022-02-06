/**
 * 获取随机颜色
 * @returns 随机颜色
 */
export const randomColor = function () {
  let kind = Math.floor(Math.random() * 20)
  // todo qisu 这里尽量都弄深色的。
  switch (kind) {
    case 1:
      return '#000099'
    case 2:
      return '#339933'
    case 3:
      return '#339933'
    case 4:
      return '#660099'
    case 5:
      return '#663333'
    case 6:
      return '#669933'
    case 7:
      return '#9900CC'
    case 8:
      return '#993333'
    case 9:
      return '#996666'
    case 10:
      return '#CC0066'
    case 11:
      return '#CC33CC'
    case 12:
      return '#0000CC'
    case 13:
      return '#006666'
    case 14:
      return '#330033'
    case 15:
      return '#6600CC'
    case 16:
      return '#990033'
    case 17:
      return '#333300'
    case 18:
      return '#996600'
    default:
      return 'gray'
  }
}