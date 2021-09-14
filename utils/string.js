
export const isEmpty = function (s) {
  return s === null || s === '' || typeof s === 'undefined'
}

export const isNotEmpty = function (s) {
  return !isEmpty(s)
}