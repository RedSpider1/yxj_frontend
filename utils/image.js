const file = require('./file')
const prefix = file.default.getPrefixUrl()
const defaultAvatar = prefix + '202109/08/E83C0E924F5A.jpg'
const backgroundImg = prefix + '202109/09/75900E4B9B58.jpg'
const notFoundImg = prefix + '202109/19/6F9B32384602.jpg'

export {
  defaultAvatar, backgroundImg, notFoundImg
}