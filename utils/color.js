/**
 * 获取随机颜色
 * @returns 随机颜色
 */
export const randomColor = function () {
  let kind = Math.floor(Math.random() * 20)
  // todo qisu 这里尽量都弄深色的。
  switch (kind) {
    case 1:
      return '#CE93D8'
    case 2:
      return '#FF1744'
    case 4:
      return '#FFCDD2'
    case 5:
      return '#F48FB1'
    case 6:
      return '#E57373'
    case 7:
      return '#D1C4E9'
    case 8:
      return '#C5CAE9'
    case 9:
      return '#BBDEFB'
    case 10:
      return '#2196F3'
    case 11:
      return '#B3E5FC'
    case 12:
      return '#039BE5'
    case 13:
      return '#80DEEA'
    case 14:
      return '#00ACC1'
    case 15:
      return '#80CBC4'
    case 16:
      return '#A5D6A7'
    case 17:
      return '#C5E1A5'
    case 18:
      return '#E6EE9C'
    case 19:
      return '#FFF176'
    default:
      return 'gray'
  }
}