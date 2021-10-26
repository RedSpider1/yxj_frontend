const http = require('./http')
const request = require('./request')
const time = require('./time')
const string = require('./string')

export default {
  getImgUrl (key) {
    if (string.isEmpty(key)) {
      return null
    } else if (key.startsWith('http')) {
      return key
    } else {
      return this.getPrefixUrl() + key
    }
  },

  getPrefixUrl () {
    return 'https://file.youxiaoju.com/'
  },

  //移除数组中的某个元素
  removeArrayChild (array, element) {
    for(let i = 0; i < array.length; i++) {
      if(array[i] === element){
        array.splice(i, 1)
        break
      }
    }
  },

  //得到随机的uuid
  getUUID(length, radix) {
    let chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')
    let uuid = [], i
    radix = radix || chars.length
    if (length) {
      for (i = 0; i < length; i++) {
        uuid[i] = chars[0 | Math.random() * radix]
      }
    }
    else {
      let r
      uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-'
      uuid[14] = '4'
      for (i = 0; i < 36; i++) {
        if (!uuid[i]) {
          r = 0 | Math.random() * 16
          uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r]
        }
      }
    }
    return uuid.join('')
  },

  /**
   * 得到文件随机路径
   * @param prefix 路径前缀，默认为空
   * @returns {string} 生成的路径
   */
  getRandomFilePath(prefix = ''){
    return prefix + time.dateFormat(new Date(), 'yyyyMM/dd/') + this.getUUID(12, 16)
  },

  /**
   * 表单上传文件
   * @param formdata
   * @returns {Promise} 上传的Promise对象
   * 使用Demo： this.$util.upload(formdata).then( () => { something... })
   */
  upload(file) { 
    return new Promise((resolve, reject) => {
      http.get(request.getFileToken.url).then(token => {
        let key = this.getRandomFilePath() + '.jpg'
        wx.uploadFile({
          url: 'https://upload-z2.qiniup.com',
          filePath: file,
          name: 'file',
          formData: {token: token, key: key},
          success (res) {
            let ossKey = JSON.parse(res.data).key
            http.post('/pss/resource', [{
                // id: 0,
                name: ossKey,
                ossKey: ossKey,
                path: ossKey
            }]).then(x => {
              resolve({
                key: ossKey,
                id: x[0]
              })
            }).catch(x => {
              reject(x)
            })
          },
          fail (res) {
            reject(res)
          }
        })
      })
    })
  },

  /**
   * 深度克隆
   * @param obj 原对象
   * @returns {{} & proto & any}
   */
  deepClone(obj) {
    var proto = Object.getPrototypeOf(obj)
    return Object.assign({}, Object.create(proto), obj)
  }
}