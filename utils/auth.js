// //filter.js
// let appData = getApp().globalData;

// export const authFilter = function (pageObj) {
//     if(pageObj.onShow) {
//         let _onShow = pageObj.onShow
//         pageObj.onShow = function () {
//           appData.promise.then(() => {
//             wx.redirectTo({
//               url: "/pages"
//             })
//           }, () => {
//               let currentInstance = getPageInstance()
//               _onShow.call(currentInstance);
//           })
//         }
//     }
//     return pageObj;
// }